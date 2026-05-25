package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SesionRequestDTO {

    @NotNull(message = "El tratamiento es obligatorio")
    private Long idTratamiento;

    private Long idCita;

    @NotNull(message = "El número de sesión es obligatorio")
    private Integer numeroSesion;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    private LocalTime hora;

    private String evaluacionSubjetiva;
    private String evaluacionObjetiva;
    private String tratamientoRealizado;
    private String indicaciones;
    private String proximaSesionPlan;
    private Boolean asistio;
    private String estado;
}
