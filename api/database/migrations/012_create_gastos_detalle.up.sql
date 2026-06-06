CREATE TABLE gastos_detalle (
  id BIGSERIAL PRIMARY KEY,
  gasto_id BIGINT NOT NULL,
  categoria_id BIGINT NOT NULL,
  concepto_deducibilidad_id BIGINT NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  cantidad DECIMAL(12,2) NOT NULL DEFAULT 1,
  precio_unitario DECIMAL(14,2) NOT NULL,
  subtotal DECIMAL(14,2) NOT NULL,
  iva DECIMAL(14,2) NOT NULL DEFAULT 0,
  total DECIMAL(14,2) NOT NULL,
  CONSTRAINT fk_gastos_detalle_gasto FOREIGN KEY (gasto_id) REFERENCES gastos(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_detalle_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_detalle_concepto FOREIGN KEY (concepto_deducibilidad_id) REFERENCES conceptos_deducibilidad(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX ix_gastos_detalle_gasto_id ON gastos_detalle (gasto_id);
