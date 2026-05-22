package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String apellidos;
    private String telefono;
    private String rol;
    private Boolean activo;
    private LocalDateTime createdAt;
}
