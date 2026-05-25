package com.kineticrehab.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluaciones")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_historia_clinica", nullable = false)
    private HistoriaClinica historiaClinica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String tipo = "VALORACION";

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "padecimiento_actual", columnDefinition = "TEXT")
    private String padecimientoActual;

    @Column(name = "valoracion_subjetiva", columnDefinition = "TEXT")
    private String valoracionSubjetiva;

    @Column(name = "eva_puntuacion")
    private Integer evaPuntuacion;

    @Column(name = "borg_puntuacion")
    private Integer borgPuntuacion;

    @Column(name = "daniels_puntuacion")
    private Integer danielsPuntuacion;

    @Column(name = "dolor_intensidad", length = 50)
    private String dolorIntensidad;

    @Column(name = "dolor_frecuencia", length = 50)
    private String dolorFrecuencia;

    @Column(name = "dolor_otro", columnDefinition = "TEXT")
    private String dolorOtro;

    @Column(columnDefinition = "TEXT")
    private String signos;

    @Column(name = "evaluacion_movilidad", columnDefinition = "TEXT")
    private String evaluacionMovilidad;

    @Column(name = "evaluacion_muscular", columnDefinition = "TEXT")
    private String evaluacionMuscular;

    @Column(name = "evaluacion_funcional", columnDefinition = "TEXT")
    private String evaluacionFuncional;

    @Column(name = "sensibilidad_palpacion", columnDefinition = "TEXT")
    private String sensibilidadPalpacion;

    @Column(name = "diagnostico_clinico", columnDefinition = "TEXT")
    private String diagnosticoClinico;

    @Column(name = "objetivos_tratamiento", columnDefinition = "TEXT")
    private String objetivosTratamiento;

    @Column(name = "plan_camilla", columnDefinition = "TEXT")
    private String planCamilla;

    @Column(name = "plan_gym", columnDefinition = "TEXT")
    private String planGym;

    @Column(name = "frecuencia_tratamiento", length = 100)
    private String frecuenciaTratamiento;

    @Column(length = 20)
    private String cie10;

    @Column(name = "motivo_control", columnDefinition = "TEXT")
    private String motivoControl;

    @Column(name = "padecimiento_actual_historial", columnDefinition = "TEXT")
    private String padecimientoActualHistorial;

    @Column(name = "valoracion_progreso", columnDefinition = "TEXT")
    private String valoracionProgreso;

    @Column(name = "evaluacion_movilidad_actualizada", columnDefinition = "TEXT")
    private String evaluacionMovilidadActualizada;

    @Column(name = "objetivos_modificados", columnDefinition = "TEXT")
    private String objetivosModificados;

    @Column(name = "plan_camilla_actualizado", columnDefinition = "TEXT")
    private String planCamillaActualizado;

    @Column(name = "plan_gym_actualizado", columnDefinition = "TEXT")
    private String planGymActualizado;

    @Column(name = "frecuencia_actualizada", length = 100)
    private String frecuenciaActualizada;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (tipo == null) tipo = "VALORACION";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
