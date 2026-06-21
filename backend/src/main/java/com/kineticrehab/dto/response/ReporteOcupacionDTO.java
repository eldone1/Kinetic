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
public class ReporteOcupacionDTO {
    private double porcentajeOcupacion;
    private long totalCitas;
    private long totalDisponible;
    private List<DoctorOcupacion> doctores;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorOcupacion {
        private Long idDoctor;
        private String nombreDoctor;
        private long citasAtendidas;
        private long capacidadTotal;
        private double porcentaje;
        private List<OcupacionDetalleDTO> slots;
    }
}
