package com.kineticrehab.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tratamientos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tratamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_historia_clinica", nullable = false)
    private HistoriaClinica historiaClinica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion")
    private Evaluacion evaluacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String objetivo;

    @Column(length = 100)
    private String frecuencia;

    @Column(name = "duracion_semanas")
    private Integer duracionSemanas;

    @Column(name = "plan_camilla", columnDefinition = "TEXT")
    private String planCamilla;

    @Column(name = "plan_gym", columnDefinition = "TEXT")
    private String planGym;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String estado = "ACTIVO";

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
        if (estado == null) estado = "ACTIVO";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
