package com.kineticrehab.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "sesiones")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tratamiento", nullable = false)
    private Tratamiento tratamiento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cita")
    private Cita cita;

    @Column(name = "numero_sesion", nullable = false)
    private Integer numeroSesion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column
    private LocalTime hora;

    @Column(name = "evaluacion_subjetiva", columnDefinition = "TEXT")
    private String evaluacionSubjetiva;

    @Column(name = "evaluacion_objetiva", columnDefinition = "TEXT")
    private String evaluacionObjetiva;

    @Column(name = "tratamiento_realizado", columnDefinition = "TEXT")
    private String tratamientoRealizado;

    @Column(columnDefinition = "TEXT")
    private String indicaciones;

    @Column(name = "proxima_sesion_plan", columnDefinition = "TEXT")
    private String proximaSesionPlan;

    @Column
    private Boolean asistio;

    @Column(nullable = false, length = 20)
    private String estado;

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
        if (estado == null) estado = "PROGRAMADA";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
