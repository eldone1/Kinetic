package com.kineticrehab.service;

import com.kineticrehab.dto.request.ServicioRequestDTO;
import com.kineticrehab.dto.response.ServicioResponseDTO;

import java.util.List;

public interface ServicioService {

    List<ServicioResponseDTO> listarActivos();

    List<ServicioResponseDTO> listarTodos();

    ServicioResponseDTO obtenerPorId(Long id);

    ServicioResponseDTO crear(ServicioRequestDTO dto);

    ServicioResponseDTO actualizar(Long id, ServicioRequestDTO dto);

    void eliminar(Long id);
}
