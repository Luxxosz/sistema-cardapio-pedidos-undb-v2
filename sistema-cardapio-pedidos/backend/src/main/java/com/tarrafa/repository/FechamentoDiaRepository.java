package com.tarrafa.repository;

import com.tarrafa.entity.FechamentoDia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface FechamentoDiaRepository extends JpaRepository<FechamentoDia, Long> {

    boolean existsByData(LocalDate data);

    Optional<FechamentoDia> findByData(LocalDate data);
}