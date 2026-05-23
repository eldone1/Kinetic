package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.DoctorRequestDTO;
import com.kineticrehab.dto.response.DoctorHorariosResponseDTO;
import com.kineticrehab.dto.response.DoctorResponseDTO;
import com.kineticrehab.dto.response.HorarioResponseDTO;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.HorarioDoctor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DoctorMapper {

    public DoctorResponseDTO toDTO(Doctor doctor) {
        return DoctorResponseDTO.builder()
                .id(doctor.getId())
                .nombres(doctor.getNombres())
                .apellidos(doctor.getApellidos())
                .dni(doctor.getDni())
                .especialidad(doctor.getEspecialidad())
                .cmp(doctor.getCmp())
                .telefono(doctor.getTelefono())
                .correo(doctor.getCorreo())
                .activo(doctor.getActivo())
                .createdAt(doctor.getCreatedAt())
                .build();
    }

    public Doctor toEntity(DoctorRequestDTO dto) {
        return Doctor.builder()
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .dni(dto.getDni())
                .especialidad(dto.getEspecialidad())
                .cmp(dto.getCmp())
                .telefono(dto.getTelefono())
                .correo(dto.getCorreo())
                .build();
    }

    public HorarioResponseDTO toHorarioDTO(HorarioDoctor horario) {
        return HorarioResponseDTO.builder()
                .id(horario.getId())
                .diaSemana(horario.getDiaSemana())
                .horaInicio(horario.getHoraInicio())
                .horaFin(horario.getHoraFin())
                .build();
    }

    public DoctorHorariosResponseDTO toDoctorHorariosDTO(Doctor doctor, List<HorarioDoctor> horarios) {
        List<HorarioResponseDTO> horariosDTO = horarios != null
                ? horarios.stream().map(this::toHorarioDTO).collect(Collectors.toList())
                : Collections.emptyList();

        return DoctorHorariosResponseDTO.builder()
                .id(doctor.getId())
                .nombres(doctor.getNombres())
                .apellidos(doctor.getApellidos())
                .especialidad(doctor.getEspecialidad())
                .activo(doctor.getActivo())
                .horarios(horariosDTO)
                .build();
    }
}
