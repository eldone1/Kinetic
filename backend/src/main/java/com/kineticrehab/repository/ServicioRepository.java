package com.kineticrehab.repository;

import com.kineticrehab.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    List<Servicio> findAllByDeletedAtIsNullOrderByNombreAsc();

    List<Servicio> findByActivoAndDeletedAtIsNullOrderByNombreAsc(Boolean activo);

    Optional<Servicio> findByIdAndDeletedAtIsNull(Long id);
}
