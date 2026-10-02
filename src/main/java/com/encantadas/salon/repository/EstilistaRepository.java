package com.encantadas.salon.repository;

import com.encantadas.salon.model.Estilista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstilistaRepository extends JpaRepository<Estilista, Long> {
    List<Estilista> findByActivoTrue();
}
