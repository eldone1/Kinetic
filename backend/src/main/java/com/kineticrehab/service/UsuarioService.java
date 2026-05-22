package com.kineticrehab.service;

import com.kineticrehab.dto.request.CambioPasswordRequestDTO;
import com.kineticrehab.dto.request.UsuarioRequestDTO;
import com.kineticrehab.dto.response.UsuarioResponseDTO;

import java.util.List;

public interface UsuarioService {

    List<UsuarioResponseDTO> listarTodos();

    UsuarioResponseDTO buscarPorId(Long id);

    UsuarioResponseDTO crear(UsuarioRequestDTO dto);

    UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto);

    void cambiarEstado(Long id, Boolean activo);

    void eliminar(Long id);

    UsuarioResponseDTO buscarPorUsername(String username);

    void cambiarPassword(Long id, CambioPasswordRequestDTO dto);
}
