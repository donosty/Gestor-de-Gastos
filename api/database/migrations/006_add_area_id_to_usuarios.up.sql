ALTER TABLE usuarios ADD COLUMN area_id BIGINT NULL;

ALTER TABLE usuarios ADD CONSTRAINT fk_usuarios_areas
  FOREIGN KEY (area_id) REFERENCES areas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE INDEX ix_usuarios_area_id ON usuarios (area_id);
