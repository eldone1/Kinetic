package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.SesionRequestDTO;
import com.kineticrehab.dto.response.SesionResponseDTO;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Sesion;
import com.kineticrehab.model.Tratamiento;
import org.springframework.stereotype.Component;

@Component
public class SesionMapper {

    public SesionResponseDTO toDTO(Sesion sesion) {
        SesionResponseDTO.SesionResponseDTOBuilder builder = SesionResponseDTO.builder()
                .id(sesion.getId())
                .idTratamiento(sesion.getTratamiento().getId())
                .nombreTratamiento(sesion.getTratamiento().getNombre())
                .numeroSesion(sesion.getNumeroSesion())
                .fecha(sesion.getFecha())
                .hora(sesion.getHora())
                .evaluacionSubjetiva(sesion.getEvaluacionSubjetiva())
                .evaluacionObjetiva(sesion.getEvaluacionObjetiva())
                .tratamientoRealizado(sesion.getTratamientoRealizado())
                .indicaciones(sesion.getIndicaciones())
                .proximaSesionPlan(sesion.getProximaSesionPlan())
                .asistio(sesion.getAsistio())
                .estado(sesion.getEstado())
                .createdAt(sesion.getCreatedAt())
                .updatedAt(sesion.getUpdatedAt());

        if (sesion.getCita() != null) {
            builder.idCita(sesion.getCita().getId());
        }

        return builder.build();
    }

    public Sesion toEntity(SesionRequestDTO dto, Tratamiento tratamiento, Cita cita) {
        return Sesion.builder()
                .tratamiento(tratamiento)
                .cita(cita)
                .numeroSesion(dto.getNumeroSesion())
                .fecha(dto.getFecha())
                .hora(dto.getHora())
                .evaluacionSubjetiva(dto.getEvaluacionSubjetiva())
                .evaluacionObjetiva(dto.getEvaluacionObjetiva())
                .tratamientoRealizado(dto.getTratamientoRealizado())
                .indicaciones(dto.getIndicaciones())
                .proximaSesionPlan(dto.getProximaSesionPlan())
                .asistio(dto.getAsistio())
                .estado(dto.getEstado() != null ? dto.getEstado() : "PROGRAMADA")
                .build();
    }

    public void updateEntity(Sesion sesion, SesionRequestDTO dto, Cita cita) {
        sesion.setCita(cita);
        sesion.setNumeroSesion(dto.getNumeroSesion());
        sesion.setFecha(dto.getFecha());
        sesion.setHora(dto.getHora());
        sesion.setEvaluacionSubjetiva(dto.getEvaluacionSubjetiva());
        sesion.setEvaluacionObjetiva(dto.getEvaluacionObjetiva());
        sesion.setTratamientoRealizado(dto.getTratamientoRealizado());
        sesion.setIndicaciones(dto.getIndicaciones());
        sesion.setProximaSesionPlan(dto.getProximaSesionPlan());
        sesion.setAsistio(dto.getAsistio());
        if (dto.getEstado() != null) sesion.setEstado(dto.getEstado());
    }
}
