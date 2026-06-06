CREATE TABLE gastos (
  id BIGSERIAL PRIMARY KEY,
  folio VARCHAR(50) NOT NULL,
  usuario_id BIGINT NOT NULL,
  area_id BIGINT NOT NULL,
  centro_costo_id BIGINT NOT NULL,
  estatus_id BIGINT NOT NULL,
  fecha_gasto DATE NOT NULL,
  concepto_general VARCHAR(255) NOT NULL,
  justificacion TEXT,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  iva DECIMAL(14,2) NOT NULL DEFAULT 0,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  fecha_envio_aprobacion TIMESTAMPTZ,
  fecha_aprobacion TIMESTAMPTZ,
  observaciones_rechazo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT ux_gastos_folio UNIQUE (folio),
  CONSTRAINT fk_gastos_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_areas FOREIGN KEY (area_id) REFERENCES areas(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_centros_costo FOREIGN KEY (centro_costo_id) REFERENCES centros_costo(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_estatus FOREIGN KEY (estatus_id) REFERENCES estatus_gastos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX ix_gastos_usuario_id ON gastos (usuario_id);
CREATE INDEX ix_gastos_area_id ON gastos (area_id);
CREATE INDEX ix_gastos_estatus_id ON gastos (estatus_id);
CREATE INDEX ix_gastos_fecha_gasto ON gastos (fecha_gasto);
CREATE INDEX ix_gastos_area_estatus ON gastos (area_id, estatus_id);
