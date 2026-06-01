package com.kineticrehab.service;

import com.kineticrehab.dto.request.CitaEstadoRequestDTO;
import com.kineticrehab.dto.request.CitaRequestDTO;
import com.kineticrehab.dto.response.CitaResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface CitaService {

    List<CitaResponseDTO> listarTodas();

    CitaResponseDTO buscarPorId(Long id);

    List<CitaResponseDTO> listarPorDoctor(Long doctorId);

    List<CitaResponseDTO> listarPorPaciente(Long pacienteId);

    List<CitaResponseDTO> listarPorFecha(LocalDate fecha);

    List<CitaResponseDTO> listarPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin);

    List<CitaResponseDTO> listarPorEstado(String estado);

    CitaResponseDTO crear(CitaRequestDTO dto);

    CitaResponseDTO actualizar(Long id, CitaRequestDTO dto);

    void cambiarEstado(Long id, CitaEstadoRequestDTO dto);

    void eliminar(Long id);

    List<CitaResponseDTO> listarPendientesPago(Long pacienteId);
}
