package com.kineticrehab.controller;

import com.kineticrehab.dto.request.CajaAperturaRequestDTO;
import com.kineticrehab.dto.request.CajaCierreRequestDTO;
import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.service.CajaService;
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
@RequestMapping("/api/caja")
@RequiredArgsConstructor
@Tag(name = "Caja", description = "Gestión de apertura y cierre de caja")
public class CajaController {

    private final CajaService cajaService;

    @PostMapping("/aperturar")
    @Operation(summary = "Aperturar una nueva caja")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CajaResponseDTO> aperturar(@Valid @RequestBody CajaAperturaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cajaService.aperturar(dto));
    }

    @PostMapping("/{id}/cerrar")
    @Operation(summary = "Cerrar una caja abierta")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CajaResponseDTO> cerrar(@PathVariable Long id,
                                                   @Valid @RequestBody CajaCierreRequestDTO dto) {
        return ResponseEntity.ok(cajaService.cerrar(id, dto));
    }

    @GetMapping("/activa")
    @Operation(summary = "Obtener caja activa del usuario logueado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CajaResponseDTO> obtenerActiva() {
        CajaResponseDTO caja = cajaService.obtenerActiva();
        if (caja == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(caja);
    }

    @GetMapping("/mias")
    @Operation(summary = "Listar cajas del usuario logueado (recepción)")
    @PreAuthorize("hasRole('RECEPCION')")
    public ResponseEntity<List<CajaResponseDTO>> listarMias() {
        return ResponseEntity.ok(cajaService.listarMias());
    }

    @GetMapping
    @Operation(summary = "Listar todas las cajas (admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CajaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(cajaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una caja")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<CajaResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cajaService.obtenerPorId(id));
    }

    @GetMapping("/{id}/ventas")
    @Operation(summary = "Obtener ventas de una caja")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPCION')")
    public ResponseEntity<List<VentaResponseDTO>> obtenerVentas(@PathVariable Long id) {
        return ResponseEntity.ok(cajaService.obtenerVentas(id));
    }
}
