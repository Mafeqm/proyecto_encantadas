package com.encantadas.salon.repository;

import com.encantadas.salon.model.BloqueoHorario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public interface BloqueoHorarioRepository extends JpaRepository<BloqueoHorario, Long> {

    @Query("""
                SELECT COUNT(b) > 0 FROM BloqueoHorario b
                WHERE b.estilista.idEstilista = :idEstilista
                  AND (b.fechaHoraInicio < :fechaHoraFin AND b.fechaHoraFin > :fechaHoraInicio)
            """)
    boolean existeBloqueoHorario(
            @Param("idEstilista") Long idEstilista,
            @Param("fechaHoraInicio") OffsetDateTime fechaHoraInicio,
            @Param("fechaHoraFin") OffsetDateTime fechaHoraFin);
}
