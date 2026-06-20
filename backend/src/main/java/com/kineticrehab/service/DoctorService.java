package com.kineticrehab.service;

import com.kineticrehab.dto.request.DoctorEstadoRequestDTO;
import com.kineticrehab.dto.request.DoctorRequestDTO;
import com.kineticrehab.dto.request.HorarioRequestDTO;
import com.kineticrehab.dto.response.DoctorHorariosResponseDTO;
import com.kineticrehab.dto.response.DoctorResponseDTO;
import com.kineticrehab.dto.response.HorarioResponseDTO;

import java.util.List;

public interface DoctorService {

    List<DoctorResponseDTO> listarTodos();

    DoctorResponseDTO buscarPorId(Long id);

    DoctorResponseDTO crear(DoctorRequestDTO dto);

    DoctorResponseDTO actualizar(Long id, DoctorRequestDTO dto);

    void cambiarEstado(Long id, DoctorEstadoRequestDTO dto);

    void eliminar(Long id);

    List<DoctorResponseDTO> buscarPorTermino(String termino);

    List<DoctorResponseDTO> listarDisponibles();

    DoctorResponseDTO buscarPorUsernameUsuario(String username);

    DoctorHorariosResponseDTO obtenerHorarios(Long doctorId);

    DoctorHorariosResponseDTO obtenerMiPerfilCompleto(String username);

    List<HorarioResponseDTO> actualizarHorarios(Long doctorId, List<HorarioRequestDTO> horarios);
}
