package com.kineticrehab.mapper;

import com.kineticrehab.dto.request.EvaluacionRequestDTO;
import com.kineticrehab.dto.response.EvaluacionResponseDTO;
import com.kineticrehab.model.Doctor;
import com.kineticrehab.model.Evaluacion;
import com.kineticrehab.model.HistoriaClinica;
import org.springframework.stereotype.Component;

@Component
public class EvaluacionMapper {

    public EvaluacionResponseDTO toDTO(Evaluacion eval) {
        return EvaluacionResponseDTO.builder()
                .id(eval.getId())
                .idHistoriaClinica(eval.getHistoriaClinica().getId())
                .idDoctor(eval.getDoctor().getId())
                .nombreDoctor(eval.getDoctor().getNombres() + " " + eval.getDoctor().getApellidos())
                .fecha(eval.getFecha())
                .tipo(eval.getTipo())
                .padecimientoActual(eval.getPadecimientoActual())
                .valoracionSubjetiva(eval.getValoracionSubjetiva())
                .evaPuntuacion(eval.getEvaPuntuacion())
                .borgPuntuacion(eval.getBorgPuntuacion())
                .danielsPuntuacion(eval.getDanielsPuntuacion())
                .dolorIntensidad(eval.getDolorIntensidad())
                .dolorFrecuencia(eval.getDolorFrecuencia())
                .dolorOtro(eval.getDolorOtro())
                .signos(eval.getSignos())
                .evaluacionMovilidad(eval.getEvaluacionMovilidad())
                .evaluacionMuscular(eval.getEvaluacionMuscular())
                .evaluacionFuncional(eval.getEvaluacionFuncional())
                .sensibilidadPalpacion(eval.getSensibilidadPalpacion())
                .diagnosticoClinico(eval.getDiagnosticoClinico())
                .objetivosTratamiento(eval.getObjetivosTratamiento())
                .planCamilla(eval.getPlanCamilla())
                .planGym(eval.getPlanGym())
                .frecuenciaTratamiento(eval.getFrecuenciaTratamiento())
                .cie10(eval.getCie10())
                .motivoControl(eval.getMotivoControl())
                .padecimientoActualHistorial(eval.getPadecimientoActualHistorial())
                .valoracionProgreso(eval.getValoracionProgreso())
                .evaluacionMovilidadActualizada(eval.getEvaluacionMovilidadActualizada())
                .objetivosModificados(eval.getObjetivosModificados())
                .planCamillaActualizado(eval.getPlanCamillaActualizado())
                .planGymActualizado(eval.getPlanGymActualizado())
                .frecuenciaActualizada(eval.getFrecuenciaActualizada())
                .createdAt(eval.getCreatedAt())
                .updatedAt(eval.getUpdatedAt())
                .build();
    }

    public Evaluacion toEntity(EvaluacionRequestDTO dto, HistoriaClinica hc, Doctor doctor) {
        return Evaluacion.builder()
                .historiaClinica(hc)
                .doctor(doctor)
                .fecha(dto.getFecha())
                .tipo(dto.getTipo())
                .padecimientoActual(dto.getPadecimientoActual())
                .valoracionSubjetiva(dto.getValoracionSubjetiva())
                .evaPuntuacion(dto.getEvaPuntuacion())
                .borgPuntuacion(dto.getBorgPuntuacion())
                .danielsPuntuacion(dto.getDanielsPuntuacion())
                .dolorIntensidad(dto.getDolorIntensidad())
                .dolorFrecuencia(dto.getDolorFrecuencia())
                .dolorOtro(dto.getDolorOtro())
                .signos(dto.getSignos())
                .evaluacionMovilidad(dto.getEvaluacionMovilidad())
                .evaluacionMuscular(dto.getEvaluacionMuscular())
                .evaluacionFuncional(dto.getEvaluacionFuncional())
                .sensibilidadPalpacion(dto.getSensibilidadPalpacion())
                .diagnosticoClinico(dto.getDiagnosticoClinico())
                .objetivosTratamiento(dto.getObjetivosTratamiento())
                .planCamilla(dto.getPlanCamilla())
                .planGym(dto.getPlanGym())
                .frecuenciaTratamiento(dto.getFrecuenciaTratamiento())
                .cie10(dto.getCie10())
                .motivoControl(dto.getMotivoControl())
                .padecimientoActualHistorial(dto.getPadecimientoActualHistorial())
                .valoracionProgreso(dto.getValoracionProgreso())
                .evaluacionMovilidadActualizada(dto.getEvaluacionMovilidadActualizada())
                .objetivosModificados(dto.getObjetivosModificados())
                .planCamillaActualizado(dto.getPlanCamillaActualizado())
                .planGymActualizado(dto.getPlanGymActualizado())
                .frecuenciaActualizada(dto.getFrecuenciaActualizada())
                .build();
    }

    public void updateEntity(Evaluacion eval, EvaluacionRequestDTO dto) {
        eval.setFecha(dto.getFecha());
        eval.setTipo(dto.getTipo());
        eval.setPadecimientoActual(dto.getPadecimientoActual());
        eval.setValoracionSubjetiva(dto.getValoracionSubjetiva());
        eval.setEvaPuntuacion(dto.getEvaPuntuacion());
        eval.setBorgPuntuacion(dto.getBorgPuntuacion());
        eval.setDanielsPuntuacion(dto.getDanielsPuntuacion());
        eval.setDolorIntensidad(dto.getDolorIntensidad());
        eval.setDolorFrecuencia(dto.getDolorFrecuencia());
        eval.setDolorOtro(dto.getDolorOtro());
        eval.setSignos(dto.getSignos());
        eval.setEvaluacionMovilidad(dto.getEvaluacionMovilidad());
        eval.setEvaluacionMuscular(dto.getEvaluacionMuscular());
        eval.setEvaluacionFuncional(dto.getEvaluacionFuncional());
        eval.setSensibilidadPalpacion(dto.getSensibilidadPalpacion());
        eval.setDiagnosticoClinico(dto.getDiagnosticoClinico());
        eval.setObjetivosTratamiento(dto.getObjetivosTratamiento());
        eval.setPlanCamilla(dto.getPlanCamilla());
        eval.setPlanGym(dto.getPlanGym());
        eval.setFrecuenciaTratamiento(dto.getFrecuenciaTratamiento());
        eval.setCie10(dto.getCie10());
        eval.setMotivoControl(dto.getMotivoControl());
        eval.setPadecimientoActualHistorial(dto.getPadecimientoActualHistorial());
        eval.setValoracionProgreso(dto.getValoracionProgreso());
        eval.setEvaluacionMovilidadActualizada(dto.getEvaluacionMovilidadActualizada());
        eval.setObjetivosModificados(dto.getObjetivosModificados());
        eval.setPlanCamillaActualizado(dto.getPlanCamillaActualizado());
        eval.setPlanGymActualizado(dto.getPlanGymActualizado());
        eval.setFrecuenciaActualizada(dto.getFrecuenciaActualizada());
    }
}
