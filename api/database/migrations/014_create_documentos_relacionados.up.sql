CREATE TABLE documentos_relacionados (
  id BIGSERIAL PRIMARY KEY,
  gasto_id BIGINT NOT NULL,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  tipo_mime VARCHAR(100),
  tamanio_bytes INTEGER,
  observaciones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_documentos_relacionados_gasto FOREIGN KEY (gasto_id) REFERENCES gastos(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX ix_documentos_relacionados_gasto_id ON documentos_relacionados (gasto_id);
