package com.kineticrehab.mapper;

import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.model.Caja;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CajaMapper {

    public CajaResponseDTO toDTO(Caja caja) {
        return CajaResponseDTO.builder()
                .id(caja.getId())
                .idUsuario(caja.getUsuario().getId())
                .nombreUsuario(caja.getUsuario().getNombre() + " " + caja.getUsuario().getApellidos())
                .fechaApertura(caja.getFechaApertura())
                .montoInicial(caja.getMontoInicial())
                .fechaCierre(caja.getFechaCierre())
                .montoFinalEfectivo(caja.getMontoFinalEfectivo())
                .montoFinalYapePlin(caja.getMontoFinalYapePlin())
                .totalVentas(caja.getTotalVentas())
                .observaciones(caja.getObservaciones())
                .estado(caja.getEstado())
                .build();
    }

    public CajaResponseDTO toDTOConVentas(Caja caja, Integer cantidadVentas) {
        return CajaResponseDTO.builder()
                .id(caja.getId())
                .idUsuario(caja.getUsuario().getId())
                .nombreUsuario(caja.getUsuario().getNombre() + " " + caja.getUsuario().getApellidos())
                .fechaApertura(caja.getFechaApertura())
                .montoInicial(caja.getMontoInicial())
                .fechaCierre(caja.getFechaCierre())
                .montoFinalEfectivo(caja.getMontoFinalEfectivo())
                .montoFinalYapePlin(caja.getMontoFinalYapePlin())
                .totalVentas(caja.getTotalVentas())
                .observaciones(caja.getObservaciones())
                .estado(caja.getEstado())
                .cantidadVentas(cantidadVentas)
                .build();
    }

    public CajaResponseDTO toDTOConEsperados(Caja caja, Integer cantidadVentas,
                                              BigDecimal esperadoEfectivo, BigDecimal esperadoYapePlin) {
        CajaResponseDTO dto = toDTOConVentas(caja, cantidadVentas);
        dto.setEsperadoEfectivo(esperadoEfectivo);
        dto.setEsperadoYapePlin(esperadoYapePlin);
        if (caja.getMontoFinalEfectivo() != null) {
            dto.setDiferenciaEfectivo(caja.getMontoFinalEfectivo().subtract(esperadoEfectivo));
        }
        if (caja.getMontoFinalYapePlin() != null) {
            dto.setDiferenciaYapePlin(caja.getMontoFinalYapePlin().subtract(esperadoYapePlin));
        }
        return dto;
    }
}
