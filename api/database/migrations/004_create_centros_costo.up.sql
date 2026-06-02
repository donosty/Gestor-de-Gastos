CREATE TABLE centros_costo (
  id BIGSERIAL PRIMARY KEY,
  area_id BIGINT NOT NULL,
  clave VARCHAR(50) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL,
  CONSTRAINT fk_centros_costo_areas FOREIGN KEY (area_id) REFERENCES areas(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX ix_centros_costo_area_id ON centros_costo (area_id);
