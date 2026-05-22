package com.kineticrehab.service;

import com.kineticrehab.dto.request.LoginRequestDTO;
import com.kineticrehab.dto.response.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO dto);

    LoginResponseDTO refreshToken(String refreshToken);
}
