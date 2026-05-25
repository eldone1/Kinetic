package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SesionEstadoRequestDTO {

    @NotBlank(message = "El estado es obligatorio")
    private String estado;

    private Boolean asistio;
}
