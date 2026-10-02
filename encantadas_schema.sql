-- =============================================================================
-- SISTEMA DE RESERVAS Y COMISIONES - SALÓN DE BELLEZA "ENCANTADAS"
-- Motor de Base de Datos: PostgreSQL 12+
-- Arquitecto de Base de Datos: Antigravity AI
-- Descripción: Script DDL/DML completo con catálogo estructurado de servicios,
--              integridad referencial, restricciones de negocio, columnas
--              generadas y disparadores de disponibilidad.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. LIMPIEZA DE ESQUEMA (SI EXISTE)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS pagos_comisiones CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS bloqueos_horario CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS estilistas CASCADE;
DROP TABLE IF EXISTS clientas CASCADE;
DROP TYPE IF EXISTS estado_cita_enum CASCADE;
DROP TYPE IF EXISTS categoria_servicio_enum CASCADE;
DROP TYPE IF EXISTS tipo_aplicacion_enum CASCADE;

-- -----------------------------------------------------------------------------
-- 1. TIPOS DE DATOS PERSONALIZADOS (ENUMS)
-- -----------------------------------------------------------------------------
CREATE TYPE estado_cita_enum AS ENUM (
    'Pendiente',
    'Confirmada',
    'Completada',
    'Cancelada_por_retraso'
);

COMMENT ON TYPE estado_cita_enum IS 
'Estados del ciclo de vida de una cita:
 - Pendiente: Cita agendada por la clienta sin confirmación aún.
 - Confirmada: Cita validada por la clienta/salón.
 - Completada: Servicio prestado con éxito.
 - Cancelada_por_retraso: Aplicado cuando la clienta excede la tolerancia máxima de 15 a 20 minutos de retraso.';

CREATE TYPE categoria_servicio_enum AS ENUM (
    'Uñas',
    'Cejas y Rostro',
    'Pestañas'
);

CREATE TYPE tipo_aplicacion_enum AS ENUM (
    'Inicial',
    'Retoque',
    'Único'
);

