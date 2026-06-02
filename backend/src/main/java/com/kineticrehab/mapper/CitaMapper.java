package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.CitaRequestDTO;
import com.kineticrehab.dto.response.CitaResponseDTO;
import com.kineticrehab.dto.response.CitaResponseDTO.CitaResponseDTOBuilder;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Paciente;
import com.kineticrehab.model.Servicio;
import org.springframework.stereotype.Component;

@Component
public class CitaMapper {

    public CitaResponseDTO toDTO(Cita cita) {
        CitaResponseDTOBuilder builder = CitaResponseDTO.builder()
                .id(cita.getId())
                .idPaciente(cita.getPaciente().getId())
                .nombrePaciente(cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos())
                .documentoPaciente(cita.getPaciente().getNumeroDocumento())
                .idDoctor(cita.getDoctor().getId())
                .nombreDoctor(cita.getDoctor().getNombres() + " " + cita.getDoctor().getApellidos())
                .especialidadDoctor(cita.getDoctor().getEspecialidad())
                .fecha(cita.getFecha())
                .horaInicio(cita.getHoraInicio())
                .horaFin(cita.getHoraFin())
                .estado(cita.getEstado())
                .observaciones(cita.getObservaciones())
                .precio(cita.getPrecio())
                .createdAt(cita.getCreatedAt());

        if (cita.getServicio() != null) {
            builder.idServicio(cita.getServicio().getId())
                    .nombreServicio(cita.getServicio().getNombre());
        }

        return builder.build();
    }

    public Cita toEntity(CitaRequestDTO dto, Paciente paciente, Doctor doctor, Servicio servicio) {
        return Cita.builder()
                .paciente(paciente)
                .doctor(doctor)
                .servicio(servicio)
                .precio(servicio.getPrecio())
                .fecha(dto.getFecha())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .observaciones(dto.getObservaciones())
                .build();
    }
}
