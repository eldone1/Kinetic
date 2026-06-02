package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.ServicioRequestDTO;
import com.kineticrehab.dto.response.ServicioResponseDTO;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.ServicioMapper;
import com.kineticrehab.model.Servicio;
import com.kineticrehab.repository.ServicioRepository;
import com.kineticrehab.service.ServicioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServicioServiceImpl implements ServicioService {

    private final ServicioRepository servicioRepository;
    private final ServicioMapper servicioMapper;

    @Override
    public List<ServicioResponseDTO> listarActivos() {
        log.info("Listando servicios activos");
        return servicioRepository.findByActivoAndDeletedAtIsNullOrderByNombreAsc(true).stream()
                .map(servicioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServicioResponseDTO> listarTodos() {
        log.info("Listando todos los servicios");
        return servicioRepository.findAllByDeletedAtIsNullOrderByNombreAsc().stream()
                .map(servicioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ServicioResponseDTO obtenerPorId(Long id) {
        return servicioRepository.findByIdAndDeletedAtIsNull(id)
                .map(servicioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public ServicioResponseDTO crear(ServicioRequestDTO dto) {
        log.info("Creando nuevo servicio: {}", dto.getNombre());

        Servicio servicio = Servicio.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();

        servicio = servicioRepository.save(servicio);
        log.info("Servicio creado exitosamente con id: {}", servicio.getId());
        return servicioMapper.toDTO(servicio);
    }

    @Override
    @Transactional
    public ServicioResponseDTO actualizar(Long id, ServicioRequestDTO dto) {
        log.info("Actualizando servicio con id: {}", id);

        Servicio servicio = servicioRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + id));

        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setPrecio(dto.getPrecio());
        if (dto.getActivo() != null) {
            servicio.setActivo(dto.getActivo());
        }

        servicio = servicioRepository.save(servicio);
        log.info("Servicio actualizado exitosamente con id: {}", id);
        return servicioMapper.toDTO(servicio);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando (soft delete) servicio con id: {}", id);

        Servicio servicio = servicioRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con id: " + id));

        servicio.setDeletedAt(LocalDateTime.now());
        servicioRepository.save(servicio);
        log.info("Servicio eliminado con id: {}", id);
    }
}
