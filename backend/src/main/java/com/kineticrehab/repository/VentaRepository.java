package com.kineticrehab.repository;

import com.kineticrehab.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findAllByDeletedAtIsNullOrderByFechaVentaDesc();

    Optional<Venta> findByIdAndDeletedAtIsNull(Long id);

    List<Venta> findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(Long cajaId);

    List<Venta> findByPacienteIdAndDeletedAtIsNullOrderByFechaVentaDesc(Long pacienteId);

    Optional<Venta> findByCitaIdAndDeletedAtIsNull(Long citaId);

    List<Venta> findByMetodoPagoAndDeletedAtIsNull(String metodoPago);

    List<Venta> findByFechaVentaBetweenAndDeletedAtIsNull(LocalDateTime inicio, LocalDateTime fin);

}