-- -----------------------------------------------------------------------------
-- 2. TABLA: CLIENTAS (Reserva Sin Fricción)
-- -----------------------------------------------------------------------------
CREATE TABLE clientas (
    id_clienta BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_whatsapp VARCHAR(20) NOT NULL UNIQUE,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE clientas IS 'Registro de clientas para reservar sin fricción.';

-- -----------------------------------------------------------------------------
-- 3. TABLA: ESTILISTAS
-- -----------------------------------------------------------------------------
CREATE TABLE estilistas (
    id_estilista BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE estilistas IS 'Personal técnico del salón encargado de realizar los servicios.';

-- -----------------------------------------------------------------------------
-- 4. TABLA: BLOQUEOS DE HORARIO / AUSENCIAS
-- -----------------------------------------------------------------------------
CREATE TABLE bloqueos_horario (
    id_bloqueo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_estilista BIGINT NOT NULL,
    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
    fecha_hora_fin TIMESTAMPTZ NOT NULL,
    motivo VARCHAR(255) DEFAULT 'Ausencia / Modificación de Horario',
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bloqueos_estilista FOREIGN KEY (id_estilista)
        REFERENCES estilistas (id_estilista) ON DELETE CASCADE,
    CONSTRAINT chk_bloqueo_fechas_validas CHECK (fecha_hora_fin > fecha_hora_inicio)
);

COMMENT ON TABLE bloqueos_horario IS 'Ausencias y bloqueos de franjas horarias por estilista.';

-- -----------------------------------------------------------------------------
-- 5. TABLA: SERVICIOS (Catálogo Estructurado)
-- -----------------------------------------------------------------------------
CREATE TABLE servicios (
    id_servicio BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    categoria categoria_servicio_enum NOT NULL,
    nombre_servicio VARCHAR(120) NOT NULL,
    tipo_aplicacion tipo_aplicacion_enum NOT NULL DEFAULT 'Único',
    precio_base NUMERIC(10, 2) NOT NULL,
    duracion_minutos INT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT unq_servicio_nombre_tipo UNIQUE (nombre_servicio, tipo_aplicacion),
    CONSTRAINT chk_servicio_precio_positivo CHECK (precio_base >= 0),
    CONSTRAINT chk_servicio_duracion_positiva CHECK (duracion_minutos > 0)
);

COMMENT ON TABLE servicios IS 'Catálogo de servicios de Encantadas con categoría, tipo de aplicación, precio y duración.';

-- -----------------------------------------------------------------------------
-- 6. TABLA: CITAS / RESERVAS
-- -----------------------------------------------------------------------------
CREATE TABLE citas (
    id_cita BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_clienta BIGINT NOT NULL,
    id_estilista BIGINT NOT NULL,
    id_servicio BIGINT NOT NULL,
    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
    fecha_hora_fin TIMESTAMPTZ NOT NULL,
    estado estado_cita_enum NOT NULL DEFAULT 'Pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Relaciones
    CONSTRAINT fk_citas_clienta FOREIGN KEY (id_clienta)
        REFERENCES clientas (id_clienta) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_estilista FOREIGN KEY (id_estilista)
        REFERENCES estilistas (id_estilista) ON DELETE RESTRICT,
    CONSTRAINT fk_citas_servicio FOREIGN KEY (id_servicio)
        REFERENCES servicios (id_servicio) ON DELETE RESTRICT,

    -- Validaciones de Horario Fijo Comercial (09:00 a 19:00, última cita inicia 18:30)
    CONSTRAINT chk_cita_rango_fechas CHECK (fecha_hora_fin > fecha_hora_inicio),
    CONSTRAINT chk_cita_hora_inicio_comercial CHECK (
        CAST(fecha_hora_inicio AS TIME) >= TIME '09:00:00' AND
        CAST(fecha_hora_inicio AS TIME) <= TIME '18:30:00'
    ),
    CONSTRAINT chk_cita_hora_fin_comercial CHECK (
        CAST(fecha_hora_fin AS TIME) <= TIME '19:00:00'
    )
);

COMMENT ON TABLE citas IS 'Tabla de reservas agendadas relacionando clienta, estilista y servicio.';

-- -----------------------------------------------------------------------------
-- 7. TABLA: PAGOS Y COMISIONES (Cálculo Automático Generado)
-- -----------------------------------------------------------------------------
CREATE TABLE pagos_comisiones (
    id_pago BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cita BIGINT NOT NULL UNIQUE,
    valor_final_cobrado NUMERIC(10, 2) NOT NULL,
    es_promocion BOOLEAN NOT NULL DEFAULT FALSE,

    -- COLUMNAS GENERADAS AUTOMÁTICAS:
    -- Normal (es_promocion = FALSE) -> Estilista gana 45% (0.45)
    -- Promoción (es_promocion = TRUE)  -> Estilista gana 50% (0.50)
    porcentaje_comision NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN es_promocion THEN 50.00 ELSE 45.00 END
    ) STORED,

    ganancia_estilista NUMERIC(10, 2) GENERATED ALWAYS AS (
        ROUND(valor_final_cobrado * (CASE WHEN es_promocion THEN 0.50 ELSE 0.45 END), 2)
    ) STORED,

    ganancia_salon NUMERIC(10, 2) GENERATED ALWAYS AS (
        valor_final_cobrado - ROUND(valor_final_cobrado * (CASE WHEN es_promocion THEN 0.50 ELSE 0.45 END), 2)
    ) STORED,

    fecha_pago TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pagos_cita FOREIGN KEY (id_cita)
        REFERENCES citas (id_cita) ON DELETE CASCADE,
    CONSTRAINT chk_pago_valor_positivo CHECK (valor_final_cobrado >= 0)
);

COMMENT ON TABLE pagos_comisiones IS 'Registro financiero y liquidación de comisiones para estilistas.';

-- -----------------------------------------------------------------------------
-- 8. LÓGICA DE NEGOCIO Y TRIGGERS (DISPARADORES)
-- -----------------------------------------------------------------------------

-- Trigger para calcular automáticamente la hora_fin de la cita según duracion_minutos del servicio
CREATE OR REPLACE FUNCTION fn_calcular_hora_fin_cita()
RETURNS TRIGGER AS $$
DECLARE
    v_duracion INT;
BEGIN
    SELECT duracion_minutos INTO v_duracion
    FROM servicios
    WHERE id_servicio = NEW.id_servicio;

    IF v_duracion IS NULL THEN
        RAISE EXCEPTION 'El servicio especificado (%) no existe.', NEW.id_servicio;
    END IF;

    NEW.fecha_hora_fin := NEW.fecha_hora_inicio + (v_duracion || ' minutes')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calcular_hora_fin_cita
BEFORE INSERT OR UPDATE OF id_servicio, fecha_hora_inicio ON citas
FOR EACH ROW
EXECUTE FUNCTION fn_calcular_hora_fin_cita();


-- Trigger para evitar cruces de citas y bloqueos de la estilista
CREATE OR REPLACE FUNCTION fn_validar_disponibilidad_estilista()
RETURNS TRIGGER AS $$
DECLARE
    v_bloqueado INT;
    v_cruce_cita INT;
BEGIN
    IF NEW.estado = 'Cancelada_por_retraso' THEN
        RETURN NEW;
    END IF;

    -- 1. Verificar ausencias / bloqueos
    SELECT COUNT(*) INTO v_bloqueado
    FROM bloqueos_horario
    WHERE id_estilista = NEW.id_estilista
      AND (NEW.fecha_hora_inicio, NEW.fecha_hora_fin) OVERLAPS (fecha_hora_inicio, fecha_hora_fin);

    IF v_bloqueado > 0 THEN
        RAISE EXCEPTION 'La estilista no está disponible en esa franja debido a un bloqueo o ausencia programada.';
    END IF;

    -- 2. Verificar cruces con otras citas activas
    SELECT COUNT(*) INTO v_cruce_cita
    FROM citas
    WHERE id_estilista = NEW.id_estilista
      AND id_cita <> COALESCE(NEW.id_cita, -1)
      AND estado IN ('Pendiente', 'Confirmada', 'Completada')
      AND (NEW.fecha_hora_inicio, NEW.fecha_hora_fin) OVERLAPS (fecha_hora_inicio, fecha_hora_fin);

    IF v_cruce_cita > 0 THEN
        RAISE EXCEPTION 'La estilista ya tiene otra cita agendada que se cruza con esta franja horaria.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_disponibilidad_estilista
BEFORE INSERT OR UPDATE OF id_estilista, fecha_hora_inicio, fecha_hora_fin, estado ON citas
FOR EACH ROW
EXECUTE FUNCTION fn_validar_disponibilidad_estilista();

-- -----------------------------------------------------------------------------
-- 9. ÍNDICES DE RENDIMIENTO
-- -----------------------------------------------------------------------------
CREATE INDEX idx_citas_estilista_fecha ON citas(id_estilista, fecha_hora_inicio, fecha_hora_fin);
CREATE INDEX idx_citas_clienta ON citas(id_clienta);
CREATE INDEX idx_citas_estado ON citas(estado);
CREATE INDEX idx_servicios_categoria ON servicios(categoria);
CREATE INDEX idx_bloqueos_estilista_fecha ON bloqueos_horario(id_estilista, fecha_hora_inicio, fecha_hora_fin);

-- -----------------------------------------------------------------------------
-- 10. POBLADO DE DATOS (DML) - CATÁLOGO DE SERVICIOS SALÓN ENCANTADAS
-- -----------------------------------------------------------------------------
INSERT INTO servicios (categoria, nombre_servicio, tipo_aplicacion, precio_base, duracion_minutos) VALUES
    -- UÑAS TRADICIONALES Y SEMIPERMANENTES
    ('Uñas', 'Tradicional - Manos', 'Único', 20000.00, 90),
    ('Uñas', 'Tradicional - Pies', 'Único', 25000.00, 90),
    ('Uñas', 'Tradicional Hombre - Manos', 'Único', 15000.00, 90),
    ('Uñas', 'Tradicional Hombre - Pies', 'Único', 20000.00, 90),
    ('Uñas', 'Semipermanentes - Manos', 'Único', 45000.00, 90),
    ('Uñas', 'Semipermanentes - Pies', 'Único', 50000.00, 90),
    ('Uñas', 'Semipermanentes Hombre - Manos', 'Único', 20000.00, 90),
    ('Uñas', 'Semipermanentes Hombre - Pies', 'Único', 25000.00, 90),
    ('Uñas', 'Pedí Spa - Semipermanente', 'Único', 60000.00, 90),
    ('Uñas', 'Pedí Spa - Tradicional', 'Único', 40000.00, 90),
    ('Uñas', 'Press On', 'Inicial', 85000.00, 90),
    ('Uñas', 'Retiro Encantadas', 'Único', 10000.00, 30),
    ('Uñas', 'Retiro de otro lugar', 'Único', 20000.00, 30),

    -- EXTENSIONES Y SISTEMA DE UÑAS ACRÍLICAS
    ('Uñas', 'Acrílico Talla 1-2', 'Inicial', 90000.00, 120),
    ('Uñas', 'Acrílico Talla 1-2', 'Retoque', 85000.00, 90),
    ('Uñas', 'Acrílico Talla 3-4', 'Inicial', 105000.00, 120),
    ('Uñas', 'Acrílico Talla 3-4', 'Retoque', 95000.00, 90),
    ('Uñas', 'Acrílico Talla 5-6', 'Inicial', 115000.00, 120),
    ('Uñas', 'Acrílico Talla 5-6', 'Retoque', 100000.00, 90),

    -- ACRÍLICO ESCULPIDO
    ('Uñas', 'Acrílico Esculpido Talla 1', 'Inicial', 110000.00, 120),
    ('Uñas', 'Acrílico Esculpido Talla 1', 'Retoque', 105000.00, 90),
    ('Uñas', 'Acrílico Esculpido Talla 2', 'Inicial', 120000.00, 120),
    ('Uñas', 'Acrílico Esculpido Talla 2', 'Retoque', 105000.00, 90),
    ('Uñas', 'Acrílico Esculpido Talla 3', 'Inicial', 130000.00, 120),
    ('Uñas', 'Acrílico Esculpido Talla 3', 'Retoque', 115000.00, 90),
    ('Uñas', 'Acrílico Esculpido Talla 4', 'Inicial', 140000.00, 120),
    ('Uñas', 'Acrílico Esculpido Talla 4', 'Retoque', 115000.00, 90),

    -- TECH GEL Y RECUBRIMIENTOS
    ('Uñas', 'Tech Gel #1-2', 'Inicial', 95000.00, 120),
    ('Uñas', 'Tech Gel #1-2', 'Retoque', 85000.00, 90),
    ('Uñas', 'Tech Gel #3-4', 'Inicial', 100000.00, 120),
    ('Uñas', 'Tech Gel #3-4', 'Retoque', 90000.00, 90),
    ('Uñas', 'Tech Gel #5-6', 'Inicial', 120000.00, 120),
    ('Uñas', 'Tech Gel #5-6', 'Retoque', 105000.00, 90),
    ('Uñas', 'Recubrimiento en Uña Natural - Acrílico', 'Único', 85000.00, 90),
    ('Uñas', 'Recubrimiento en Uña Natural - Tech Gel', 'Único', 90000.00, 90),

    -- CEJAS Y ROSTRO
    ('Cejas y Rostro', 'Depilación en cuchilla', 'Único', 5000.00, 30),
    ('Cejas y Rostro', 'Depilación cuchilla + pigmentación', 'Único', 20000.00, 45),
    ('Cejas y Rostro', 'Depilación cuchilla + diseño + pigmentación', 'Único', 25000.00, 45),
    ('Cejas y Rostro', 'Depilación en cera', 'Único', 10000.00, 30),
    ('Cejas y Rostro', 'Depilación cera + pigmentación', 'Único', 20000.00, 45),
    ('Cejas y Rostro', 'Diseño de ceja + depilación en cera y pigmentación', 'Único', 30000.00, 45),
    ('Cejas y Rostro', 'Laminado de cejas + diseño y pigmento', 'Único', 80000.00, 60),
    ('Cejas y Rostro', 'Micropigmentación de Cejas', 'Inicial', 250000.00, 120),
    ('Cejas y Rostro', 'Micropigmentación de Cejas', 'Retoque', 170000.00, 90),
    ('Cejas y Rostro', 'Micropigmentación de Labios', 'Inicial', 250000.00, 120),
    ('Cejas y Rostro', 'Micropigmentación de Labios', 'Retoque', 170000.00, 90),

    -- PESTAÑAS
    ('Pestañas', 'Efecto pestañina', 'Único', 90000.00, 90),
    ('Pestañas', 'Efecto aura', 'Único', 125000.00, 90),
    ('Pestañas', 'Volumen "w" 3D', 'Único', 110000.00, 90),
    ('Pestañas', 'Volumen griego', 'Único', 115000.00, 90),
    ('Pestañas', 'Volumen egipcio', 'Único', 125000.00, 90),
    ('Pestañas', 'Volumen árabe', 'Único', 130000.00, 90),
    ('Pestañas', 'Wisppy tecnológico', 'Único', 125000.00, 90),
    ('Pestañas', 'Wisppy vol. ruso', 'Único', 130000.00, 90),
    ('Pestañas', 'Volumen ruso', 'Único', 130000.00, 90),
    ('Pestañas', 'Mega-Volumen', 'Único', 145000.00, 90)

ON CONFLICT (nombre_servicio, tipo_aplicacion) DO UPDATE SET
    categoria = EXCLUDED.categoria,
    precio_base = EXCLUDED.precio_base,
    duracion_minutos = EXCLUDED.duracion_minutos,
    activo = TRUE;

-- =============================================================================
-- FIN DEL SCRIPT SQL DDL / DML - SALÓN ENCANTADAS
-- =============================================================================