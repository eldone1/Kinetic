package com.kineticrehab.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "historias_clinicas")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "doctor_asignado", length = 150)
    private String doctorAsignado;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String especialidad = "Fisioterapia";

    @Column(length = 255)
    private String procedencia;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String categoria = "Valoración / Evaluación Inicial";

    @Column(name = "motivo_consulta", columnDefinition = "TEXT")
    private String motivoConsulta;

    @Column(length = 255)
    private String tabaquismo;

    @Column(length = 255)
    private String alcoholismo;

    @Column(columnDefinition = "TEXT")
    private String medicamentos;

    @Column(name = "deporte_actividad_fisica", length = 255)
    private String deporteActividadFisica;

    @Column(name = "enfermedades_actuales", columnDefinition = "TEXT")
    private String enfermedadesActuales;

    @Column(name = "enfermedades_pasadas", columnDefinition = "TEXT")
    private String enfermedadesPasadas;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(columnDefinition = "TEXT")
    private String cirugias;

    @Column(name = "antec_heredo_familiares", columnDefinition = "TEXT")
    private String antecHeredoFamiliares;

    @Column(name = "antec_heredo_especificaciones", columnDefinition = "TEXT")
    private String antecHeredoEspecificaciones;

    @Column(precision = 5, scale = 2)
    private BigDecimal peso;

    @Column(precision = 5, scale = 2)
    private BigDecimal talla;

    @Column(name = "pa_presion_arterial", length = 20)
    private String paPresionArterial;

    @Column(precision = 4, scale = 1)
    private BigDecimal imc;

    @Column(name = "fecha_apertura", nullable = false)
    private LocalDate fechaApertura;

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
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
