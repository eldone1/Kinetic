package com.kineticrehab.service;

import com.kineticrehab.dto.request.PacienteRequestDTO;
import com.kineticrehab.dto.response.PacienteResponseDTO;

import java.util.List;

public interface PacienteService {

    List<PacienteResponseDTO> listarTodos();

    PacienteResponseDTO buscarPorId(Long id);

    PacienteResponseDTO crear(PacienteRequestDTO dto);

    PacienteResponseDTO actualizar(Long id, PacienteRequestDTO dto);

    void eliminar(Long id);

    List<PacienteResponseDTO> buscarPorTermino(String termino);
}
