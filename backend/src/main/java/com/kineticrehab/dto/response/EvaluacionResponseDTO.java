package com.kineticrehab.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionResponseDTO {
    private Long id;
    private Long idHistoriaClinica;
    private Long idDoctor;
    private String nombreDoctor;
    private LocalDate fecha;
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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
