package com.kineticrehab.controller;

import com.kineticrehab.dto.response.DashboardAdminDTO;
import com.kineticrehab.dto.response.DashboardDoctorDTO;
import com.kineticrehab.dto.response.DashboardRecepcionDTO;
import com.kineticrehab.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard y KPIs por rol")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener dashboard del administrador")
    public ResponseEntity<DashboardAdminDTO> obtenerDashboardAdmin() {
        return ResponseEntity.ok(dashboardService.obtenerDashboardAdmin());
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Obtener dashboard del doctor autenticado")
    public ResponseEntity<DashboardDoctorDTO> obtenerDashboardDoctor() {
        return ResponseEntity.ok(dashboardService.obtenerDashboardDoctor());
    }

    @GetMapping("/recepcion")
    @PreAuthorize("hasRole('RECEPCION')")
    @Operation(summary = "Obtener dashboard de recepción")
    public ResponseEntity<DashboardRecepcionDTO> obtenerDashboardRecepcion() {
        return ResponseEntity.ok(dashboardService.obtenerDashboardRecepcion());
    }
}
