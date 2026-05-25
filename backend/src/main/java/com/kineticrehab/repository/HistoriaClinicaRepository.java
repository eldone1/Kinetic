package com.kineticrehab.repository;

import com.kineticrehab.model.HistoriaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {

    List<HistoriaClinica> findAllByDeletedAtIsNullOrderByFechaAperturaDesc();

    Optional<HistoriaClinica> findByIdAndDeletedAtIsNull(Long id);

    Optional<HistoriaClinica> findByPacienteIdAndDeletedAtIsNull(Long pacienteId);

    boolean existsByPacienteIdAndDeletedAtIsNull(Long pacienteId);
}
