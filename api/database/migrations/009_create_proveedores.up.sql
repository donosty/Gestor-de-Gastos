CREATE TABLE proveedores (
  id BIGSERIAL PRIMARY KEY,
  rfc VARCHAR(20) NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  correo VARCHAR(150),
  telefono VARCHAR(50),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX ux_proveedores_rfc ON proveedores (rfc);
