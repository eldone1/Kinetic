package com.kineticrehab.controller;

import com.kineticrehab.dto.request.ServicioRequestDTO;
import com.kineticrehab.dto.response.ServicioResponseDTO;
import com.kineticrehab.service.ServicioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@Tag(name = "Servicios", description = "Catálogo de servicios con precios")
public class ServicioController {

    private final ServicioService servicioService;

    @GetMapping("/activos")
    @Operation(summary = "Listar servicios activos del catálogo")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<List<ServicioResponseDTO>> listarActivos() {
        return ResponseEntity.ok(servicioService.listarActivos());
    }

    @GetMapping
    @Operation(summary = "Listar todos los servicios (admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServicioResponseDTO>> listarTodos() {
        return ResponseEntity.ok(servicioService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un servicio por ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION', 'DOCTOR')")
    public ResponseEntity<ServicioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicioService.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo servicio")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioResponseDTO> crear(@Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.crear(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un servicio")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServicioResponseDTO> actualizar(@PathVariable Long id,
                                                           @Valid @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar (soft delete) un servicio")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        servicioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
