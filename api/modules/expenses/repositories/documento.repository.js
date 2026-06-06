import { getPool } from '../../../database/connection/index.js';

async function findDocumentoById(id) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM documentos_relacionados WHERE id = $1 AND deleted_at IS NULL',
    [id],
  );
  return result.rows[0] || null;
}

async function listDocumentosByGastoId(gastoId) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, gasto_id, nombre_original, nombre_archivo, tipo_mime, tamanio_bytes,
            observaciones, created_at
       FROM documentos_relacionados
      WHERE gasto_id = $1 AND deleted_at IS NULL
      ORDER BY created_at ASC`,
    [gastoId],
  );
  return result.rows;
}

async function createDocumento({ gastoId, nombreOriginal, nombreArchivo, rutaArchivo, tipoMime, tamanioBytes, observaciones }) {
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO documentos_relacionados
       (gasto_id, nombre_original, nombre_archivo, ruta_archivo, tipo_mime, tamanio_bytes, observaciones)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [gastoId, nombreOriginal, nombreArchivo, rutaArchivo, tipoMime, tamanioBytes, observaciones ?? null],
  );
  return findDocumentoById(result.rows[0].id);
}

async function softDeleteDocumento(id) {
  const pool = getPool();
  const result = await pool.query(
    'UPDATE documentos_relacionados SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
    [id],
  );
  return result.rows[0] || null;
}

export { findDocumentoById, listDocumentosByGastoId, createDocumento, softDeleteDocumento };
