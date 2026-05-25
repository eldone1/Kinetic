package com.kineticrehab.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinicaResponseDTO {
    private Long id;
    private Long idPaciente;
    private String nombrePaciente;
    private String documentoPaciente;

    private LocalDate fechaApertura;
    private String doctorAsignado;
    private String especialidad;
    private String procedencia;
    private String categoria;

    private String motivoConsulta;
    private String tabaquismo;
    private String alcoholismo;
    private String medicamentos;
    private String deporteActividadFisica;

    private String enfermedadesActuales;
    private String enfermedadesPasadas;
    private String alergias;
    private String cirugias;

    private String antecHeredoFamiliares;
    private String antecHeredoEspecificaciones;

    private BigDecimal peso;
    private BigDecimal talla;
    private String paPresionArterial;
    private BigDecimal imc;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
