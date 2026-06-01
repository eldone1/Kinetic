package com.kineticrehab.service;

import com.kineticrehab.dto.request.VentaRequestDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;

import java.util.List;

public interface VentaService {

    VentaResponseDTO registrar(VentaRequestDTO dto);

    VentaResponseDTO obtenerPorId(Long id);

    List<VentaResponseDTO> listarPorPaciente(Long pacienteId);

    VentaResponseDTO obtenerPorCita(Long citaId);
}
