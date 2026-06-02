INSERT INTO roles (nombre, descripcion, activo)
VALUES
  ('ADMIN', 'Administrador del sistema', TRUE),
  ('CAPTURISTA', 'Usuario capturista', TRUE),
  ('JEFE_AREA', 'Jefe de area', TRUE),
  ('CUENTAS_POR_PAGAR', 'Cuentas por pagar', TRUE)
ON CONFLICT (nombre) DO NOTHING;
