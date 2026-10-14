package com.tarrafa.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Administrador extends Usuario {

    public Administrador() {
    }

    @Override
    public String getPapel() {
        return "ADMIN";
    }
}
