package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.VentaRequestDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.DuplicateEntityException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.VentaMapper;
import com.kineticrehab.model.*;
import com.kineticrehab.repository.*;
import com.kineticrehab.service.VentaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final CajaRepository cajaRepository;
    private final PacienteRepository pacienteRepository;
    private final CitaRepository citaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaMapper ventaMapper;

    @Override
    @Transactional
    public VentaResponseDTO registrar(VentaRequestDTO dto) {
        Usuario usuario = obtenerUsuarioActual();
        log.info("Registrando venta para cita {} por usuario {}", dto.getIdCita(), usuario.getUsername());

        Caja cajaActiva = cajaRepository
                .findByUsuarioIdAndEstadoAndDeletedAtIsNull(usuario.getId(), "ABIERTO")
                .orElseThrow(() -> new BadRequestException(
                        "No tienes una caja abierta. Apertura una caja antes de cobrar."));

        Paciente paciente = pacienteRepository.findByIdAndDeletedAtIsNull(dto.getIdPaciente())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con id: " + dto.getIdPaciente()));

        Cita cita = citaRepository.findByIdAndDeletedAtIsNull(dto.getIdCita())
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con id: " + dto.getIdCita()));

        if (!"COMPLETADA".equals(cita.getEstado())) {
            throw new BadRequestException(
                    "La cita debe estar en estado COMPLETADA para poder cobrarla. Estado actual: " + cita.getEstado());
        }

        ventaRepository.findByCitaIdAndDeletedAtIsNull(dto.getIdCita())
                .ifPresent(v -> {
                    throw new DuplicateEntityException(
                            "La cita " + dto.getIdCita() + " ya fue facturada en la venta " + v.getId());
                });

        validarMetodoPago(dto.getMetodoPago(), dto.getMontoRecibido(), dto.getTotal());

        BigDecimal cambio = null;
        if ("EFECTIVO".equals(dto.getMetodoPago()) && dto.getMontoRecibido() != null) {
            cambio = dto.getMontoRecibido().subtract(dto.getTotal());
        }

        Venta venta = Venta.builder()
                .caja(cajaActiva)
                .paciente(paciente)
                .cita(cita)
                .usuario(usuario)
                .fechaVenta(LocalDateTime.now())
                .total(dto.getTotal())
                .metodoPago(dto.getMetodoPago())
                .montoRecibido(dto.getMontoRecibido())
                .cambio(cambio)
                .estado("COMPLETADA")
                .build();

        venta = ventaRepository.save(venta);
        log.info("Venta registrada exitosamente con id: {}", venta.getId());
        return ventaMapper.toDTO(venta);
    }

    @Override
    public VentaResponseDTO obtenerPorId(Long id) {
        log.info("Buscando venta con id: {}", id);
        return ventaRepository.findByIdAndDeletedAtIsNull(id)
                .map(ventaMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada con id: " + id));
    }

    @Override
    public List<VentaResponseDTO> listarPorPaciente(Long pacienteId) {
        log.info("Listando ventas del paciente con id: {}", pacienteId);
        return ventaRepository.findByPacienteIdAndDeletedAtIsNullOrderByFechaVentaDesc(pacienteId).stream()
                .map(ventaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VentaResponseDTO obtenerPorCita(Long citaId) {
        log.info("Buscando venta por cita id: {}", citaId);
        return ventaRepository.findByCitaIdAndDeletedAtIsNull(citaId)
                .map(ventaMapper::toDTO)
                .orElse(null);
    }

    private void validarMetodoPago(String metodoPago, BigDecimal montoRecibido, BigDecimal total) {
        if (!"EFECTIVO".equals(metodoPago) && !"YAPE_PLIN".equals(metodoPago)) {
            throw new BadRequestException("Método de pago no válido: " + metodoPago
                    + ". Use EFECTIVO o YAPE_PLIN");
        }

        if ("EFECTIVO".equals(metodoPago)) {
            if (montoRecibido == null) {
                throw new BadRequestException("Para pagos en efectivo, el monto recibido es obligatorio");
            }
            if (montoRecibido.compareTo(total) < 0) {
                throw new BadRequestException(
                        "El monto recibido (S/ " + montoRecibido + ") es menor al total (S/ " + total + ")");
            }
        }
    }

    private Usuario obtenerUsuarioActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }
}
