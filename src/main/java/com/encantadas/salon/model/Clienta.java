package com.encantadas.salon.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "clientas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clienta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_clienta")
    private Long idClienta;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "numero_whatsapp", nullable = false, unique = true, length = 20)
    private String numeroWhatsapp;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private OffsetDateTime fechaRegistro;

    @PrePersist
    public void prePersist() {
        if (fechaRegistro == null) {
            fechaRegistro = OffsetDateTime.now();
        }
    }
}
