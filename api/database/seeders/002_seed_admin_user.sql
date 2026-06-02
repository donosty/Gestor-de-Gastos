INSERT INTO usuarios (nombre, email, password_hash, rol_id, activo)
SELECT $1, $2, $3, roles.id, TRUE
FROM roles
WHERE roles.nombre = $4
ON CONFLICT (email) DO UPDATE
SET
	nombre = EXCLUDED.nombre,
	password_hash = EXCLUDED.password_hash,
	rol_id = EXCLUDED.rol_id,
	activo = TRUE;
