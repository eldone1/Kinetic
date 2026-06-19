package com.kineticrehab.repository;

import com.kineticrehab.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findAllByDeletedAtIsNullOrderByFechaAscHoraInicioAsc();

    Optional<Cita> findByIdAndDeletedAtIsNull(Long id);

    List<Cita> findByDoctorIdAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(Long doctorId);

    List<Cita> findByPacienteIdAndDeletedAtIsNullOrderByFechaDescHoraInicioDesc(Long pacienteId);

    List<Cita> findByFechaAndDeletedAtIsNullOrderByHoraInicioAsc(LocalDate fecha);

    List<Cita> findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(LocalDate fechaInicio, LocalDate fechaFin);

    List<Cita> findByDoctorIdAndFechaAndDeletedAtIsNullOrderByHoraInicioAsc(Long doctorId, LocalDate fecha);

    List<Cita> findByEstadoAndDeletedAtIsNull(String estado);

    long countByEstadoAndDeletedAtIsNull(String estado);

    long countByFechaAndDeletedAtIsNull(LocalDate fecha);

    long countByFechaAndEstadoAndDeletedAtIsNull(LocalDate fecha, String estado);

    long countByDoctorIdAndFechaAndEstadoAndDeletedAtIsNull(Long doctorId, LocalDate fecha, String estado);

    long countByFechaBetweenAndDeletedAtIsNull(LocalDate inicio, LocalDate fin);
}
