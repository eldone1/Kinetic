package com.kineticrehab.service.impl;

import com.kineticrehab.dto.response.CitaResponseDTO;
import com.kineticrehab.dto.response.DashboardAdminDTO;
import com.kineticrehab.dto.response.DashboardDoctorDTO;
import com.kineticrehab.dto.response.DashboardRecepcionDTO;
import com.kineticrehab.dto.response.PacienteResponseDTO;
import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.ChartDataPoint;
import com.kineticrehab.exception.ResourceNotFoundException;
import com.kineticrehab.mapper.CitaMapper;
import com.kineticrehab.mapper.PacienteMapper;
import com.kineticrehab.mapper.VentaMapper;
import com.kineticrehab.mapper.CajaMapper;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Paciente;
import com.kineticrehab.model.Sesion;
import com.kineticrehab.model.Tratamiento;
import com.kineticrehab.model.Usuario;
import com.kineticrehab.model.Venta;
import com.kineticrehab.model.Caja;
import com.kineticrehab.repository.CitaRepository;
import com.kineticrehab.repository.CajaRepository;
import com.kineticrehab.repository.DoctorRepository;
import com.kineticrehab.repository.PacienteRepository;
import com.kineticrehab.repository.SesionRepository;
import com.kineticrehab.repository.TratamientoRepository;
import com.kineticrehab.repository.UsuarioRepository;
import com.kineticrehab.repository.VentaRepository;
import com.kineticrehab.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final CitaRepository citaRepository;
    private final VentaRepository ventaRepository;
    private final PacienteRepository pacienteRepository;
    private final SesionRepository sesionRepository;
    private final TratamientoRepository tratamientoRepository;
    private final CajaRepository cajaRepository;
    private final DoctorRepository doctorRepository;
    private final UsuarioRepository usuarioRepository;
    private final CitaMapper citaMapper;
    private final VentaMapper ventaMapper;
    private final PacienteMapper pacienteMapper;
    private final CajaMapper cajaMapper;

    private Usuario obtenerUsuarioActual() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + username));
    }

    @Override
    public DashboardAdminDTO obtenerDashboardAdmin() {
        log.info("Generando dashboard de administrador");
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(LocalTime.MAX);
        LocalDate inicioMes = hoy.withDayOfMonth(1);

        List<Venta> ventasHoy = ventaRepository.findByFechaVentaBetweenAndDeletedAtIsNull(inicioHoy, finHoy)
                .stream().filter(v -> "COMPLETADA".equals(v.getEstado())).toList();
        BigDecimal ventasDelDia = ventasHoy.stream()
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Venta> ventasMes = ventaRepository.findByFechaVentaBetweenAndDeletedAtIsNull(inicioMes.atStartOfDay(), finHoy)
                .stream().filter(v -> "COMPLETADA".equals(v.getEstado())).toList();
        BigDecimal ventasDelMes = ventasMes.stream()
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ticketPromedio = ventasMes.isEmpty() ? BigDecimal.ZERO :
                ventasDelMes.divide(BigDecimal.valueOf(ventasMes.size()), 2, RoundingMode.HALF_UP);

        int pacientesNuevosHoy = (int) pacienteRepository.findAllByDeletedAtIsNull().stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().toLocalDate().equals(hoy)).count();

        long pacientesActivos = tratamientoRepository.findByEstadoAndDeletedAtIsNull("ACTIVO").stream()
                .map(t -> t.getHistoriaClinica().getPaciente().getId()).distinct().count();

        long citasProgramadasHoy = citaRepository.countByFechaAndEstadoAndDeletedAtIsNull(hoy, "PROGRAMADA");
        long citasCompletadasHoy = citaRepository.countByFechaAndEstadoAndDeletedAtIsNull(hoy, "COMPLETADA");
        long sesionesRealizadasHoy = sesionRepository.countByFechaAndEstadoAndDeletedAtIsNull(hoy, "REALIZADA");

        long cajasAbiertas = cajaRepository.countByEstadoAndDeletedAtIsNull("ABIERTO");
        long cajasCerradasHoy = cajaRepository.findAllByDeletedAtIsNullOrderByFechaAperturaDesc().stream()
                .filter(c -> "CERRADO".equals(c.getEstado()) && c.getFechaCierre() != null
                        && c.getFechaCierre().toLocalDate().equals(hoy)).count();

        List<ChartDataPoint> ventasMensuales = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            LocalDate mes = hoy.minusMonths(i);
            LocalDate inicio = mes.withDayOfMonth(1);
            LocalDate fin = mes.withDayOfMonth(mes.lengthOfMonth());
            BigDecimal total = ventaRepository.findByFechaVentaBetweenAndDeletedAtIsNull(
                            inicio.atStartOfDay(), fin.atTime(LocalTime.MAX)).stream()
                    .filter(v -> "COMPLETADA".equals(v.getEstado()))
                    .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
            ventasMensuales.add(ChartDataPoint.builder()
                    .label(String.valueOf(mes.getMonthValue())).value(total).build());
        }

        List<ChartDataPoint> pacientesPorDia = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate dia = hoy.minusDays(i);
            long count = citaRepository.countByFechaAndDeletedAtIsNull(dia);
            pacientesPorDia.add(ChartDataPoint.builder()
                    .label(dia.getDayOfMonth() + "/" + dia.getMonthValue()).value(BigDecimal.valueOf(count)).build());
        }

        List<ChartDataPoint> serviciosMasDemandados = citaRepository
                .findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(inicioMes, hoy).stream()
                .filter(c -> c.getServicio() != null && !"CANCELADA".equals(c.getEstado()))
                .collect(Collectors.groupingBy(c -> c.getServicio().getNombre(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> ChartDataPoint.builder().label(e.getKey()).value(BigDecimal.valueOf(e.getValue())).build())
                .toList();

        List<ChartDataPoint> rendimientoDoctores = citaRepository
                .findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(inicioMes, hoy).stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()) && c.getDoctor() != null)
                .collect(Collectors.groupingBy(c -> c.getDoctor().getNombres() + " " + c.getDoctor().getApellidos(),
                        Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> ChartDataPoint.builder().label(e.getKey()).value(BigDecimal.valueOf(e.getValue())).build())
                .toList();

        return DashboardAdminDTO.builder()
                .ventasDelDia(ventasDelDia).ventasDelMes(ventasDelMes).ticketPromedio(ticketPromedio)
                .pacientesNuevosHoy(pacientesNuevosHoy).pacientesActivos((int) pacientesActivos)
                .citasProgramadasHoy((int) citasProgramadasHoy).citasCompletadasHoy((int) citasCompletadasHoy)
                .sesionesRealizadasHoy((int) sesionesRealizadasHoy)
                .cajasAbiertas((int) cajasAbiertas).cajasCerradasHoy((int) cajasCerradasHoy)
                .ventasMensuales(ventasMensuales).pacientesPorDia(pacientesPorDia)
                .serviciosMasDemandados(serviciosMasDemandados).rendimientoDoctores(rendimientoDoctores)
                .cajasSinCerrar((int) (cajasAbiertas))
                .build();
    }

    @Override
    public DashboardDoctorDTO obtenerDashboardDoctor() {
        log.info("Generando dashboard de doctor");
        Usuario usuario = obtenerUsuarioActual();
        Doctor doctor = doctorRepository.findByUsuarioIdAndDeletedAtIsNull(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor no encontrado para el usuario actual"));
        Long docId = doctor.getId();
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);
        LocalDate finMes = hoy.withDayOfMonth(hoy.lengthOfMonth());

        long pacientesAtendidosHoy = citaRepository
                .findByDoctorIdAndFechaAndDeletedAtIsNullOrderByHoraInicioAsc(docId, hoy).stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()))
                .map(c -> c.getPaciente().getId()).distinct().count();

        long citasPendientes = citaRepository.findByDoctorIdAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(docId)
                .stream().filter(c -> !c.getFecha().isBefore(hoy) && "PROGRAMADA".equals(c.getEstado())).count();

        long citasCompletadasHoy = citaRepository
                .countByDoctorIdAndFechaAndEstadoAndDeletedAtIsNull(docId, hoy, "COMPLETADA");

        long sesionesProgramadasHoy = sesionRepository
                .countByFechaAndEstadoAndTratamientoDoctorIdAndDeletedAtIsNull(hoy, "PROGRAMADA", docId);

        long pacientesEnTratamientoActivo = tratamientoRepository.findByDoctorIdAndDeletedAtIsNull(docId).stream()
                .filter(t -> "ACTIVO".equals(t.getEstado()))
                .map(t -> t.getHistoriaClinica().getPaciente().getId()).distinct().count();

        List<CitaResponseDTO> agendaDelDia = citaRepository
                .findByDoctorIdAndFechaAndDeletedAtIsNullOrderByHoraInicioAsc(docId, hoy).stream()
                .map(citaMapper::toDTO).toList();

        List<CitaResponseDTO> proximasCitas = citaRepository
                .findByDoctorIdAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(docId).stream()
                .filter(c -> c.getFecha().isAfter(hoy) || (c.getFecha().equals(hoy) && c.getHoraInicio().isAfter(LocalTime.now())))
                .limit(5).map(citaMapper::toDTO).toList();

        List<PacienteResponseDTO> pacientesRecientes = citaRepository
                .findByDoctorIdAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(docId).stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()))
                .map(Cita::getPaciente).distinct()
                .limit(5).map(pacienteMapper::toDTO).toList();

        List<ChartDataPoint> atencionesPorDia = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate dia = hoy.minusDays(i);
            long count = citaRepository.countByDoctorIdAndFechaAndEstadoAndDeletedAtIsNull(docId, dia, "COMPLETADA");
            atencionesPorDia.add(ChartDataPoint.builder()
                    .label(dia.getDayOfMonth() + "/" + dia.getMonthValue()).value(BigDecimal.valueOf(count)).build());
        }

        List<Tratamiento> tratamientosDoctor = tratamientoRepository.findByDoctorIdAndDeletedAtIsNull(docId);
        List<ChartDataPoint> distribucionTratamientos = tratamientosDoctor.stream()
                .filter(t -> t.getHistoriaClinica() != null && t.getHistoriaClinica().getPaciente() != null)
                .collect(Collectors.groupingBy(t -> t.getEstado(), Collectors.counting()))
                .entrySet().stream()
                .map(e -> ChartDataPoint.builder().label(e.getKey()).value(BigDecimal.valueOf(e.getValue())).build())
                .toList();

        return DashboardDoctorDTO.builder()
                .pacientesAtendidosHoy((int) pacientesAtendidosHoy)
                .citasPendientes((int) citasPendientes)
                .citasCompletadasHoy((int) citasCompletadasHoy)
                .sesionesProgramadasHoy((int) sesionesProgramadasHoy)
                .pacientesEnTratamientoActivo((int) pacientesEnTratamientoActivo)
                .agendaDelDia(agendaDelDia).proximasCitas(proximasCitas).pacientesRecientes(pacientesRecientes)
                .atencionesPorDia(atencionesPorDia).distribucionTratamientos(distribucionTratamientos)
                .build();
    }

    @Override
    public DashboardRecepcionDTO obtenerDashboardRecepcion() {
        log.info("Generando dashboard de recepción");
        Usuario usuario = obtenerUsuarioActual();
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(LocalTime.MAX);

        long citasDelDia = citaRepository.countByFechaAndDeletedAtIsNull(hoy);
        long citasProgramadas = citaRepository.countByFechaAndEstadoAndDeletedAtIsNull(hoy, "PROGRAMADA");
        long citasCanceladas = citaRepository.countByFechaAndEstadoAndDeletedAtIsNull(hoy, "CANCELADA");

        List<Venta> ventasHoy = ventaRepository.findByFechaVentaBetweenAndDeletedAtIsNull(inicioHoy, finHoy)
                .stream().filter(v -> "COMPLETADA".equals(v.getEstado())).toList();
        BigDecimal ventasDelDia = ventasHoy.stream()
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        CajaResponseDTO cajaActualDTO = null;
        var cajaOpt = cajaRepository.findByUsuarioIdAndEstadoAndDeletedAtIsNull(usuario.getId(), "ABIERTO");
        if (cajaOpt.isPresent()) {
            Caja caja = cajaOpt.get();
            List<Venta> ventas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(caja.getId());
            BigDecimal totalEfectivo = ventas.stream()
                    .filter(v -> "EFECTIVO".equals(v.getMetodoPago()) && "COMPLETADA".equals(v.getEstado()))
                    .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalYapePlin = ventas.stream()
                    .filter(v -> ("YAPE".equals(v.getMetodoPago()) || "PLIN".equals(v.getMetodoPago())) && "COMPLETADA".equals(v.getEstado()))
                    .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
            cajaActualDTO = CajaResponseDTO.builder()
                    .id(caja.getId()).idUsuario(caja.getUsuario().getId())
                    .nombreUsuario(caja.getUsuario().getNombre())
                    .fechaApertura(caja.getFechaApertura()).montoInicial(caja.getMontoInicial())
                    .fechaCierre(caja.getFechaCierre()).montoFinalEfectivo(caja.getMontoFinalEfectivo())
                    .montoFinalYapePlin(caja.getMontoFinalYapePlin()).totalVentas(caja.getTotalVentas())
                    .observaciones(caja.getObservaciones()).estado(caja.getEstado())
                    .cantidadVentas(ventas.size()).build();
        }

        List<CitaResponseDTO> agendaDelDia = citaRepository
                .findByFechaAndDeletedAtIsNullOrderByHoraInicioAsc(hoy).stream()
                .map(citaMapper::toDTO).toList();

        List<CitaResponseDTO> cobrosPendientes = new ArrayList<>();
        citaRepository.findByEstadoAndDeletedAtIsNull("COMPLETADA").stream()
                .filter(c -> ventaRepository.findByCitaIdAndDeletedAtIsNull(c.getId()).isEmpty())
                .limit(10).map(citaMapper::toDTO).forEach(cobrosPendientes::add);

        List<VentaResponseDTO> ultimasVentas = ventaRepository
                .findAllByDeletedAtIsNullOrderByFechaVentaDesc().stream()
                .limit(10).map(ventaMapper::toDTO).toList();

        BigDecimal totalEfectivo = ventasHoy.stream()
                .filter(v -> "EFECTIVO".equals(v.getMetodoPago()))
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalYapePlin = ventasHoy.stream()
                .filter(v -> "YAPE".equals(v.getMetodoPago()) || "PLIN".equals(v.getMetodoPago()))
                .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ChartDataPoint> cobrosPorMetodoPago = List.of(
                ChartDataPoint.builder().label("Efectivo").value(totalEfectivo).build(),
                ChartDataPoint.builder().label("Yape/Plin").value(totalYapePlin).build()
        );

        List<ChartDataPoint> serviciosMasVendidos = citaRepository
                .findByFechaAndDeletedAtIsNullOrderByHoraInicioAsc(hoy).stream()
                .filter(c -> c.getServicio() != null && "COMPLETADA".equals(c.getEstado()))
                .collect(Collectors.groupingBy(c -> c.getServicio().getNombre(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> ChartDataPoint.builder().label(e.getKey()).value(BigDecimal.valueOf(e.getValue())).build())
                .toList();

        return DashboardRecepcionDTO.builder()
                .citasDelDia((int) citasDelDia).pacientesEnEspera((int) citasProgramadas)
                .citasConfirmadas((int) citasProgramadas).citasCanceladas((int) citasCanceladas)
                .ventasDelDia(ventasDelDia).cajaActual(cajaActualDTO)
                .agendaDelDia(agendaDelDia).cobrosPendientes(cobrosPendientes).ultimasVentas(ultimasVentas)
                .totalEfectivo(totalEfectivo).totalYapePlin(totalYapePlin)
                .cobrosPorMetodoPago(cobrosPorMetodoPago).serviciosMasVendidos(serviciosMasVendidos)
                .build();
    }
}
