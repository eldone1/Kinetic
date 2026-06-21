package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteAtencionesDoctorDTO {
    private Long idDoctor;
    private String nombreDoctor;
    private long totalCitasCompletadas;
    private long totalCitasCanceladas;
    private long totalCitasNoAsistio;
    private long capacidadTotal;
    private double porcentajeOcupacion;
    private List<AtencionDoctorDetalleDTO> citas;
    private List<OcupacionDetalleDTO> slots;
}
