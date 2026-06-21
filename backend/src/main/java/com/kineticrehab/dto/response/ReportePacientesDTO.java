package com.kineticrehab.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportePacientesDTO {
    private long pacientesNuevos;
    private long pacientesRecurrentes;
    private long totalPacientes;
    private List<PacientePorDia> pacientesPorDia;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PacientePorDia {
        private LocalDate fecha;
        private long total;
        private List<PacienteDetalleDTO> pacientes;
    }
}
