package com.kineticrehab.controller;

import com.kineticrehab.model.Rol;
import com.kineticrehab.service.RolService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Consulta de roles del sistema")
public class RolController {

    private final RolService rolService;

    @GetMapping
    @Operation(summary = "Listar todos los roles activos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rol>> listarTodos() {
        return ResponseEntity.ok(rolService.listarTodos());
    }
}
