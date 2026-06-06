CREATE TABLE facturas_cfdi (
  id BIGSERIAL PRIMARY KEY,
  gasto_id BIGINT NOT NULL,
  proveedor_id BIGINT,
  uuid VARCHAR(100) NOT NULL,
  serie VARCHAR(30),
  folio VARCHAR(50),
  rfc_emisor VARCHAR(20) NOT NULL,
  rfc_receptor VARCHAR(20) NOT NULL,
  fecha_emision TIMESTAMPTZ NOT NULL,
  metodo_pago VARCHAR(20),
  subtotal DECIMAL(14,2) NOT NULL,
  iva DECIMAL(14,2) NOT NULL DEFAULT 0,
  total DECIMAL(14,2) NOT NULL,
  ruta_xml VARCHAR(500) NOT NULL,
  nombre_archivo_xml VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ux_facturas_cfdi_gasto_id UNIQUE (gasto_id),
  CONSTRAINT ux_facturas_cfdi_uuid UNIQUE (uuid),
  CONSTRAINT fk_facturas_cfdi_gasto FOREIGN KEY (gasto_id) REFERENCES gastos(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_facturas_cfdi_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX ix_facturas_cfdi_proveedor_id ON facturas_cfdi (proveedor_id);
