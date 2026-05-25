package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoEstadoRequestDTO {

    @NotBlank(message = "El estado es obligatorio")
    private String estado;
}
