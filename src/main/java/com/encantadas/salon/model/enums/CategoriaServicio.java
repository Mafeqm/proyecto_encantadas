package com.encantadas.salon.model.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaServicio {
    UNAS("Uñas"),
    CEJAS_Y_ROSTRO("Cejas y Rostro"),
    PESTANAS("Pestañas");

    private final String descripcion;

    CategoriaServicio(String descripcion) {
        this.descripcion = descripcion;
    }

    @JsonValue
    public String getDescripcion() {
        return descripcion;
    }
}
