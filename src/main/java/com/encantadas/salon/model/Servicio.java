package com.encantadas.salon.model;

import com.encantadas.salon.model.enums.CategoriaServicio;
import com.encantadas.salon.model.enums.TipoAplicacion;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios", uniqueConstraints = {
        @UniqueConstraint(name = "unq_servicio_nombre_tipo", columnNames = { "nombre_servicio", "tipo_aplicacion" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servicio")
    private Long idServicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", nullable = false)
    private CategoriaServicio categoria;

    @Column(name = "nombre_servicio", nullable = false, length = 120)
    private String nombreServicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_aplicacion", nullable = false)
    private TipoAplicacion tipoAplicacion;

    @Column(name = "precio_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioBase;

    @Column(name = "duracion_minutos", nullable = false)
    private Integer duracionMinutos;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @PrePersist
    public void prePersist() {
        if (activo == null) {
            activo = true;
        }
    }
}
