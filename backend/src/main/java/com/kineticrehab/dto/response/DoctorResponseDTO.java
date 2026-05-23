package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDTO {

    private Long id;
    private String nombres;
    private String apellidos;
    private String dni;
    private String especialidad;
    private String cmp;
    private String telefono;
    private String correo;
    private Boolean activo;
    private LocalDateTime createdAt;
}
