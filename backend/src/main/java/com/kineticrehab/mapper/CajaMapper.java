package com.kineticrehab.mapper;

import com.kineticrehab.dto.response.CajaResponseDTO;
import com.kineticrehab.model.Caja;
import org.springframework.stereotype.Component;

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
        CajaResponseDTO dto = toDTO(caja);
        return CajaResponseDTO.builder()
                .id(dto.getId())
                .idUsuario(dto.getIdUsuario())
                .nombreUsuario(dto.getNombreUsuario())
                .fechaApertura(dto.getFechaApertura())
                .montoInicial(dto.getMontoInicial())
                .fechaCierre(dto.getFechaCierre())
                .montoFinalEfectivo(dto.getMontoFinalEfectivo())
                .montoFinalYapePlin(dto.getMontoFinalYapePlin())
                .totalVentas(dto.getTotalVentas())
                .observaciones(dto.getObservaciones())
                .estado(dto.getEstado())
                .cantidadVentas(cantidadVentas)
                .build();
    }
}
