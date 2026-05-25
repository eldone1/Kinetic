package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoRequestDTO {

    @NotNull(message = "La historia clínica es obligatoria")
    private Long idHistoriaClinica;

    private Long idEvaluacion;

    @NotNull(message = "El doctor es obligatorio")
    private Long idDoctor;

    @NotBlank(message = "El nombre del tratamiento es obligatorio")
    private String nombre;

    private String descripcion;
    private String objetivo;
    private String frecuencia;
    private Integer duracionSemanas;
    private String planCamilla;
    private String planGym;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    private LocalDate fechaFin;
    private String estado;
}
