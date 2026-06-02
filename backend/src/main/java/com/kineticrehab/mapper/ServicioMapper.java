package com.kineticrehab.mapper;

import com.kineticrehab.dto.response.ServicioResponseDTO;
import com.kineticrehab.model.Servicio;
import org.springframework.stereotype.Component;

@Component
public class ServicioMapper {

    public ServicioResponseDTO toDTO(Servicio servicio) {
        return ServicioResponseDTO.builder()
                .id(servicio.getId())
                .nombre(servicio.getNombre())
                .descripcion(servicio.getDescripcion())
                .precio(servicio.getPrecio())
                .activo(servicio.getActivo())
                .build();
    }
}
