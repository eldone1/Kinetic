package com.kineticrehab.dto.response;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String refreshToken;
    private UsuarioResponseDTO usuario;
}
