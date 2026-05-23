package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.PacienteRequestDTO;
import com.kineticrehab.dto.response.PacienteResponseDTO;
import com.kineticrehab.exception.DuplicateEntityException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.PacienteMapper;
import com.kineticrehab.model.Paciente;
import com.kineticrehab.repository.PacienteRepository;
import com.kineticrehab.service.PacienteService;
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
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final PacienteMapper pacienteMapper;

    @Override
    public List<PacienteResponseDTO> listarTodos() {
        log.info("Listando todos los pacientes activos");
        return pacienteRepository.findAllByDeletedAtIsNull().stream()
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PacienteResponseDTO buscarPorId(Long id) {
        return pacienteRepository.findByIdAndDeletedAtIsNull(id)
                .map(pacienteMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public PacienteResponseDTO crear(PacienteRequestDTO dto) {
        log.info("Creando nuevo paciente: {}", dto.getNumeroDocumento());

        if (pacienteRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            throw new DuplicateEntityException("El documento '" + dto.getNumeroDocumento() + "' ya está registrado");
        }

        Paciente paciente = pacienteMapper.toEntity(dto);
        paciente = pacienteRepository.save(paciente);
        log.info("Paciente creado exitosamente: {} {}", paciente.getNombres(), paciente.getApellidos());
        return pacienteMapper.toDTO(paciente);
    }

    @Override
    @Transactional
    public PacienteResponseDTO actualizar(Long id, PacienteRequestDTO dto) {
        log.info("Actualizando paciente con id: {}", id);

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));

        if (!paciente.getNumeroDocumento().equals(dto.getNumeroDocumento())
                && pacienteRepository.existsByNumeroDocumento(dto.getNumeroDocumento())) {
            throw new DuplicateEntityException("El documento '" + dto.getNumeroDocumento() + "' ya está registrado");
        }

        paciente.setTipoDocumento(dto.getTipoDocumento());
        paciente.setNumeroDocumento(dto.getNumeroDocumento());
        paciente.setNombres(dto.getNombres());
        paciente.setApellidos(dto.getApellidos());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setSexo(dto.getSexo());
        paciente.setTelefono(dto.getTelefono());
        paciente.setCorreo(dto.getCorreo());
        paciente.setDireccion(dto.getDireccion());
        paciente.setOcupacion(dto.getOcupacion());
        paciente.setContactoEmergencia(dto.getContactoEmergencia());
        paciente.setObservaciones(dto.getObservaciones());

        paciente = pacienteRepository.save(paciente);
        log.info("Paciente actualizado exitosamente: {} {}", paciente.getNombres(), paciente.getApellidos());
        return pacienteMapper.toDTO(paciente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando (soft delete) paciente con id: {}", id);

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + id));

        paciente.setDeletedAt(LocalDateTime.now());
        pacienteRepository.save(paciente);
        log.info("Paciente eliminado: {} {}", paciente.getNombres(), paciente.getApellidos());
    }

    @Override
    public List<PacienteResponseDTO> buscarPorTermino(String termino) {
        log.info("Buscando pacientes con término: {}", termino);

        List<PacienteResponseDTO> porNombre = pacienteRepository
                .findByNombresContainingIgnoreCaseAndDeletedAtIsNullOrApellidosContainingIgnoreCaseAndDeletedAtIsNull(
                        termino, termino)
                .stream()
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());

        List<PacienteResponseDTO> porDocumento = pacienteRepository
                .findByNumeroDocumentoContainingAndDeletedAtIsNull(termino)
                .stream()
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());

        List<PacienteResponseDTO> porTelefono = pacienteRepository
                .findByTelefonoContainingAndDeletedAtIsNull(termino)
                .stream()
                .map(pacienteMapper::toDTO)
                .collect(Collectors.toList());

        return Stream.of(porNombre, porDocumento, porTelefono)
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());
    }
}
