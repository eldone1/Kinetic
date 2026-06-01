package com.kineticrehab.controller;

import com.kineticrehab.dto.request.VentaRequestDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.service.VentaService;
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
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@Tag(name = "Ventas", description = "Registro de cobros de servicios")
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    @Operation(summary = "Registrar un cobro (venta)")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<VentaResponseDTO> registrar(@Valid @RequestBody VentaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ventaService.registrar(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una venta")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<VentaResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerPorId(id));
    }

    @GetMapping("/paciente/{pacienteId}")
    @Operation(summary = "Listar ventas de un paciente")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<List<VentaResponseDTO>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(ventaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/cita/{citaId}")
    @Operation(summary = "Obtener venta por cita (para validar si ya fue facturada)")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<VentaResponseDTO> obtenerPorCita(@PathVariable Long citaId) {
        VentaResponseDTO venta = ventaService.obtenerPorCita(citaId);
        if (venta == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(venta);
    }
}
