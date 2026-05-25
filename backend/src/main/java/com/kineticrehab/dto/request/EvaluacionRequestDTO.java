package com.kineticrehab.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionRequestDTO {

    @NotNull(message = "La historia clínica es obligatoria")
    private Long idHistoriaClinica;

    @NotNull(message = "El doctor es obligatorio")
    private Long idDoctor;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    private String padecimientoActual;
    private String valoracionSubjetiva;

    private Integer evaPuntuacion;
    private Integer borgPuntuacion;
    private Integer danielsPuntuacion;
    private String dolorIntensidad;
    private String dolorFrecuencia;
    private String dolorOtro;

    private String signos;
    private String evaluacionMovilidad;
    private String evaluacionMuscular;
    private String evaluacionFuncional;
    private String sensibilidadPalpacion;

    private String diagnosticoClinico;
    private String objetivosTratamiento;
    private String planCamilla;
    private String planGym;
    private String frecuenciaTratamiento;
    private String cie10;

    private String motivoControl;
    private String padecimientoActualHistorial;
    private String valoracionProgreso;
    private String evaluacionMovilidadActualizada;
    private String objetivosModificados;
    private String planCamillaActualizado;
    private String planGymActualizado;
    private String frecuenciaActualizada;
}
