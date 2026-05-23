package com.kineticrehab.repository;

import com.kineticrehab.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    List<Paciente> findAllByDeletedAtIsNull();

    Optional<Paciente> findByIdAndDeletedAtIsNull(Long id);

    Optional<Paciente> findByNumeroDocumentoAndDeletedAtIsNull(String numeroDocumento);

    boolean existsByNumeroDocumento(String numeroDocumento);

    List<Paciente> findByNombresContainingIgnoreCaseAndDeletedAtIsNullOrApellidosContainingIgnoreCaseAndDeletedAtIsNull(String nombres, String apellidos);

    List<Paciente> findByNumeroDocumentoContainingAndDeletedAtIsNull(String numeroDocumento);

    List<Paciente> findByTelefonoContainingAndDeletedAtIsNull(String telefono);
}
