package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HorarioResponseDTO {

    private Long id;
    private String diaSemana;
    private LocalTime horaInicio;
    private LocalTime horaFin;
}
