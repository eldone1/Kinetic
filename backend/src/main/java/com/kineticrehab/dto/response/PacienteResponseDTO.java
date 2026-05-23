package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteResponseDTO {

    private Long id;
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombres;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String telefono;
    private String correo;
    private String direccion;
    private String ocupacion;
    private String contactoEmergencia;
    private String observaciones;
    private LocalDateTime createdAt;
}
