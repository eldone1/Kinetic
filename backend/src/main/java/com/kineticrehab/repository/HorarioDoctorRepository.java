package com.kineticrehab.repository;

import com.kineticrehab.model.HorarioDoctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface HorarioDoctorRepository extends JpaRepository<HorarioDoctor, Long> {

    List<HorarioDoctor> findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc(Long doctorId);

    @Query("SELECT h FROM HorarioDoctor h WHERE h.doctor.id = :doctorId AND h.deletedAt IS NULL "
            + "AND h.diaSemana = :diaSemana "
            + "AND ((h.horaInicio < :horaFin AND h.horaFin > :horaInicio))")
    List<HorarioDoctor> findOverlapping(@Param("doctorId") Long doctorId,
                                         @Param("diaSemana") String diaSemana,
                                         @Param("horaInicio") LocalTime horaInicio,
                                         @Param("horaFin") LocalTime horaFin);
}
