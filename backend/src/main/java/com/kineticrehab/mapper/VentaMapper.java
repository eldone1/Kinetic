package com.kineticrehab.mapper;

import com.kineticrehab.dto.response.VentaResponseDTO;
import com.kineticrehab.model.Venta;
import org.springframework.stereotype.Component;

@Component
public class VentaMapper {

    public VentaResponseDTO toDTO(Venta venta) {
        return VentaResponseDTO.builder()
                .id(venta.getId())
                .idCaja(venta.getCaja().getId())
                .idPaciente(venta.getPaciente().getId())
                .nombrePaciente(venta.getPaciente().getNombres() + " " + venta.getPaciente().getApellidos())
                .documentoPaciente(venta.getPaciente().getNumeroDocumento())
                .idCita(venta.getCita().getId())
                .fechaCita(venta.getCita().getFecha().toString())
                .horaCita(venta.getCita().getHoraInicio().toString())
                .idUsuario(venta.getUsuario().getId())
                .nombreUsuario(venta.getUsuario().getNombre() + " " + venta.getUsuario().getApellidos())
                .fechaVenta(venta.getFechaVenta())
                .total(venta.getTotal())
                .metodoPago(venta.getMetodoPago())
                .montoRecibido(venta.getMontoRecibido())
                .cambio(venta.getCambio())
                .estado(venta.getEstado())
                .build();
    }
}
