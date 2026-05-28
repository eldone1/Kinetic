package com.kineticrehab.repository;

import com.kineticrehab.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findAllByDeletedAtIsNullOrderByApellidosAsc();

    Optional<Doctor> findByIdAndDeletedAtIsNull(Long id);

    Optional<Doctor> findByDniAndDeletedAtIsNull(String dni);

    boolean existsByDni(String dni);

    List<Doctor> findByActivoTrueAndDeletedAtIsNullOrderByApellidosAsc();

    Optional<Doctor> findByUsuarioIdAndDeletedAtIsNull(Long usuarioId);

    List<Doctor> findByNombresContainingIgnoreCaseAndDeletedAtIsNullOrApellidosContainingIgnoreCaseAndDeletedAtIsNull(
            String nombres, String apellidos);

    List<Doctor> findByDniContainingAndDeletedAtIsNull(String dni);

    List<Doctor> findByEspecialidadContainingIgnoreCaseAndDeletedAtIsNull(String especialidad);
}
