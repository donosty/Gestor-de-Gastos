CREATE TABLE sesiones (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  CONSTRAINT fk_sesiones_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE UNIQUE INDEX ux_sesiones_token_hash ON sesiones (token_hash);
CREATE INDEX ix_sesiones_usuario_id ON sesiones (usuario_id);
CREATE INDEX ix_sesiones_expires_at ON sesiones (expires_at);
