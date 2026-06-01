package com.kineticrehab.controller;

import com.kineticrehab.dto.request.CitaEstadoRequestDTO;
import com.kineticrehab.dto.request.CitaRequestDTO;
import com.kineticrehab.dto.response.CitaResponseDTO;
import com.kineticrehab.service.CitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
@Tag(name = "Citas", description = "Gestión de agenda, citas y sesiones")
public class CitaController {

    private final CitaService citaService;

    @GetMapping
    @Operation(summary = "Listar todas las citas activas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<CitaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(citaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cita por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<CitaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.buscarPorId(id));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Listar citas de un doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<CitaResponseDTO>> listarPorDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(citaService.listarPorDoctor(doctorId));
    }

    @GetMapping("/paciente/{pacienteId}")
    @Operation(summary = "Listar citas de un paciente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<CitaResponseDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/por-fecha")
    @Operation(summary = "Listar citas por fecha")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<CitaResponseDTO>> listarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(citaService.listarPorFecha(fecha));
    }

    @GetMapping("/calendario")
    @Operation(summary = "Listar citas en un rango de fechas")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<CitaResponseDTO>> listarPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(citaService.listarPorRangoFechas(fechaInicio, fechaFin));
    }

    @GetMapping("/pendientes-pago/{pacienteId}")
    @Operation(summary = "Listar citas COMPLETADA no facturadas de un paciente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<List<CitaResponseDTO>> listarPendientesPago(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(citaService.listarPendientesPago(pacienteId));
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar citas por estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<List<CitaResponseDTO>> listarPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(citaService.listarPorEstado(estado));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva cita")
    @ApiResponse(responseCode = "201", description = "Cita creada correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CitaResponseDTO> crear(@Valid @RequestBody CitaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(citaService.crear(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una cita existente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CitaResponseDTO> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody CitaRequestDTO dto) {
        return ResponseEntity.ok(citaService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de una cita")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id,
                                               @Valid @RequestBody CitaEstadoRequestDTO dto) {
        citaService.cambiarEstado(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) una cita")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        citaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
