package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.LoginRequestDTO;
import com.kineticrehab.dto.response.LoginResponseDTO;
import com.kineticrehab.dto.response.UsuarioResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.mapper.UsuarioMapper;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.repository.UsuarioRepository;
import com.kineticrehab.security.JwtTokenProvider;
import com.kineticrehab.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public LoginResponseDTO login(LoginRequestDTO dto) {
        log.info("Intento de login para usuario: {}", dto.getUsername());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        } catch (BadCredentialsException e) {
            log.warn("Credenciales inválidas para: {}", dto.getUsername());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        Usuario usuario = usuarioRepository.findByUsernameAndDeletedAtIsNull(dto.getUsername())
                .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

        String token = jwtTokenProvider.generateToken(usuario.getUsername(), usuario.getRol().getNombre());
        String refreshToken = jwtTokenProvider.generateRefreshToken(usuario.getUsername());

        UsuarioResponseDTO usuarioDTO = usuarioMapper.toDTO(usuario);

        log.info("Login exitoso para: {}", dto.getUsername());
        return LoginResponseDTO.builder()
                .token(token)
                .refreshToken(refreshToken)
                .usuario(usuarioDTO)
                .build();
    }

    @Override
    public LoginResponseDTO refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Refresh token inválido o expirado");
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);

        Usuario usuario = usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

        String newToken = jwtTokenProvider.generateToken(usuario.getUsername(), usuario.getRol().getNombre());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(usuario.getUsername());

        UsuarioResponseDTO usuarioDTO = usuarioMapper.toDTO(usuario);

        return LoginResponseDTO.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .usuario(usuarioDTO)
                .build();
    }
}
