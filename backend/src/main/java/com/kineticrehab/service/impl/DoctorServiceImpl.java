package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.DoctorEstadoRequestDTO;
import com.kineticrehab.dto.request.DoctorRequestDTO;
import com.kineticrehab.dto.request.HorarioRequestDTO;
import com.kineticrehab.dto.response.DoctorHorariosResponseDTO;
import com.kineticrehab.dto.response.DoctorResponseDTO;
import com.kineticrehab.dto.response.HorarioResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.DuplicateEntityException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.DoctorMapper;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.HorarioDoctor;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.repository.DoctorRepository;
import com.kineticrehab.repository.HorarioDoctorRepository;
import com.kineticrehab.repository.UsuarioRepository;
import com.kineticrehab.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final HorarioDoctorRepository horarioDoctorRepository;
    private final UsuarioRepository usuarioRepository;
    private final DoctorMapper doctorMapper;

    @Override
    public List<DoctorResponseDTO> listarTodos() {
        log.info("Listando todos los doctores activos");
        return doctorRepository.findAllByDeletedAtIsNullOrderByApellidosAsc().stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponseDTO buscarPorId(Long id) {
        return doctorRepository.findByIdAndDeletedAtIsNull(id)
                .map(doctorMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public DoctorResponseDTO crear(DoctorRequestDTO dto) {
        log.info("Creando nuevo doctor: {} {}", dto.getNombres(), dto.getApellidos());

        if (doctorRepository.existsByDni(dto.getDni())) {
            throw new DuplicateEntityException("El DNI '" + dto.getDni() + "' ya está registrado");
        }

        Doctor doctor = doctorMapper.toEntity(dto);
        doctor = doctorRepository.save(doctor);
        log.info("Doctor creado exitosamente: {} {}", doctor.getNombres(), doctor.getApellidos());
        return doctorMapper.toDTO(doctor);
    }

    @Override
    @Transactional
    public DoctorResponseDTO actualizar(Long id, DoctorRequestDTO dto) {
        log.info("Actualizando doctor con id: {}", id);

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + id));

        if (dto.getDni() != null
                && !dto.getDni().equals(doctor.getDni())
                && doctorRepository.existsByDni(dto.getDni())) {
            throw new DuplicateEntityException("El DNI '" + dto.getDni() + "' ya está registrado");
        }

        doctor.setNombres(dto.getNombres());
        doctor.setApellidos(dto.getApellidos());
        doctor.setDni(dto.getDni());
        doctor.setEspecialidad(dto.getEspecialidad());
        doctor.setCmp(dto.getCmp());
        doctor.setTelefono(dto.getTelefono());
        doctor.setCorreo(dto.getCorreo());

        doctor = doctorRepository.save(doctor);
        log.info("Doctor actualizado exitosamente: {} {}", doctor.getNombres(), doctor.getApellidos());
        return doctorMapper.toDTO(doctor);
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, DoctorEstadoRequestDTO dto) {
        log.info("Cambiando estado del doctor con id: {} a activo={}", id, dto.getActivo());

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + id));

        doctor.setActivo(dto.getActivo());
        doctorRepository.save(doctor);
        log.info("Estado actualizado para doctor: {} {}", doctor.getNombres(), doctor.getApellidos());
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando (soft delete) doctor con id: {}", id);

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + id));

        doctor.setDeletedAt(LocalDateTime.now());
        doctor.setActivo(false);
        doctorRepository.save(doctor);
        log.info("Doctor eliminado: {} {}", doctor.getNombres(), doctor.getApellidos());
    }

    @Override
    public List<DoctorResponseDTO> buscarPorTermino(String termino) {
        log.info("Buscando doctores con término: {}", termino);

        List<DoctorResponseDTO> porNombre = doctorRepository
                .findByNombresContainingIgnoreCaseAndDeletedAtIsNullOrApellidosContainingIgnoreCaseAndDeletedAtIsNull(
                        termino, termino)
                .stream().map(doctorMapper::toDTO).collect(Collectors.toList());

        List<DoctorResponseDTO> porDni = doctorRepository
                .findByDniContainingAndDeletedAtIsNull(termino)
                .stream().map(doctorMapper::toDTO).collect(Collectors.toList());

        List<DoctorResponseDTO> porEspecialidad = doctorRepository
                .findByEspecialidadContainingIgnoreCaseAndDeletedAtIsNull(termino)
                .stream().map(doctorMapper::toDTO).collect(Collectors.toList());

        return Stream.of(porNombre, porDni, porEspecialidad)
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponseDTO> listarDisponibles() {
        log.info("Listando doctores activos disponibles");
        return doctorRepository.findByActivoTrueAndDeletedAtIsNullOrderByApellidosAsc().stream()
                .map(doctorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponseDTO buscarPorUsernameUsuario(String username) {
        log.info("Buscando perfil de doctor para el usuario: {}", username);
        Usuario usuario = usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
        return doctorRepository.findByUsuarioIdAndDeletedAtIsNull(usuario.getId())
                .map(doctorMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró un perfil de doctor para el usuario: " + username));
    }

    @Override
    public DoctorHorariosResponseDTO obtenerHorarios(Long doctorId) {
        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + doctorId));

        List<HorarioDoctor> horarios = horarioDoctorRepository
                .findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc(doctorId);

        return doctorMapper.toDoctorHorariosDTO(doctor, horarios);
    }

    @Override
    @Transactional
    public List<HorarioResponseDTO> actualizarHorarios(Long doctorId, List<HorarioRequestDTO> horariosDTO) {
        log.info("Actualizando horarios del doctor con id: {}", doctorId);

        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + doctorId));

        validarHorarios(horariosDTO);

        List<HorarioDoctor> existentes = horarioDoctorRepository
                .findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc(doctorId);

        existentes.forEach(h -> h.setDeletedAt(LocalDateTime.now()));
        horarioDoctorRepository.saveAll(existentes);

        List<HorarioDoctor> nuevos = horariosDTO.stream()
                .map(dto -> HorarioDoctor.builder()
                        .doctor(doctor)
                        .diaSemana(dto.getDiaSemana())
                        .horaInicio(dto.getHoraInicio())
                        .horaFin(dto.getHoraFin())
                        .build())
                .collect(Collectors.toList());

        nuevos = horarioDoctorRepository.saveAll(nuevos);
        log.info("Horarios actualizados para doctor: {} {}", doctor.getNombres(), doctor.getApellidos());

        return nuevos.stream()
                .map(doctorMapper::toHorarioDTO)
                .collect(Collectors.toList());
    }

    private void validarHorarios(List<HorarioRequestDTO> horarios) {
        for (int i = 0; i < horarios.size(); i++) {
            HorarioRequestDTO h = horarios.get(i);

            if (h.getHoraInicio() != null && h.getHoraFin() != null
                    && !h.getHoraInicio().isBefore(h.getHoraFin())) {
                throw new BadRequestException(
                        "La hora de inicio debe ser anterior a la hora de fin (" + h.getDiaSemana() + ")");
            }

            for (int j = i + 1; j < horarios.size(); j++) {
                HorarioRequestDTO otro = horarios.get(j);
                if (h.getDiaSemana().equals(otro.getDiaSemana())
                        && h.getHoraInicio().isBefore(otro.getHoraFin())
                        && h.getHoraFin().isAfter(otro.getHoraInicio())) {
                    throw new BadRequestException(
                            "Los horarios se cruzan para el día " + h.getDiaSemana());
                }
            }
        }
    }
}
