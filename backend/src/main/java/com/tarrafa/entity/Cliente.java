package com.tarrafa.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CLIENTE")
public class Cliente extends Usuario {

    public Cliente() {
    }

    @Override
    public String getPapel() {
        return "CLIENTE";
    }
}
