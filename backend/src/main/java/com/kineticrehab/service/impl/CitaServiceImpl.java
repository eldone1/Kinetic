package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.CitaEstadoRequestDTO;
import com.kineticrehab.dto.request.CitaRequestDTO;
import com.kineticrehab.dto.response.CitaResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.CitaMapper;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.HorarioDoctor;
import com.kineticrehab.model.Paciente;
import com.kineticrehab.model.Servicio;
import com.kineticrehab.repository.CitaRepository;
import com.kineticrehab.repository.DoctorRepository;
import com.kineticrehab.repository.HorarioDoctorRepository;
import com.kineticrehab.repository.PacienteRepository;
import com.kineticrehab.repository.ServicioRepository;
import com.kineticrehab.repository.VentaRepository;
import com.kineticrehab.service.CitaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepository;
    private final DoctorRepository doctorRepository;
    private final HorarioDoctorRepository horarioDoctorRepository;
    private final PacienteRepository pacienteRepository;
    private final ServicioRepository servicioRepository;
    private final VentaRepository ventaRepository;
    private final CitaMapper citaMapper;

    private static final Map<DayOfWeek, String> DIAS = Map.of(
            DayOfWeek.MONDAY, "LUNES",
            DayOfWeek.TUESDAY, "MARTES",
            DayOfWeek.WEDNESDAY, "MIERCOLES",
            DayOfWeek.THURSDAY, "JUEVES",
            DayOfWeek.FRIDAY, "VIERNES",
            DayOfWeek.SATURDAY, "SABADO",
            DayOfWeek.SUNDAY, "DOMINGO"
    );

    @Override
    public List<CitaResponseDTO> listarTodas() {
        log.info("Listando todas las citas activas");
        return citaRepository.findAllByDeletedAtIsNullOrderByFechaAscHoraInicioAsc().stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CitaResponseDTO buscarPorId(Long id) {
        return citaRepository.findByIdAndDeletedAtIsNull(id)
                .map(citaMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));
    }

    @Override
    public List<CitaResponseDTO> listarPorDoctor(Long doctorId) {
        log.info("Listando citas del doctor con id: {}", doctorId);
        return citaRepository.findByDoctorIdAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(doctorId).stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaResponseDTO> listarPorPaciente(Long pacienteId) {
        log.info("Listando citas del paciente con id: {}", pacienteId);
        return citaRepository.findByPacienteIdAndDeletedAtIsNullOrderByFechaDescHoraInicioDesc(pacienteId).stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaResponseDTO> listarPorFecha(LocalDate fecha) {
        log.info("Listando citas para la fecha: {}", fecha);
        return citaRepository.findByFechaAndDeletedAtIsNullOrderByHoraInicioAsc(fecha).stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaResponseDTO> listarPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Listando citas entre {} y {}", fechaInicio, fechaFin);
        return citaRepository.findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(fechaInicio, fechaFin).stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitaResponseDTO> listarPorEstado(String estado) {
        log.info("Listando citas con estado: {}", estado);
        return citaRepository.findByEstadoAndDeletedAtIsNull(estado).stream()
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CitaResponseDTO crear(CitaRequestDTO dto) {
        log.info("Creando nueva cita para paciente {} con doctor {} en fecha {}",
                dto.getIdPaciente(), dto.getIdDoctor(), dto.getFecha());

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(dto.getIdPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.getIdPaciente()));

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(dto.getIdDoctor())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + dto.getIdDoctor()));

        Servicio servicio = servicioRepository.findByIdAndDeletedAtIsNull(dto.getIdServicio())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + dto.getIdServicio()));

        validarHorario(dto.getHoraInicio(), dto.getHoraFin());
        validarHorarioDoctor(dto.getIdDoctor(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());
        validarSinCruces(null, dto.getIdDoctor(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

        Cita cita = citaMapper.toEntity(dto, paciente, doctor, servicio);
        cita = citaRepository.save(cita);
        log.info("Cita creada exitosamente con id: {}", cita.getId());
        return citaMapper.toDTO(cita);
    }

    @Override
    @Transactional
    public CitaResponseDTO actualizar(Long id, CitaRequestDTO dto) {
        log.info("Actualizando cita con id: {}", id);

        Cita cita = citaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(dto.getIdPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.getIdPaciente()));

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(dto.getIdDoctor())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + dto.getIdDoctor()));

        Servicio servicio = servicioRepository.findByIdAndDeletedAtIsNull(dto.getIdServicio())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + dto.getIdServicio()));

        validarHorario(dto.getHoraInicio(), dto.getHoraFin());
        validarHorarioDoctor(dto.getIdDoctor(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());
        validarSinCruces(id, dto.getIdDoctor(), dto.getFecha(), dto.getHoraInicio(), dto.getHoraFin());

        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setServicio(servicio);
        cita.setPrecio(servicio.getPrecio());
        cita.setFecha(dto.getFecha());
        cita.setHoraInicio(dto.getHoraInicio());
        cita.setHoraFin(dto.getHoraFin());
        cita.setObservaciones(dto.getObservaciones());

        cita = citaRepository.save(cita);
        log.info("Cita actualizada exitosamente con id: {}", cita.getId());
        return citaMapper.toDTO(cita);
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, CitaEstadoRequestDTO dto) {
        log.info("Cambiando estado de cita {} a {}", id, dto.getEstado());

        Cita cita = citaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));

        cita.setEstado(dto.getEstado());
        citaRepository.save(cita);
        log.info("Estado actualizado para cita con id: {}", id);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando (soft delete) cita con id: {}", id);

        Cita cita = citaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + id));

        cita.setDeletedAt(LocalDateTime.now());
        citaRepository.save(cita);
        log.info("Cita eliminada con id: {}", id);
    }

    @Override
    public List<CitaResponseDTO> listarPendientesPago(Long pacienteId) {
        log.info("Listando citas pendientes de pago del paciente: {}", pacienteId);
        return citaRepository.findByPacienteIdAndDeletedAtIsNullOrderByFechaDescHoraInicioDesc(pacienteId).stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()))
                .filter(c -> ventaRepository.findByCitaIdAndDeletedAtIsNull(c.getId()).isEmpty())
                .map(citaMapper::toDTO)
                .collect(Collectors.toList());
    }

    private void validarHorario(LocalTime horaInicio, LocalTime horaFin) {
        if (horaInicio != null && horaFin != null && !horaInicio.isBefore(horaFin)) {
            throw new BadRequestException("La hora de inicio debe ser anterior a la hora de fin");
        }
    }

    private void validarHorarioDoctor(Long doctorId, LocalDate fecha,
                                       LocalTime horaInicio, LocalTime horaFin) {
        String diaSemana = DIAS.get(fecha.getDayOfWeek());

        List<HorarioDoctor> horarios = horarioDoctorRepository
                .findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc(doctorId).stream()
                .filter(h -> h.getDiaSemana().equals(diaSemana))
                .toList();

        if (horarios.isEmpty()) {
            String nombreDia = diaSemana.charAt(0) + diaSemana.substring(1).toLowerCase();
            throw new BadRequestException("El doctor no atiende los " + nombreDia);
        }

        boolean dentroDeHorario = horarios.stream().anyMatch(h ->
                !horaInicio.isBefore(h.getHoraInicio()) && !horaFin.isAfter(h.getHoraFin()));

        if (!dentroDeHorario) {
            String bloques = horarios.stream()
                    .map(h -> h.getHoraInicio() + " - " + h.getHoraFin())
                    .collect(Collectors.joining(", "));
            throw new BadRequestException(
                    "La cita debe estar dentro del horario del doctor (" + bloques + ")");
        }
    }

    private void validarSinCruces(Long citaId, Long doctorId, LocalDate fecha,
                                   LocalTime horaInicio, LocalTime horaFin) {
        List<Cita> existentes = citaRepository
                .findByDoctorIdAndFechaAndDeletedAtIsNullOrderByHoraInicioAsc(doctorId, fecha);

        for (Cita existente : existentes) {
            if (citaId != null && existente.getId().equals(citaId)) {
                continue;
            }
            if (horaInicio.isBefore(existente.getHoraFin())
                    && horaFin.isAfter(existente.getHoraInicio())) {
                throw new BadRequestException(
                        "El doctor ya tiene una cita programada en ese horario ("
                                + existente.getHoraInicio() + " - " + existente.getHoraFin() + ")");
            }
        }
    }
}
