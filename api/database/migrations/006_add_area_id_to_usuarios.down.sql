DROP INDEX IF EXISTS ix_usuarios_area_id;

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS fk_usuarios_areas;

ALTER TABLE usuarios DROP COLUMN IF EXISTS area_id;
