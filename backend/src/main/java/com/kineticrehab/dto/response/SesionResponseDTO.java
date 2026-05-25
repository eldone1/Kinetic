package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SesionResponseDTO {
    private Long id;
    private Long idTratamiento;
    private String nombreTratamiento;
    private Long idCita;
    private Integer numeroSesion;
    private LocalDate fecha;
    private LocalTime hora;
    private String evaluacionSubjetiva;
    private String evaluacionObjetiva;
    private String tratamientoRealizado;
    private String indicaciones;
    private String proximaSesionPlan;
    private Boolean asistio;
    private String estado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
