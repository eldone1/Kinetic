package com.kineticrehab.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitaResponseDTO {

    private Long id;
    private Long idPaciente;
    private String nombrePaciente;
    private String documentoPaciente;
    private Long idDoctor;
    private String nombreDoctor;
    private String especialidadDoctor;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;
    private String observaciones;
    private Long idServicio;
    private String nombreServicio;
    private BigDecimal precio;
    private LocalDateTime createdAt;
}
