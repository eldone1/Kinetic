package com.kineticrehab.repository;

import com.kineticrehab.model.Sesion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Long> {

    List<Sesion> findByTratamientoIdAndDeletedAtIsNullOrderByNumeroSesionAsc(Long tratamientoId);

    Optional<Sesion> findByIdAndDeletedAtIsNull(Long id);
}
