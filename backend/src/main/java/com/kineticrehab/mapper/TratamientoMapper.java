package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.TratamientoRequestDTO;
import com.kineticrehab.dto.response.TratamientoResponseDTO;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Evaluacion;
import com.kineticrehab.model.HistoriaClinica;
import com.kineticrehab.model.Tratamiento;
import org.springframework.stereotype.Component;

@Component
public class TratamientoMapper {

    public TratamientoResponseDTO toDTO(Tratamiento trat) {
        TratamientoResponseDTO.TratamientoResponseDTOBuilder builder = TratamientoResponseDTO.builder()
                .id(trat.getId())
                .idHistoriaClinica(trat.getHistoriaClinica().getId())
                .idDoctor(trat.getDoctor().getId())
                .nombreDoctor(trat.getDoctor().getNombres() + " " + trat.getDoctor().getApellidos())
                .nombre(trat.getNombre())
                .descripcion(trat.getDescripcion())
                .objetivo(trat.getObjetivo())
                .frecuencia(trat.getFrecuencia())
                .duracionSemanas(trat.getDuracionSemanas())
                .planCamilla(trat.getPlanCamilla())
                .planGym(trat.getPlanGym())
                .fechaInicio(trat.getFechaInicio())
                .fechaFin(trat.getFechaFin())
                .estado(trat.getEstado())
                .createdAt(trat.getCreatedAt())
                .updatedAt(trat.getUpdatedAt());

        if (trat.getEvaluacion() != null) {
            builder.idEvaluacion(trat.getEvaluacion().getId());
        }

        return builder.build();
    }

    public Tratamiento toEntity(TratamientoRequestDTO dto, HistoriaClinica hc, Evaluacion evaluacion, Doctor doctor) {
        return Tratamiento.builder()
                .historiaClinica(hc)
                .evaluacion(evaluacion)
                .doctor(doctor)
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .objetivo(dto.getObjetivo())
                .frecuencia(dto.getFrecuencia())
                .duracionSemanas(dto.getDuracionSemanas())
                .planCamilla(dto.getPlanCamilla())
                .planGym(dto.getPlanGym())
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .estado(dto.getEstado() != null ? dto.getEstado() : "ACTIVO")
                .build();
    }

    public void updateEntity(Tratamiento trat, TratamientoRequestDTO dto, Evaluacion evaluacion) {
        trat.setEvaluacion(evaluacion);
        trat.setNombre(dto.getNombre());
        trat.setDescripcion(dto.getDescripcion());
        trat.setObjetivo(dto.getObjetivo());
        trat.setFrecuencia(dto.getFrecuencia());
        trat.setDuracionSemanas(dto.getDuracionSemanas());
        trat.setPlanCamilla(dto.getPlanCamilla());
        trat.setPlanGym(dto.getPlanGym());
        trat.setFechaInicio(dto.getFechaInicio());
        trat.setFechaFin(dto.getFechaFin());
        if (dto.getEstado() != null) trat.setEstado(dto.getEstado());
    }
}
