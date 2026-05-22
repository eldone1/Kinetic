package com.kineticrehab.service.impl;

import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.model.Rol;
import com.kineticrehab.repository.RolRepository;
import com.kineticrehab.service.RolService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;

    @Override
    public List<Rol> listarTodos() {
        log.info("Listando todos los roles activos");
        return rolRepository.findAllByDeletedAtIsNull();
    }

    @Override
    public Rol buscarPorId(Long id) {
        return rolRepository.findById(id)
                .filter(r -> r.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));
    }

    @Override
    public Rol buscarPorNombre(String nombre) {
        return rolRepository.findByNombre(nombre)
                .filter(r -> r.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + nombre));
    }
}
