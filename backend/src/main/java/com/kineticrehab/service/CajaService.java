package com.kineticrehab.service;

import com.kineticrehab.dto.request.CajaAperturaRequestDTO;
import com.kineticrehab.dto.request.CajaCierreRequestDTO;
import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;

import java.util.List;

public interface CajaService {

    CajaResponseDTO aperturar(CajaAperturaRequestDTO dto);

    CajaResponseDTO cerrar(Long id, CajaCierreRequestDTO dto);

    CajaResponseDTO obtenerActiva();

    List<CajaResponseDTO> listarMias();

    List<CajaResponseDTO> listarTodas();

    CajaResponseDTO obtenerPorId(Long id);

    List<VentaResponseDTO> obtenerVentas(Long cajaId);
}
