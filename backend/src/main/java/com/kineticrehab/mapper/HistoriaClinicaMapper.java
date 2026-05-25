package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.HistoriaClinicaRequestDTO;
import com.kineticrehab.dto.response.HistoriaClinicaResponseDTO;
import com.kineticrehab.model.HistoriaClinica;
import com.kineticrehab.model.Paciente;
import org.springframework.stereotype.Component;

@Component
public class HistoriaClinicaMapper {

    public HistoriaClinicaResponseDTO toDTO(HistoriaClinica hc) {
        return HistoriaClinicaResponseDTO.builder()
                .id(hc.getId())
                .idPaciente(hc.getPaciente().getId())
                .nombrePaciente(hc.getPaciente().getNombres() + " " + hc.getPaciente().getApellidos())
                .documentoPaciente(hc.getPaciente().getNumeroDocumento())
                .fechaApertura(hc.getFechaApertura())
                .doctorAsignado(hc.getDoctorAsignado())
                .especialidad(hc.getEspecialidad())
                .procedencia(hc.getProcedencia())
                .categoria(hc.getCategoria())
                .motivoConsulta(hc.getMotivoConsulta())
                .tabaquismo(hc.getTabaquismo())
                .alcoholismo(hc.getAlcoholismo())
                .medicamentos(hc.getMedicamentos())
                .deporteActividadFisica(hc.getDeporteActividadFisica())
                .enfermedadesActuales(hc.getEnfermedadesActuales())
                .enfermedadesPasadas(hc.getEnfermedadesPasadas())
                .alergias(hc.getAlergias())
                .cirugias(hc.getCirugias())
                .antecHeredoFamiliares(hc.getAntecHeredoFamiliares())
                .antecHeredoEspecificaciones(hc.getAntecHeredoEspecificaciones())
                .peso(hc.getPeso())
                .talla(hc.getTalla())
                .paPresionArterial(hc.getPaPresionArterial())
                .imc(hc.getImc())
                .createdAt(hc.getCreatedAt())
                .updatedAt(hc.getUpdatedAt())
                .build();
    }

    public HistoriaClinica toEntity(HistoriaClinicaRequestDTO dto, Paciente paciente) {
        return HistoriaClinica.builder()
                .paciente(paciente)
                .fechaApertura(dto.getFechaApertura())
                .doctorAsignado(dto.getDoctorAsignado())
                .especialidad(dto.getEspecialidad() != null ? dto.getEspecialidad() : "Fisioterapia")
                .procedencia(dto.getProcedencia())
                .categoria(dto.getCategoria() != null ? dto.getCategoria() : "Valoración / Evaluación Inicial")
                .motivoConsulta(dto.getMotivoConsulta())
                .tabaquismo(dto.getTabaquismo())
                .alcoholismo(dto.getAlcoholismo())
                .medicamentos(dto.getMedicamentos())
                .deporteActividadFisica(dto.getDeporteActividadFisica())
                .enfermedadesActuales(dto.getEnfermedadesActuales())
                .enfermedadesPasadas(dto.getEnfermedadesPasadas())
                .alergias(dto.getAlergias())
                .cirugias(dto.getCirugias())
                .antecHeredoFamiliares(dto.getAntecHeredoFamiliares())
                .antecHeredoEspecificaciones(dto.getAntecHeredoEspecificaciones())
                .peso(dto.getPeso())
                .talla(dto.getTalla())
                .paPresionArterial(dto.getPaPresionArterial())
                .imc(dto.getImc())
                .build();
    }

    public void updateEntity(HistoriaClinica hc, HistoriaClinicaRequestDTO dto) {
        hc.setFechaApertura(dto.getFechaApertura());
        if (dto.getDoctorAsignado() != null) hc.setDoctorAsignado(dto.getDoctorAsignado());
        if (dto.getEspecialidad() != null) hc.setEspecialidad(dto.getEspecialidad());
        hc.setProcedencia(dto.getProcedencia());
        hc.setCategoria(dto.getCategoria());
        hc.setMotivoConsulta(dto.getMotivoConsulta());
        hc.setTabaquismo(dto.getTabaquismo());
        hc.setAlcoholismo(dto.getAlcoholismo());
        hc.setMedicamentos(dto.getMedicamentos());
        hc.setDeporteActividadFisica(dto.getDeporteActividadFisica());
        hc.setEnfermedadesActuales(dto.getEnfermedadesActuales());
        hc.setEnfermedadesPasadas(dto.getEnfermedadesPasadas());
        hc.setAlergias(dto.getAlergias());
        hc.setCirugias(dto.getCirugias());
        hc.setAntecHeredoFamiliares(dto.getAntecHeredoFamiliares());
        hc.setAntecHeredoEspecificaciones(dto.getAntecHeredoEspecificaciones());
        hc.setPeso(dto.getPeso());
        hc.setTalla(dto.getTalla());
        hc.setPaPresionArterial(dto.getPaPresionArterial());
        hc.setImc(dto.getImc());
    }
}
