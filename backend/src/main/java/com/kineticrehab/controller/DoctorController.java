package com.kineticrehab.controller;

import com.kineticrehab.dto.request.DoctorEstadoRequestDTO;
import com.kineticrehab.dto.request.DoctorRequestDTO;
import com.kineticrehab.dto.request.HorarioRequestDTO;
import com.kineticrehab.dto.response.DoctorHorariosResponseDTO;
import com.kineticrehab.dto.response.DoctorResponseDTO;
import com.kineticrehab.dto.response.HorarioResponseDTO;
import com.kineticrehab.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctores")
@RequiredArgsConstructor
@Tag(name = "Doctores", description = "Gestión de doctores y personal médico")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Listar todos los doctores activos")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<DoctorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(doctorService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar doctor por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<DoctorResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar doctores por nombre, DNI o especialidad")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<List<DoctorResponseDTO>> buscar(@RequestParam String q) {
        return ResponseEntity.ok(doctorService.buscarPorTermino(q));
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Listar doctores activos (para combos/selectores)")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<DoctorResponseDTO>> listarDisponibles() {
        return ResponseEntity.ok(doctorService.listarDisponibles());
    }

    @GetMapping("/yo")
    @Operation(summary = "Obtener perfil del doctor del usuario autenticado")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorResponseDTO> miPerfil(Authentication authentication) {
        return ResponseEntity.ok(doctorService.buscarPorUsernameUsuario(authentication.getName()));
    }

    @GetMapping("/yo/perfil")
    @Operation(summary = "Obtener perfil completo del doctor autenticado con horarios incluidos")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorHorariosResponseDTO> miPerfilCompleto(Authentication authentication) {
        return ResponseEntity.ok(doctorService.obtenerMiPerfilCompleto(authentication.getName()));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo doctor")
    @ApiResponse(responseCode = "201", description = "Doctor creado correctamente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorResponseDTO> crear(@Valid @RequestBody DoctorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.crear(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un doctor existente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorResponseDTO> actualizar(@PathVariable Long id,
                                                         @Valid @RequestBody DoctorRequestDTO dto) {
        return ResponseEntity.ok(doctorService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Activar o desactivar un doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id,
                                               @Valid @RequestBody DoctorEstadoRequestDTO dto) {
        doctorService.cambiarEstado(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        doctorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/horarios")
    @Operation(summary = "Obtener horarios del doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<DoctorHorariosResponseDTO> obtenerHorarios(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.obtenerHorarios(id));
    }

    @PutMapping("/{id}/horarios")
    @Operation(summary = "Actualizar horarios del doctor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HorarioResponseDTO>> actualizarHorarios(@PathVariable Long id,
                                                                        @Valid @RequestBody List<HorarioRequestDTO> horarios) {
        return ResponseEntity.ok(doctorService.actualizarHorarios(id, horarios));
    }
}
