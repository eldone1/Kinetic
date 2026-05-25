package com.kineticrehab.repository;

import com.kineticrehab.model.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {

    List<Evaluacion> findByHistoriaClinicaIdAndDeletedAtIsNullOrderByFechaDesc(Long historiaClinicaId);

    Optional<Evaluacion> findByIdAndDeletedAtIsNull(Long id);
}
