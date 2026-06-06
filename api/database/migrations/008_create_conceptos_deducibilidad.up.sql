CREATE TABLE conceptos_deducibilidad (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  deducible BOOLEAN NOT NULL DEFAULT TRUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX ux_conceptos_deducibilidad_nombre ON conceptos_deducibilidad (nombre);
