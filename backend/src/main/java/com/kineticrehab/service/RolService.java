package com.kineticrehab.service;

import com.kineticrehab.model.Rol;

import java.util.List;

public interface RolService {

    List<Rol> listarTodos();

    Rol buscarPorId(Long id);

    Rol buscarPorNombre(String nombre);
}
