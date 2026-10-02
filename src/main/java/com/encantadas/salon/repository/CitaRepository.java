package com.encantadas.salon.repository;

import com.encantadas.salon.model.Cita;
import com.encantadas.salon.model.enums.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {

    @Query("""
                SELECT COUNT(c) > 0 FROM Cita c
                WHERE c.estilista.idEstilista = :idEstilista
                  AND c.estado IN (:estadosActivos)
                  AND (:idCitaExcluir IS NULL OR c.idCita <> :idCitaExcluir)
                  AND (c.fechaHoraInicio < :fechaHoraFin AND c.fechaHoraFin > :fechaHoraInicio)
            """)
    boolean existeCruceCita(
            @Param("idEstilista") Long idEstilista,
            @Param("fechaHoraInicio") OffsetDateTime fechaHoraInicio,
            @Param("fechaHoraFin") OffsetDateTime fechaHoraFin,
            @Param("estadosActivos") List<EstadoCita> estadosActivos,
            @Param("idCitaExcluir") Long idCitaExcluir);

    List<Cita> findByEstilistaIdEstilistaAndFechaHoraInicioBetween(
            Long idEstilista, OffsetDateTime inicio, OffsetDateTime fin);
}
