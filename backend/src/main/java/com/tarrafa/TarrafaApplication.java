package com.tarrafa;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class TarrafaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TarrafaApplication.class, args);
    }

    // o dia do restaurante segue o horario de Brasilia, mesmo se o servidor estiver em outro fuso
    @PostConstruct
    public void definirFusoHorario() {
        TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
    }
}