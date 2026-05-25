package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoResponseDTO {
    private Long id;
    private Long idHistoriaClinica;
    private Long idEvaluacion;
    private Long idDoctor;
    private String nombreDoctor;
    private String nombre;
    private String descripcion;
    private String objetivo;
    private String frecuencia;
    private Integer duracionSemanas;
    private String planCamilla;
    private String planGym;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
