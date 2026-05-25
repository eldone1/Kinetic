package com.kineticrehab.service;

import com.kineticrehab.dto.request.*;
import com.kineticrehab.dto.response.*;

import java.util.List;

public interface HistoriaClinicaService {

    List<HistoriaClinicaResponseDTO> listarTodas();

    HistoriaClinicaResponseDTO buscarPorId(Long id);

    HistoriaClinicaResponseDTO buscarPorPaciente(Long pacienteId);

    boolean existePorPaciente(Long pacienteId);

    HistoriaClinicaResponseDTO crear(HistoriaClinicaRequestDTO dto);

    HistoriaClinicaResponseDTO actualizar(Long id, HistoriaClinicaRequestDTO dto);

    void eliminar(Long id);

    List<EvaluacionResponseDTO> listarEvaluaciones(Long historiaClinicaId);

    EvaluacionResponseDTO buscarEvaluacion(Long id);

    EvaluacionResponseDTO crearEvaluacion(EvaluacionRequestDTO dto);

    EvaluacionResponseDTO actualizarEvaluacion(Long id, EvaluacionRequestDTO dto);

    void eliminarEvaluacion(Long id);

    List<TratamientoResponseDTO> listarTratamientos(Long historiaClinicaId);

    TratamientoResponseDTO buscarTratamiento(Long id);

    TratamientoResponseDTO crearTratamiento(TratamientoRequestDTO dto);

    TratamientoResponseDTO actualizarTratamiento(Long id, TratamientoRequestDTO dto);

    void cambiarEstadoTratamiento(Long id, TratamientoEstadoRequestDTO dto);

    void eliminarTratamiento(Long id);

    List<SesionResponseDTO> listarSesiones(Long tratamientoId);

    SesionResponseDTO buscarSesion(Long id);

    SesionResponseDTO crearSesion(SesionRequestDTO dto);

    SesionResponseDTO actualizarSesion(Long id, SesionRequestDTO dto);

    void cambiarEstadoSesion(Long id, SesionEstadoRequestDTO dto);

    void eliminarSesion(Long id);
}
