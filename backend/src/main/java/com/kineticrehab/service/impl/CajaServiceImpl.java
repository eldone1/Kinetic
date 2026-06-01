package com.kineticrehab.service.impl;

import com.kineticrehab.dto.request.CajaAperturaRequestDTO;
import com.kineticrehab.dto.request.CajaCierreRequestDTO;
import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.exception.BadRequestException;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.CajaMapper;
import com.kineticrehab.mapper.VentaMapper;
import com.kineticrehab.model.Caja;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.model.Venta;
import com.kineticrehab.repository.CajaRepository;
import com.kineticrehab.repository.UsuarioRepository;
import com.kineticrehab.repository.VentaRepository;
import com.kineticrehab.service.CajaService;
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
public class CajaServiceImpl implements CajaService {

    private final CajaRepository cajaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VentaRepository ventaRepository;
    private final CajaMapper cajaMapper;
    private final VentaMapper ventaMapper;

    @Override
    @Transactional
    public CajaResponseDTO aperturar(CajaAperturaRequestDTO dto) {
        Usuario usuario = obtenerUsuarioActual();
        log.info("Aperturando caja para usuario: {}", usuario.getUsername());

        cajaRepository.findByUsuarioIdAndEstadoAndDeletedAtIsNull(usuario.getId(), "ABIERTO")
                .ifPresent(c -> {
                    throw new BadRequestException("Ya tienes una caja abierta (id: " + c.getId()
                            + "). Ciérrala antes de aperturar otra.");
                });

        Caja caja = Caja.builder()
                .usuario(usuario)
                .fechaApertura(LocalDateTime.now())
                .montoInicial(dto.getMontoInicial())
                .observaciones(dto.getObservaciones())
                .estado("ABIERTO")
                .build();

        caja = cajaRepository.save(caja);
        log.info("Caja aperturada exitosamente con id: {}", caja.getId());
        return cajaMapper.toDTO(caja);
    }

    @Override
    @Transactional
    public CajaResponseDTO cerrar(Long id, CajaCierreRequestDTO dto) {
        Usuario usuario = obtenerUsuarioActual();
        log.info("Cerrando caja {} para usuario: {}", id, usuario.getUsername());

        Caja caja = cajaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caja no encontrada con id: " + id));

        if (!"ABIERTO".equals(caja.getEstado())) {
            throw new BadRequestException("La caja ya está cerrada");
        }

        List<Venta> ventas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(id);

        BigDecimal totalEfectivo = ventas.stream()
                .filter(v -> "EFECTIVO".equals(v.getMetodoPago()))
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalYapePlin = ventas.stream()
                .filter(v -> "YAPE_PLIN".equals(v.getMetodoPago()))
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long cantidadVentas = ventas.size();

        caja.setFechaCierre(LocalDateTime.now());
        caja.setMontoFinalEfectivo(dto.getMontoFinalEfectivo());
        caja.setMontoFinalYapePlin(dto.getMontoFinalYapePlin());
        caja.setTotalVentas(totalEfectivo.add(totalYapePlin));
        caja.setObservaciones(dto.getObservaciones());
        caja.setEstado("CERRADO");

        caja = cajaRepository.save(caja);
        log.info("Caja {} cerrada exitosamente. Total ventas: {}", id, caja.getTotalVentas());
        return cajaMapper.toDTOConVentas(caja, (int) cantidadVentas);
    }

    @Override
    public CajaResponseDTO obtenerActiva() {
        Usuario usuario = obtenerUsuarioActual();
        log.debug("Buscando caja activa para usuario: {}", usuario.getUsername());

        return cajaRepository.findByUsuarioIdAndEstadoAndDeletedAtIsNull(usuario.getId(), "ABIERTO")
                .map(caja -> {
                    long cantidadVentas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(caja.getId()).size();
                    return cajaMapper.toDTOConVentas(caja, (int) cantidadVentas);
                })
                .orElse(null);
    }

    @Override
    public List<CajaResponseDTO> listarMias() {
        Usuario usuario = obtenerUsuarioActual();
        log.info("Listando cajas del usuario: {}", usuario.getUsername());

        return cajaRepository.findByUsuarioIdAndDeletedAtIsNullOrderByFechaAperturaDesc(usuario.getId()).stream()
                .map(caja -> {
                    long cantidadVentas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(caja.getId()).size();
                    return cajaMapper.toDTOConVentas(caja, (int) cantidadVentas);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CajaResponseDTO> listarTodas() {
        log.info("Listando todas las cajas");

        return cajaRepository.findAllByDeletedAtIsNullOrderByFechaAperturaDesc().stream()
                .map(caja -> {
                    long cantidadVentas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(caja.getId()).size();
                    return cajaMapper.toDTOConVentas(caja, (int) cantidadVentas);
                })
                .collect(Collectors.toList());
    }

    @Override
    public CajaResponseDTO obtenerPorId(Long id) {
        log.info("Buscando caja con id: {}", id);

        Caja caja = cajaRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Caja no encontrada con id: " + id));

        long cantidadVentas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(id).size();
        return cajaMapper.toDTOConVentas(caja, (int) cantidadVentas);
    }

    @Override
    public List<VentaResponseDTO> obtenerVentas(Long cajaId) {
        log.info("Obteniendo ventas de la caja: {}", cajaId);

        cajaRepository.findByIdAndDeletedAtIsNull(cajaId)
                .orElseThrow(() -> new ResourceNotFoundException("Caja no encontrada con id: " + cajaId));

        return ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(cajaId).stream()
                .map(ventaMapper::toDTO)
                .collect(Collectors.toList());
    }

    private Usuario obtenerUsuarioActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }
}
