package com.kineticrehab.exception;

public class DuplicateEntityException extends RuntimeException {

    public DuplicateEntityException(String mensaje) {
        super(mensaje);
    }
}
