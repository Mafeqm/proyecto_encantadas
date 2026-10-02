package com.encantadas.salon.repository;

import com.encantadas.salon.model.Servicio;
import com.encantadas.salon.model.enums.CategoriaServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    List<Servicio> findByActivoTrue();
    List<Servicio> findByCategoriaAndActivoTrue(CategoriaServicio categoria);
}
