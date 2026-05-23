package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.PacienteRequestDTO;
import com.kineticrehab.dto.response.PacienteResponseDTO;
import com.kineticrehab.model.Paciente;
import org.springframework.stereotype.Component;

@Component
public class PacienteMapper {

    public PacienteResponseDTO toDTO(Paciente paciente) {
        return PacienteResponseDTO.builder()
                .id(paciente.getId())
                .tipoDocumento(paciente.getTipoDocumento())
                .numeroDocumento(paciente.getNumeroDocumento())
                .nombres(paciente.getNombres())
                .apellidos(paciente.getApellidos())
                .fechaNacimiento(paciente.getFechaNacimiento())
                .sexo(paciente.getSexo())
                .telefono(paciente.getTelefono())
                .correo(paciente.getCorreo())
                .direccion(paciente.getDireccion())
                .ocupacion(paciente.getOcupacion())
                .contactoEmergencia(paciente.getContactoEmergencia())
                .observaciones(paciente.getObservaciones())
                .createdAt(paciente.getCreatedAt())
                .build();
    }

    public Paciente toEntity(PacienteRequestDTO dto) {
        return Paciente.builder()
                .tipoDocumento(dto.getTipoDocumento())
                .numeroDocumento(dto.getNumeroDocumento())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .fechaNacimiento(dto.getFechaNacimiento())
                .sexo(dto.getSexo())
                .telefono(dto.getTelefono())
                .correo(dto.getCorreo())
                .direccion(dto.getDireccion())
                .ocupacion(dto.getOcupacion())
                .contactoEmergencia(dto.getContactoEmergencia())
                .observaciones(dto.getObservaciones())
                .build();
    }
}
