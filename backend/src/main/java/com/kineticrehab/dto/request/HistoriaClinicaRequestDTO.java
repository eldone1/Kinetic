package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinicaRequestDTO {

    @NotNull(message = "El paciente es obligatorio")
    private Long idPaciente;

    @NotNull(message = "La fecha de apertura es obligatoria")
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
}
