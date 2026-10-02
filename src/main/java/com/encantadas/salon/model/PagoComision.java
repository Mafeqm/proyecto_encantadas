package com.encantadas.salon.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "pagos_comisiones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoComision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pago")
    private Long idPago;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cita", nullable = false, unique = true)
    private Cita cita;

    @Column(name = "valor_final_cobrado", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFinalCobrado;

    @Column(name = "es_promocion", nullable = false)
    private Boolean esPromocion = false;

    // Columnas calculadas/generadas mapeadas como de solo lectura
    @Column(name = "porcentaje_comision", insertable = false, updatable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeComision;

    @Column(name = "ganancia_estilista", insertable = false, updatable = false, precision = 10, scale = 2)
    private BigDecimal gananciaEstilista;

    @Column(name = "ganancia_salon", insertable = false, updatable = false, precision = 10, scale = 2)
    private BigDecimal gananciaSalon;

    @Column(name = "fecha_pago", nullable = false, updatable = false)
    private OffsetDateTime fechaPago;

    @PrePersist
    public void prePersist() {
        if (fechaPago == null) {
            fechaPago = OffsetDateTime.now();
        }
        if (esPromocion == null) {
            esPromocion = false;
        }
    }
}
