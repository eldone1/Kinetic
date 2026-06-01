package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.CitaRequestDTO;
import com.kineticrehab.dto.response.CitaResponseDTO;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Paciente;
import org.springframework.stereotype.Component;

@Component
public class CitaMapper {

    public CitaResponseDTO toDTO(Cita cita) {
        return CitaResponseDTO.builder()
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
                .tipo(cita.getTipo())
                .estado(cita.getEstado())
                .observaciones(cita.getObservaciones())
                .precio(cita.getPrecio())
                .createdAt(cita.getCreatedAt())
                .build();
    }

    public Cita toEntity(CitaRequestDTO dto, Paciente paciente, Doctor doctor) {
        return Cita.builder()
                .paciente(paciente)
                .doctor(doctor)
                .fecha(dto.getFecha())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .tipo(dto.getTipo())
                .observaciones(dto.getObservaciones())
                .precio(dto.getPrecio())
                .build();
    }
}
