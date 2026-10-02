package com.encantadas.salon.repository;

import com.encantadas.salon.model.PagoComision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoComisionRepository extends JpaRepository<PagoComision, Long> {
    Optional<PagoComision> findByCitaIdCita(Long idCita);
}
