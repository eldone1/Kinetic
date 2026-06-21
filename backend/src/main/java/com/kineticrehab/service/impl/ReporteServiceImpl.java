package com.kineticrehab.service.impl;

import com.kineticrehab.dto.response.AtencionDoctorDetalleDTO;
import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.dto.response.ChartDataPoint;
import com.kineticrehab.dto.response.IngresoServicioDetalleDTO;
import com.kineticrehab.dto.response.OcupacionDetalleDTO;
import com.kineticrehab.dto.response.PacienteDetalleDTO;
import com.kineticrehab.dto.response.ReporteAtencionesDoctorDTO;
import com.kineticrehab.dto.response.ReporteIngresosServicioDTO;
import com.kineticrehab.dto.response.ReportePacientesDTO;
import com.kineticrehab.dto.response.ReporteVentasPeriodoDTO;
import com.kineticrehab.dto.response.VentaDetalleDTO;
import com.kineticrehab.model.Cita;
import com.kineticrehab.model.Venta;
import com.kineticrehab.repository.CitaRepository;
import com.kineticrehab.repository.CajaRepository;
import com.kineticrehab.repository.DoctorRepository;
import com.kineticrehab.repository.HorarioDoctorRepository;
import com.kineticrehab.repository.TratamientoRepository;
import com.kineticrehab.repository.VentaRepository;
import com.kineticrehab.service.ReporteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReporteServiceImpl implements ReporteService {

    private final VentaRepository ventaRepository;
    private final CitaRepository citaRepository;
    private final CajaRepository cajaRepository;
    private final DoctorRepository doctorRepository;
    private final HorarioDoctorRepository horarioDoctorRepository;
    private final TratamientoRepository tratamientoRepository;

    @Override
    public List<ReporteVentasPeriodoDTO> ventasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Reporte ventas por período: {} - {}", fechaInicio, fechaFin);
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(LocalTime.MAX);

        List<Venta> ventas = ventaRepository.findByFechaVentaBetweenAndDeletedAtIsNull(inicio, fin).stream()
                .filter(v -> "COMPLETADA".equals(v.getEstado()))
                .toList();

        return ventas.stream()
                .collect(Collectors.groupingBy(v -> v.getFechaVenta().toLocalDate(), Collectors.toList()))
                .entrySet().stream()
                .map(e -> {
                    BigDecimal efectivo = e.getValue().stream()
                            .filter(v -> "EFECTIVO".equals(v.getMetodoPago()))
                            .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal yapePlin = e.getValue().stream()
                            .filter(v -> "YAPE".equals(v.getMetodoPago()) || "PLIN".equals(v.getMetodoPago()))
                            .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    List<VentaDetalleDTO> detalles = e.getValue().stream()
                            .map(v -> VentaDetalleDTO.builder()
                                    .pacienteNombre(v.getPaciente().getNombres() + " " + v.getPaciente().getApellidos())
                                    .servicio(v.getCita() != null && v.getCita().getServicio() != null
                                            ? v.getCita().getServicio().getNombre() : "-")
                                    .metodoPago(v.getMetodoPago())
                                    .monto(v.getTotal())
                                    .build())
                            .toList();
                    return ReporteVentasPeriodoDTO.builder()
                            .fecha(e.getKey())
                            .cantidadVentas(e.getValue().size())
                            .totalEfectivo(efectivo)
                            .totalYapePlin(yapePlin)
                            .totalGeneral(efectivo.add(yapePlin))
                            .ventas(detalles)
                            .build();
                })
                .sorted(Comparator.comparing(ReporteVentasPeriodoDTO::getFecha))
                .toList();
    }

    @Override
    public List<ReporteIngresosServicioDTO> ingresosPorServicio(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Reporte ingresos por servicio: {} - {}", fechaInicio, fechaFin);
        var citas = citaRepository
                .findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(fechaInicio, fechaFin)
                .stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()) && c.getServicio() != null)
                .toList();

        return citas.stream()
                .collect(Collectors.groupingBy(c -> c.getServicio().getNombre(), Collectors.toList()))
                .entrySet().stream()
                .map(e -> {
                    String nombre = e.getKey();
                    List<Cita> lista = e.getValue();
                    BigDecimal total = lista.stream()
                            .map(c -> c.getPrecio() != null ? c.getPrecio() : BigDecimal.ZERO)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    List<IngresoServicioDetalleDTO> detalles = lista.stream()
                            .map(c -> IngresoServicioDetalleDTO.builder()
                                    .fecha(c.getFecha())
                                    .pacienteNombre(c.getPaciente().getNombres() + " " + c.getPaciente().getApellidos())
                                    .monto(c.getPrecio() != null ? c.getPrecio() : BigDecimal.ZERO)
                                    .build())
                            .toList();
                    return ReporteIngresosServicioDTO.builder()
                            .servicio(nombre)
                            .cantidad(lista.size())
                            .total(total)
                            .detalleCitas(detalles)
                            .build();
                })
                .sorted(Comparator.comparing(ReporteIngresosServicioDTO::getTotal).reversed())
                .toList();
    }

    @Override
    public List<ReporteAtencionesDoctorDTO> atencionesPorDoctor(LocalDate fechaInicio, LocalDate fechaFin, Long idDoctor) {
        log.info("Reporte atenciones por doctor: {} - {}, doctor: {}", fechaInicio, fechaFin, idDoctor);
        long totalDias = ChronoUnit.DAYS.between(fechaInicio, fechaFin) + 1;

        var doctores = doctorRepository.findByActivoTrueAndDeletedAtIsNullOrderByApellidosAsc().stream()
                .filter(d -> idDoctor == null || d.getId().equals(idDoctor))
                .toList();

        var todasCitas = citaRepository
                .findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(fechaInicio, fechaFin);

        List<ReporteAtencionesDoctorDTO> resultado = new ArrayList<>();

        for (var doctor : doctores) {
            var citasDoctor = todasCitas.stream()
                    .filter(c -> c.getDoctor() != null && c.getDoctor().getId().equals(doctor.getId()))
                    .toList();

            var horarios = horarioDoctorRepository.findByDoctorIdAndDeletedAtIsNullOrderByDiaSemanaAscHoraInicioAsc(doctor.getId());
            long slotsDisponibles = 0;
            for (int i = 0; i < totalDias; i++) {
                LocalDate dia = fechaInicio.plusDays(i);
                DayOfWeek dayOfWeek = dia.getDayOfWeek();
                for (var horario : horarios) {
                    if (horario.getDiaSemana().equalsIgnoreCase(dayOfWeek.name())) {
                        long minutos = ChronoUnit.MINUTES.between(horario.getHoraInicio(), horario.getHoraFin());
                        slotsDisponibles += minutos / 30;
                    }
                }
            }

            var citasNoCanceladas = citasDoctor.stream()
                    .filter(c -> !"CANCELADA".equals(c.getEstado()))
                    .toList();

            List<AtencionDoctorDetalleDTO> detallesCitas = citasDoctor.stream()
                    .map(c -> AtencionDoctorDetalleDTO.builder()
                            .fecha(c.getFecha())
                            .pacienteNombre(c.getPaciente().getNombres() + " " + c.getPaciente().getApellidos())
                            .estado(c.getEstado())
                            .build())
                    .toList();

            List<OcupacionDetalleDTO> slots = citasNoCanceladas.stream()
                    .map(c -> OcupacionDetalleDTO.builder()
                            .horaInicio(c.getHoraInicio())
                            .horaFin(c.getHoraFin())
                            .pacienteNombre(c.getPaciente().getNombres() + " " + c.getPaciente().getApellidos())
                            .estado(c.getEstado())
                            .build())
                    .toList();

            double pct = slotsDisponibles > 0
                    ? (double) citasNoCanceladas.size() / slotsDisponibles * 100 : 0;

            resultado.add(ReporteAtencionesDoctorDTO.builder()
                    .idDoctor(doctor.getId())
                    .nombreDoctor(doctor.getNombres() + " " + doctor.getApellidos())
                    .totalCitasCompletadas(citasDoctor.stream().filter(c -> "COMPLETADA".equals(c.getEstado())).count())
                    .totalCitasCanceladas(citasDoctor.stream().filter(c -> "CANCELADA".equals(c.getEstado())).count())
                    .totalCitasNoAsistio(citasDoctor.stream().filter(c -> "NO_ASISTIO".equals(c.getEstado())).count())
                    .capacidadTotal(slotsDisponibles)
                    .porcentajeOcupacion(Math.round(pct * 100.0) / 100.0)
                    .citas(detallesCitas)
                    .slots(slots)
                    .build());
        }

        resultado.sort(Comparator.comparing(ReporteAtencionesDoctorDTO::getTotalCitasCompletadas).reversed());
        return resultado;
    }

    @Override
    public List<CajaResponseDTO> cierresCaja(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Reporte cierres caja: {} - {}", fechaInicio, fechaFin);
        return cajaRepository.findAllByDeletedAtIsNullOrderByFechaAperturaDesc().stream()
                .filter(c -> "CERRADO".equals(c.getEstado()))
                .filter(c -> c.getFechaCierre() != null)
                .filter(c -> {
                    LocalDate dia = c.getFechaCierre().toLocalDate();
                    return (fechaInicio == null || !dia.isBefore(fechaInicio))
                            && (fechaFin == null || !dia.isAfter(fechaFin));
                })
                .map(c -> {
                    var ventas = ventaRepository.findByCajaIdAndDeletedAtIsNullOrderByFechaVentaDesc(c.getId());
                    var ventasCompletadas = ventas.stream()
                            .filter(v -> "COMPLETADA".equals(v.getEstado())).toList();
                    BigDecimal esperadoEfectivo = ventasCompletadas.stream()
                            .filter(v -> "EFECTIVO".equals(v.getMetodoPago()))
                            .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal esperadoYapePlin = ventasCompletadas.stream()
                            .filter(v -> "YAPE".equals(v.getMetodoPago()) || "PLIN".equals(v.getMetodoPago()))
                            .map(Venta::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal difEfectivo = c.getMontoFinalEfectivo() != null
                            ? c.getMontoFinalEfectivo().subtract(esperadoEfectivo) : BigDecimal.ZERO;
                    BigDecimal difYapePlin = c.getMontoFinalYapePlin() != null
                            ? c.getMontoFinalYapePlin().subtract(esperadoYapePlin) : BigDecimal.ZERO;

                    List<VentaDetalleDTO> detalles = ventasCompletadas.stream()
                            .map(v -> VentaDetalleDTO.builder()
                                    .pacienteNombre(v.getPaciente().getNombres() + " " + v.getPaciente().getApellidos())
                                    .servicio(v.getCita() != null && v.getCita().getServicio() != null
                                            ? v.getCita().getServicio().getNombre() : "-")
                                    .metodoPago(v.getMetodoPago())
                                    .monto(v.getTotal())
                                    .build())
                            .toList();

                    return CajaResponseDTO.builder()
                            .id(c.getId())
                            .idUsuario(c.getUsuario().getId())
                            .nombreUsuario(c.getUsuario().getNombre() + " " + (c.getUsuario().getApellidos() != null ? c.getUsuario().getApellidos() : ""))
                            .fechaApertura(c.getFechaApertura())
                            .montoInicial(c.getMontoInicial())
                            .fechaCierre(c.getFechaCierre())
                            .montoFinalEfectivo(c.getMontoFinalEfectivo())
                            .montoFinalYapePlin(c.getMontoFinalYapePlin())
                            .totalVentas(c.getTotalVentas())
                            .observaciones(c.getObservaciones())
                            .estado(c.getEstado())
                            .cantidadVentas(ventasCompletadas.size())
                            .esperadoEfectivo(esperadoEfectivo)
                            .esperadoYapePlin(esperadoYapePlin)
                            .diferenciaEfectivo(difEfectivo)
                            .diferenciaYapePlin(difYapePlin)
                            .ventasDetalle(detalles)
                            .build();
                })
                .toList();
    }

    @Override
    public ReportePacientesDTO pacientesAtendidos(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Reporte pacientes atendidos: {} - {}", fechaInicio, fechaFin);
        var citas = citaRepository
                .findByFechaBetweenAndDeletedAtIsNullOrderByFechaAscHoraInicioAsc(fechaInicio, fechaFin)
                .stream()
                .filter(c -> "COMPLETADA".equals(c.getEstado()) || "EN_PROGRESO".equals(c.getEstado()))
                .toList();

        var pacientesUnicos = citas.stream()
                .map(c -> c.getPaciente().getId())
                .distinct()
                .toList();

        long pacientesRecurrentes = 0;
        for (Long idPaciente : pacientesUnicos) {
            long count = citas.stream()
                    .filter(c -> c.getPaciente().getId().equals(idPaciente))
                    .count();
            if (count > 1) {
                pacientesRecurrentes++;
            }
        }
        long pacientesNuevos = pacientesUnicos.size() - pacientesRecurrentes;

        var pacientesPorDia = citas.stream()
                .collect(Collectors.groupingBy(c -> c.getFecha(), Collectors.toList()))
                .entrySet().stream()
                .map(e -> {
                    var pacientesDia = e.getValue().stream()
                            .map(c -> c.getPaciente().getId())
                            .distinct()
                            .toList();
                    List<PacienteDetalleDTO> detalles = pacientesDia.stream()
                            .map(id -> {
                                var cita = e.getValue().stream()
                                        .filter(c -> c.getPaciente().getId().equals(id))
                                        .findFirst().orElse(null);
                                if (cita == null) return null;
                                return PacienteDetalleDTO.builder()
                                        .nombrePaciente(cita.getPaciente().getNombres() + " " + cita.getPaciente().getApellidos())
                                        .build();
                            })
                            .filter(java.util.Objects::nonNull)
                            .toList();
                    return ReportePacientesDTO.PacientePorDia.builder()
                            .fecha(e.getKey())
                            .total(pacientesDia.size())
                            .pacientes(detalles)
                            .build();
                })
                .sorted(Comparator.comparing(ReportePacientesDTO.PacientePorDia::getFecha))
                .toList();

        return ReportePacientesDTO.builder()
                .pacientesNuevos(pacientesNuevos)
                .pacientesRecurrentes(pacientesRecurrentes)
                .totalPacientes(pacientesUnicos.size())
                .pacientesPorDia(pacientesPorDia)
                .build();
    }

    @Override
    public List<ChartDataPoint> tratamientosEstado() {
        log.info("Reporte tratamientos por estado");
        return tratamientoRepository.findByEstadoAndDeletedAtIsNull("ACTIVO").stream()
                .collect(Collectors.groupingBy(t -> t.getEstado() != null ? t.getEstado() : "OTRO",
                        Collectors.counting()))
                .entrySet().stream()
                .map(e -> ChartDataPoint.builder()
                        .label(e.getKey())
                        .value(BigDecimal.valueOf(e.getValue()))
                        .build())
                .toList();
    }
}
