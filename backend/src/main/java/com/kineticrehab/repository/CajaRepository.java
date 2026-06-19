package com.kineticrehab.repository;

import com.kineticrehab.model.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Long> {

    List<Caja> findAllByDeletedAtIsNullOrderByFechaAperturaDesc();

    Optional<Caja> findByIdAndDeletedAtIsNull(Long id);

    Optional<Caja> findByUsuarioIdAndEstadoAndDeletedAtIsNull(Long usuarioId, String estado);

    List<Caja> findByUsuarioIdAndDeletedAtIsNullOrderByFechaAperturaDesc(Long usuarioId);

    List<Caja> findByEstadoAndDeletedAtIsNullOrderByFechaAperturaDesc(String estado);

    long countByEstadoAndDeletedAtIsNull(String estado);
}
