CREATE TABLE estatus_gastos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255),
  CONSTRAINT ux_estatus_gastos_nombre UNIQUE (nombre)
);

INSERT INTO estatus_gastos (nombre, descripcion) VALUES
  ('BORRADOR',              'Gasto en edición, no enviado a aprobación'),
  ('PENDIENTE_APROBACION',  'Gasto enviado, en espera de revisión del jefe de área'),
  ('APROBADO',              'Gasto autorizado por el jefe de área'),
  ('RECHAZADO',             'Gasto rechazado, requiere corrección y reenvío');
