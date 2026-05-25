package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.CambioPasswordRequestDTO;
import com.kineticrehab.dto.request.UsuarioRequestDTO;
import com.kineticrehab.dto.response.UsuarioResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.DuplicateEntityException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.DoctorMapper;
import com.kineticrehab.mapper.UsuarioMapper;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Rol;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.repository.DoctorRepository;
import com.kineticrehab.repository.UsuarioRepository;
import com.kineticrehab.service.RolService;
import com.kineticrehab.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;
    private final RolService rolService;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    @Override
    public List<UsuarioResponseDTO> listarTodos() {
        log.info("Listando todos los usuarios activos");
        return usuarioRepository.findAllByDeletedAtIsNull().stream()
                .map(usuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDTO buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        log.info("Creando nuevo usuario: {}", dto.getUsername());

        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateEntityException("El username '" + dto.getUsername() + "' ya está en uso");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEntityException("El email '" + dto.getEmail() + "' ya está registrado");
        }

        Rol rol = rolService.buscarPorId(dto.getIdRol());

        Usuario usuario = usuarioMapper.toEntity(dto);
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(rol);
        usuario.setActivo(true);

        usuario = usuarioRepository.save(usuario);

        if ("ROLE_DOCTOR".equals(rol.getNombre())) {
            Doctor doctor = Doctor.builder()
                    .usuario(usuario)
                    .nombres(usuario.getNombre())
                    .apellidos(usuario.getApellidos())
                    .telefono(usuario.getTelefono())
                    .correo(usuario.getEmail())
                    .build();
            doctorRepository.save(doctor);
            log.info("Doctor creado automaticamente desde usuario: {}", usuario.getUsername());
        }

        log.info("Usuario creado exitosamente: {}", usuario.getUsername());
        return usuarioMapper.toDTO(usuario);
    }

    @Override
    @Transactional
    public UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto) {
        log.info("Actualizando usuario con id: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (!usuario.getUsername().equals(dto.getUsername())
                && usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateEntityException("El username '" + dto.getUsername() + "' ya está en uso");
        }
        if (!usuario.getEmail().equals(dto.getEmail())
                && usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEntityException("El email '" + dto.getEmail() + "' ya está registrado");
        }

        Rol rol = rolService.buscarPorId(dto.getIdRol());

        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setNombre(dto.getNombre());
        usuario.setApellidos(dto.getApellidos());
        usuario.setTelefono(dto.getTelefono());
        usuario.setRol(rol);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        usuario = usuarioRepository.save(usuario);
        log.info("Usuario actualizado exitosamente: {}", usuario.getUsername());
        return usuarioMapper.toDTO(usuario);
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, Boolean activo) {
        log.info("Cambiando estado del usuario {} a activo={}", id, activo);

        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
        log.info("Estado actualizado para usuario: {}", usuario.getUsername());
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando (soft delete) usuario con id: {}", id);

        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuario.setDeletedAt(LocalDateTime.now());
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
        log.info("Usuario eliminado: {}", usuario.getUsername());
    }

    @Override
    public UsuarioResponseDTO buscarPorUsername(String username) {
        return usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }

    @Override
    @Transactional
    public void cambiarPassword(Long id, CambioPasswordRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .filter(u -> u.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual no es correcta");
        }

        usuario.setPassword(passwordEncoder.encode(dto.getPasswordNuevo()));
        usuarioRepository.save(usuario);
        log.info("Contraseña actualizada para usuario: {}", usuario.getUsername());
    }
}
