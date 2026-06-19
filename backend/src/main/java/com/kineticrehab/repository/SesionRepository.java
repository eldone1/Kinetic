package com.kineticrehab.repository;

import com.kineticrehab.model.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Long> {

    List<Sesion> findByTratamientoIdAndDeletedAtIsNullOrderByNumeroSesionAsc(Long tratamientoId);

    Optional<Sesion> findByIdAndDeletedAtIsNull(Long id);

    long countByFechaAndDeletedAtIsNull(LocalDate fecha);

    long countByFechaAndEstadoAndDeletedAtIsNull(LocalDate fecha, String estado);

    long countByFechaAndEstadoAndTratamientoDoctorIdAndDeletedAtIsNull(LocalDate fecha, String estado, Long doctorId);

    List<Sesion> findByFechaAndDeletedAtIsNull(LocalDate fecha);

    List<Sesion> findByTratamientoDoctorIdAndFechaAndDeletedAtIsNullOrderByFechaAsc(Long doctorId, LocalDate fecha);
}
