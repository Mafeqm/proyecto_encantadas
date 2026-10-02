package com.encantadas.salon.repository;

import com.encantadas.salon.model.Clienta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientaRepository extends JpaRepository<Clienta, Long> {
    Optional<Clienta> findByNumeroWhatsapp(String numeroWhatsapp);
}
