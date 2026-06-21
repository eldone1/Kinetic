package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcupacionDetalleDTO {
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String pacienteNombre;
    private String estado;
}
