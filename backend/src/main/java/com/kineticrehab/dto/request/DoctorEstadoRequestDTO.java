package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorEstadoRequestDTO {

    @NotNull(message = "El estado activo es obligatorio")
    private Boolean activo;
}
