package com.kineticrehab.service;

import com.kineticrehab.dto.response.DashboardAdminDTO;
import com.kineticrehab.dto.response.DashboardDoctorDTO;
import com.kineticrehab.dto.response.DashboardRecepcionDTO;

public interface DashboardService {
    DashboardAdminDTO obtenerDashboardAdmin();
    DashboardDoctorDTO obtenerDashboardDoctor();
    DashboardRecepcionDTO obtenerDashboardRecepcion();
}
