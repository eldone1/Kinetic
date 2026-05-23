package com.kineticrehab.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorHorariosResponseDTO {

    private Long id;
    private String nombres;
    private String apellidos;
    private String especialidad;
    private Boolean activo;
    private List<HorarioResponseDTO> horarios;
}
