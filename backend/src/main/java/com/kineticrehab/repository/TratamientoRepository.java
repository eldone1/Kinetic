package com.kineticrehab.repository;

import com.kineticrehab.model.Tratamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TratamientoRepository extends JpaRepository<Tratamiento, Long> {

    List<Tratamiento> findByHistoriaClinicaIdAndDeletedAtIsNullOrderByFechaInicioDesc(Long historiaClinicaId);

    Optional<Tratamiento> findByIdAndDeletedAtIsNull(Long id);

    long countByDoctorIdAndEstadoAndDeletedAtIsNull(Long doctorId, String estado);

    List<Tratamiento> findByEstadoAndDeletedAtIsNull(String estado);

    List<Tratamiento> findByDoctorIdAndDeletedAtIsNull(Long doctorId);
}
