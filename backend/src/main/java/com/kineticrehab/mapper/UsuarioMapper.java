package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.UsuarioRequestDTO;
import com.kineticrehab.dto.response.UsuarioResponseDTO;
import com.kineticrehab.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponseDTO toDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellidos(usuario.getApellidos())
                .telefono(usuario.getTelefono())
                .rol(usuario.getRol().getNombre())
                .activo(usuario.getActivo())
                .createdAt(usuario.getCreatedAt())
                .build();
    }

    public Usuario toEntity(UsuarioRequestDTO dto) {
        return Usuario.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .nombre(dto.getNombre())
                .apellidos(dto.getApellidos())
                .telefono(dto.getTelefono())
                .build();
    }
}
