package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteRequestDTO {

    @NotBlank(message = "El tipo de documento es obligatorio")
    private String tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    @Size(max = 12, message = "El número de documento debe tener máximo 12 caracteres")
    private String numeroDocumento;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    private LocalDate fechaNacimiento;

    @Size(max = 1, message = "El sexo debe ser M o F")
    private String sexo;

    private String telefono;

    private String correo;

    private String direccion;

    private String ocupacion;

    private String contactoEmergencia;

    private String observaciones;
}
