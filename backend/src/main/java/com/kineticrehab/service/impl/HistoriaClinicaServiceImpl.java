package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.*;
import com.kineticrehab.dto.response.*;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.*;
import com.kineticrehab.model.*;
import com.kineticrehab.repository.*;
import com.kineticrehab.service.HistoriaClinicaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoriaClinicaServiceImpl implements HistoriaClinicaService {

    private final HistoriaClinicaRepository hcRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final TratamientoRepository tratamientoRepository;
    private final SesionRepository sesionRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;
    private final CitaRepository citaRepository;
    private final HistoriaClinicaMapper hcMapper;
    private final EvaluacionMapper evaluacionMapper;
    private final TratamientoMapper tratamientoMapper;
    private final SesionMapper sesionMapper;

    private BigDecimal calcularImc(BigDecimal peso, BigDecimal tallaCm) {
        if (peso == null || tallaCm == null || tallaCm.compareTo(BigDecimal.ZERO) <= 0) return null;
        BigDecimal tallaM = tallaCm.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
        return peso.divide(tallaM.multiply(tallaM), 1, RoundingMode.HALF_UP);
    }

    // ==================== HISTORIAS CLÍNICAS ====================

    @Override
    public List<HistoriaClinicaResponseDTO> listarTodas() {
        log.info("Listando todas las historias clínicas activas");
        return hcRepository.findAllByDeletedAtIsNullOrderByFechaAperturaDesc().stream()
                .map(hcMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HistoriaClinicaResponseDTO buscarPorId(Long id) {
        return hcRepository.findByIdAndDeletedAtIsNull(id)
                .map(hcMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada con id: " + id));
    }

    @Override
    public HistoriaClinicaResponseDTO buscarPorPaciente(Long pacienteId) {
        return hcRepository.findByPacienteIdAndDeletedAtIsNull(pacienteId)
                .map(hcMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró historia clínica para el paciente con id: " + pacienteId));
    }

    @Override
    public boolean existePorPaciente(Long pacienteId) {
        return hcRepository.existsByPacienteIdAndDeletedAtIsNull(pacienteId);
    }

    @Override
    @Transactional
    public HistoriaClinicaResponseDTO crear(HistoriaClinicaRequestDTO dto) {
        log.info("Creando historia clínica para paciente {}", dto.getIdPaciente());

        if (hcRepository.existsByPacienteIdAndDeletedAtIsNull(dto.getIdPaciente())) {
            throw new BadRequestException("El paciente ya tiene una historia clínica activa");
        }

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(dto.getIdPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.getIdPaciente()));

        HistoriaClinica hc = hcMapper.toEntity(dto, paciente);

        if (dto.getImc() == null && dto.getPeso() != null && dto.getTalla() != null) {
            hc.setImc(calcularImc(dto.getPeso(), dto.getTalla()));
        }

        hc = hcRepository.save(hc);
        log.info("Historia clínica creada con id: {}", hc.getId());
        return hcMapper.toDTO(hc);
    }

    @Override
    @Transactional
    public HistoriaClinicaResponseDTO actualizar(Long id, HistoriaClinicaRequestDTO dto) {
        log.info("Actualizando historia clínica con id: {}", id);
        HistoriaClinica hc = hcRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada con id: " + id));
        hcMapper.updateEntity(hc, dto);

        if (dto.getImc() == null && dto.getPeso() != null && dto.getTalla() != null) {
            hc.setImc(calcularImc(dto.getPeso(), dto.getTalla()));
        }

        hc = hcRepository.save(hc);
        return hcMapper.toDTO(hc);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando historia clínica con id: {}", id);
        HistoriaClinica hc = hcRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada con id: " + id));
        hc.setDeletedAt(LocalDateTime.now());
        hcRepository.save(hc);
    }

    // ==================== EVALUACIONES ====================

    @Override
    public List<EvaluacionResponseDTO> listarEvaluaciones(Long historiaClinicaId) {
        log.info("Listando evaluaciones de HC {}", historiaClinicaId);
        return evaluacionRepository.findByHistoriaClinicaIdAndDeletedAtIsNullOrderByFechaDesc(historiaClinicaId)
                .stream().map(evaluacionMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public EvaluacionResponseDTO buscarEvaluacion(Long id) {
        return evaluacionRepository.findByIdAndDeletedAtIsNull(id)
                .map(evaluacionMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluación no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public EvaluacionResponseDTO crearEvaluacion(EvaluacionRequestDTO dto) {
        log.info("Creando evaluación {} para HC {}", dto.getTipo(), dto.getIdHistoriaClinica());
        HistoriaClinica hc = hcRepository.findByIdAndDeletedAtIsNull(dto.getIdHistoriaClinica())
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada con id: " + dto.getIdHistoriaClinica()));
        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(dto.getIdDoctor())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + dto.getIdDoctor()));
        Evaluacion eval = evaluacionMapper.toEntity(dto, hc, doctor);
        eval = evaluacionRepository.save(eval);
        return evaluacionMapper.toDTO(eval);
    }

    @Override
    @Transactional
    public EvaluacionResponseDTO actualizarEvaluacion(Long id, EvaluacionRequestDTO dto) {
        log.info("Actualizando evaluación con id: {}", id);
        Evaluacion eval = evaluacionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluación no encontrada con id: " + id));
        evaluacionMapper.updateEntity(eval, dto);
        eval = evaluacionRepository.save(eval);
        return evaluacionMapper.toDTO(eval);
    }

    @Override
    @Transactional
    public void eliminarEvaluacion(Long id) {
        log.info("Eliminando evaluación con id: {}", id);
        Evaluacion eval = evaluacionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluación no encontrada con id: " + id));
        eval.setDeletedAt(LocalDateTime.now());
        evaluacionRepository.save(eval);
    }

    // ==================== TRATAMIENTOS ====================

    @Override
    public List<TratamientoResponseDTO> listarTratamientos(Long historiaClinicaId) {
        log.info("Listando tratamientos de HC {}", historiaClinicaId);
        return tratamientoRepository.findByHistoriaClinicaIdAndDeletedAtIsNullOrderByFechaInicioDesc(historiaClinicaId)
                .stream().map(tratamientoMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public TratamientoResponseDTO buscarTratamiento(Long id) {
        return tratamientoRepository.findByIdAndDeletedAtIsNull(id)
                .map(tratamientoMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public TratamientoResponseDTO crearTratamiento(TratamientoRequestDTO dto) {
        log.info("Creando tratamiento para HC {}", dto.getIdHistoriaClinica());
        HistoriaClinica hc = hcRepository.findByIdAndDeletedAtIsNull(dto.getIdHistoriaClinica())
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada con id: " + dto.getIdHistoriaClinica()));
        Doctor doctor = doctorRepository.findByIdAndDeletedAtIsNull(dto.getIdDoctor())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado con id: " + dto.getIdDoctor()));
        Evaluacion evaluacion = null;
        if (dto.getIdEvaluacion() != null) {
            evaluacion = evaluacionRepository.findByIdAndDeletedAtIsNull(dto.getIdEvaluacion())
                    .orElseThrow(() -> new ResourceNotFoundException("Evaluación no encontrada con id: " + dto.getIdEvaluacion()));
        }
        Tratamiento trat = tratamientoMapper.toEntity(dto, hc, evaluacion, doctor);
        trat = tratamientoRepository.save(trat);
        return tratamientoMapper.toDTO(trat);
    }

    @Override
    @Transactional
    public TratamientoResponseDTO actualizarTratamiento(Long id, TratamientoRequestDTO dto) {
        log.info("Actualizando tratamiento con id: {}", id);
        Tratamiento trat = tratamientoRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con id: " + id));
        Evaluacion evaluacion = null;
        if (dto.getIdEvaluacion() != null) {
            evaluacion = evaluacionRepository.findByIdAndDeletedAtIsNull(dto.getIdEvaluacion())
                    .orElseThrow(() -> new ResourceNotFoundException("Evaluación no encontrada con id: " + dto.getIdEvaluacion()));
        }
        tratamientoMapper.updateEntity(trat, dto, evaluacion);
        trat = tratamientoRepository.save(trat);
        return tratamientoMapper.toDTO(trat);
    }

    @Override
    @Transactional
    public void cambiarEstadoTratamiento(Long id, TratamientoEstadoRequestDTO dto) {
        log.info("Cambiando estado de tratamiento {} a {}", id, dto.getEstado());
        Tratamiento trat = tratamientoRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con id: " + id));
        trat.setEstado(dto.getEstado());
        tratamientoRepository.save(trat);
    }

    @Override
    @Transactional
    public void eliminarTratamiento(Long id) {
        log.info("Eliminando tratamiento con id: {}", id);
        Tratamiento trat = tratamientoRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con id: " + id));
        trat.setDeletedAt(LocalDateTime.now());
        tratamientoRepository.save(trat);
    }

    // ==================== SESIONES ====================

    @Override
    public List<SesionResponseDTO> listarSesiones(Long tratamientoId) {
        log.info("Listando sesiones del tratamiento {}", tratamientoId);
        return sesionRepository.findByTratamientoIdAndDeletedAtIsNullOrderByNumeroSesionAsc(tratamientoId)
                .stream().map(sesionMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public SesionResponseDTO buscarSesion(Long id) {
        return sesionRepository.findByIdAndDeletedAtIsNull(id)
                .map(sesionMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public SesionResponseDTO crearSesion(SesionRequestDTO dto) {
        log.info("Creando sesión para tratamiento {}", dto.getIdTratamiento());
        Tratamiento tratamiento = tratamientoRepository.findByIdAndDeletedAtIsNull(dto.getIdTratamiento())
                .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado con id: " + dto.getIdTratamiento()));
        Cita cita = null;
        if (dto.getIdCita() != null) {
            cita = citaRepository.findByIdAndDeletedAtIsNull(dto.getIdCita())
                    .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + dto.getIdCita()));
        }
        Sesion sesion = sesionMapper.toEntity(dto, tratamiento, cita);
        sesion = sesionRepository.save(sesion);
        return sesionMapper.toDTO(sesion);
    }

    @Override
    @Transactional
    public SesionResponseDTO actualizarSesion(Long id, SesionRequestDTO dto) {
        log.info("Actualizando sesión con id: {}", id);
        Sesion sesion = sesionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada con id: " + id));
        Cita cita = null;
        if (dto.getIdCita() != null) {
            cita = citaRepository.findByIdAndDeletedAtIsNull(dto.getIdCita())
                    .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + dto.getIdCita()));
        }
        sesionMapper.updateEntity(sesion, dto, cita);
        sesion = sesionRepository.save(sesion);
        return sesionMapper.toDTO(sesion);
    }

    @Override
    @Transactional
    public void cambiarEstadoSesion(Long id, SesionEstadoRequestDTO dto) {
        log.info("Cambiando estado de sesión {} a {}", id, dto.getEstado());
        Sesion sesion = sesionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada con id: " + id));
        sesion.setEstado(dto.getEstado());
        if (dto.getAsistio() != null) sesion.setAsistio(dto.getAsistio());
        sesionRepository.save(sesion);
    }

    @Override
    @Transactional
    public void eliminarSesion(Long id) {
        log.info("Eliminando sesión con id: {}", id);
        Sesion sesion = sesionRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión no encontrada con id: " + id));
        sesion.setDeletedAt(LocalDateTime.now());
        sesionRepository.save(sesion);
    }
}
