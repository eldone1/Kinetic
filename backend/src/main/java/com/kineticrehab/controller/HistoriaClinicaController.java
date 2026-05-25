package com.kineticrehab.controller;

import com.kineticrehab.dto.request.*;
import com.kineticrehab.dto.response.*;
import com.kineticrehab.service.HistoriaClinicaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Historias Clínicas", description = "Gestión de historias clínicas, evaluaciones, tratamientos y sesiones")
public class HistoriaClinicaController {

    private final HistoriaClinicaService historiaClinicaService;

    // ==================== HISTORIAS CLÍNICAS ====================

    @GetMapping("/api/historias-clinicas")
    @Operation(summary = "Listar todas las historias clínicas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<HistoriaClinicaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(historiaClinicaService.listarTodas());
    }

    @GetMapping("/api/historias-clinicas/{id}")
    @Operation(summary = "Buscar historia clínica por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<HistoriaClinicaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(historiaClinicaService.buscarPorId(id));
    }

    @GetMapping("/api/historias-clinicas/paciente/{pacienteId}")
    @Operation(summary = "Buscar historia clínica por paciente")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<HistoriaClinicaResponseDTO> buscarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(historiaClinicaService.buscarPorPaciente(pacienteId));
    }

    @GetMapping("/api/historias-clinicas/paciente/{pacienteId}/existe")
    @Operation(summary = "Verificar si un paciente tiene historia clínica")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Map<String, Boolean>> existePorPaciente(@PathVariable Long pacienteId) {
        boolean existe = historiaClinicaService.existePorPaciente(pacienteId);
        return ResponseEntity.ok(Map.of("existe", existe));
    }

    @PostMapping("/api/historias-clinicas")
    @Operation(summary = "Crear nueva historia clínica")
    @ApiResponse(responseCode = "201", description = "Historia clínica creada correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<HistoriaClinicaResponseDTO> crear(@Valid @RequestBody HistoriaClinicaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(historiaClinicaService.crear(dto));
    }

    @PutMapping("/api/historias-clinicas/{id}")
    @Operation(summary = "Actualizar historia clínica")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<HistoriaClinicaResponseDTO> actualizar(@PathVariable Long id,
                                                                  @Valid @RequestBody HistoriaClinicaRequestDTO dto) {
        return ResponseEntity.ok(historiaClinicaService.actualizar(id, dto));
    }

    @DeleteMapping("/api/historias-clinicas/{id}")
    @Operation(summary = "Eliminar (soft delete) historia clínica")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        historiaClinicaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== EVALUACIONES ====================

    @GetMapping("/api/evaluaciones")
    @Operation(summary = "Listar evaluaciones de una historia clínica")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<EvaluacionResponseDTO>> listarEvaluaciones(
            @RequestParam Long historiaClinicaId) {
        return ResponseEntity.ok(historiaClinicaService.listarEvaluaciones(historiaClinicaId));
    }

    @GetMapping("/api/evaluaciones/{id}")
    @Operation(summary = "Buscar evaluación por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<EvaluacionResponseDTO> buscarEvaluacion(@PathVariable Long id) {
        return ResponseEntity.ok(historiaClinicaService.buscarEvaluacion(id));
    }

    @PostMapping("/api/evaluaciones")
    @Operation(summary = "Crear nueva evaluación")
    @ApiResponse(responseCode = "201", description = "Evaluación creada correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<EvaluacionResponseDTO> crearEvaluacion(@Valid @RequestBody EvaluacionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(historiaClinicaService.crearEvaluacion(dto));
    }

    @PutMapping("/api/evaluaciones/{id}")
    @Operation(summary = "Actualizar evaluación")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<EvaluacionResponseDTO> actualizarEvaluacion(@PathVariable Long id,
                                                                       @Valid @RequestBody EvaluacionRequestDTO dto) {
        return ResponseEntity.ok(historiaClinicaService.actualizarEvaluacion(id, dto));
    }

    @DeleteMapping("/api/evaluaciones/{id}")
    @Operation(summary = "Eliminar (soft delete) evaluación")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> eliminarEvaluacion(@PathVariable Long id) {
        historiaClinicaService.eliminarEvaluacion(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== TRATAMIENTOS ====================

    @GetMapping("/api/tratamientos")
    @Operation(summary = "Listar tratamientos de una historia clínica")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<TratamientoResponseDTO>> listarTratamientos(
            @RequestParam Long historiaClinicaId) {
        return ResponseEntity.ok(historiaClinicaService.listarTratamientos(historiaClinicaId));
    }

    @GetMapping("/api/tratamientos/{id}")
    @Operation(summary = "Buscar tratamiento por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<TratamientoResponseDTO> buscarTratamiento(@PathVariable Long id) {
        return ResponseEntity.ok(historiaClinicaService.buscarTratamiento(id));
    }

    @PostMapping("/api/tratamientos")
    @Operation(summary = "Crear nuevo tratamiento")
    @ApiResponse(responseCode = "201", description = "Tratamiento creado correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<TratamientoResponseDTO> crearTratamiento(@Valid @RequestBody TratamientoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(historiaClinicaService.crearTratamiento(dto));
    }

    @PutMapping("/api/tratamientos/{id}")
    @Operation(summary = "Actualizar tratamiento")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<TratamientoResponseDTO> actualizarTratamiento(@PathVariable Long id,
                                                                         @Valid @RequestBody TratamientoRequestDTO dto) {
        return ResponseEntity.ok(historiaClinicaService.actualizarTratamiento(id, dto));
    }

    @PatchMapping("/api/tratamientos/{id}/estado")
    @Operation(summary = "Cambiar estado de un tratamiento")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> cambiarEstadoTratamiento(@PathVariable Long id,
                                                          @Valid @RequestBody TratamientoEstadoRequestDTO dto) {
        historiaClinicaService.cambiarEstadoTratamiento(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/tratamientos/{id}")
    @Operation(summary = "Eliminar (soft delete) tratamiento")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> eliminarTratamiento(@PathVariable Long id) {
        historiaClinicaService.eliminarTratamiento(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== SESIONES ====================

    @GetMapping("/api/sesiones")
    @Operation(summary = "Listar sesiones de un tratamiento")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<SesionResponseDTO>> listarSesiones(
            @RequestParam Long tratamientoId) {
        return ResponseEntity.ok(historiaClinicaService.listarSesiones(tratamientoId));
    }

    @GetMapping("/api/sesiones/{id}")
    @Operation(summary = "Buscar sesión por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<SesionResponseDTO> buscarSesion(@PathVariable Long id) {
        return ResponseEntity.ok(historiaClinicaService.buscarSesion(id));
    }

    @PostMapping("/api/sesiones")
    @Operation(summary = "Crear nueva sesión")
    @ApiResponse(responseCode = "201", description = "Sesión creada correctamente")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<SesionResponseDTO> crearSesion(@Valid @RequestBody SesionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(historiaClinicaService.crearSesion(dto));
    }

    @PutMapping("/api/sesiones/{id}")
    @Operation(summary = "Actualizar sesión")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<SesionResponseDTO> actualizarSesion(@PathVariable Long id,
                                                               @Valid @RequestBody SesionRequestDTO dto) {
        return ResponseEntity.ok(historiaClinicaService.actualizarSesion(id, dto));
    }

    @PatchMapping("/api/sesiones/{id}/estado")
    @Operation(summary = "Cambiar estado de una sesión")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<Void> cambiarEstadoSesion(@PathVariable Long id,
                                                     @Valid @RequestBody SesionEstadoRequestDTO dto) {
        historiaClinicaService.cambiarEstadoSesion(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/api/sesiones/{id}")
    @Operation(summary = "Eliminar (soft delete) sesión")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> eliminarSesion(@PathVariable Long id) {
        historiaClinicaService.eliminarSesion(id);
        return ResponseEntity.noContent().build();
    }
}
