import { getPool } from '../../../database/connection/index.js';

const DETAIL_SELECT = `
  SELECT
    d.id,
    d.gasto_id,
    d.categoria_id,
    c.nombre AS categoria,
    d.concepto_deducibilidad_id,
    cd.nombre AS concepto_deducibilidad,
    d.descripcion,
    d.cantidad,
    d.precio_unitario,
    d.subtotal,
    d.iva,
    d.total
  FROM gastos_detalle d
  INNER JOIN categorias c ON c.id = d.categoria_id
  INNER JOIN conceptos_deducibilidad cd ON cd.id = d.concepto_deducibilidad_id
`;

async function listDetalles(gastoId) {
  const pool = getPool();
  const result = await pool.query(
    `${DETAIL_SELECT} WHERE d.gasto_id = $1 ORDER BY d.id ASC`,
    [gastoId]
  );
  return result.rows;
}

async function findDetalleById(id) {
  const pool = getPool();
  const result = await pool.query(`${DETAIL_SELECT} WHERE d.id = $1`, [id]);
  return result.rows[0] || null;
}

async function createDetalle({ gastoId, categoriaId, conceptoDeducibilidadId, descripcion, cantidad, precioUnitario, subtotal, iva, total }) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO gastos_detalle
         (gasto_id, categoria_id, concepto_deducibilidad_id, descripcion, cantidad, precio_unitario, subtotal, iva, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [gastoId, categoriaId, conceptoDeducibilidadId, descripcion, cantidad, precioUnitario, subtotal, iva, total]
    );

    await recalculateHeader(client, gastoId);

    await client.query('COMMIT');

    return findDetalleById(insertResult.rows[0].id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateDetalle(id, gastoId, { categoriaId, conceptoDeducibilidadId, descripcion, cantidad, precioUnitario, subtotal, iva, total }) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE gastos_detalle
       SET categoria_id = $1,
           concepto_deducibilidad_id = $2,
           descripcion = $3,
           cantidad = $4,
           precio_unitario = $5,
           subtotal = $6,
           iva = $7,
           total = $8
       WHERE id = $9
       RETURNING id`,
      [categoriaId, conceptoDeducibilidadId, descripcion, cantidad, precioUnitario, subtotal, iva, total, id]
    );

    if (!result.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    await recalculateHeader(client, gastoId);

    await client.query('COMMIT');

    return findDetalleById(id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteDetalle(id, gastoId) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `DELETE FROM gastos_detalle WHERE id = $1 RETURNING id`,
      [id]
    );

    if (!result.rows[0]) {
      await client.query('ROLLBACK');
      return false;
    }

    await recalculateHeader(client, gastoId);

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function recalculateHeader(client, gastoId) {
  await client.query(
    `UPDATE gastos
     SET subtotal   = (SELECT COALESCE(SUM(subtotal), 0) FROM gastos_detalle WHERE gasto_id = $1),
         iva        = (SELECT COALESCE(SUM(iva),      0) FROM gastos_detalle WHERE gasto_id = $1),
         total      = (SELECT COALESCE(SUM(total),    0) FROM gastos_detalle WHERE gasto_id = $1),
         updated_at = NOW()
     WHERE id = $1`,
    [gastoId]
  );
}

async function findCategoriaById(id) {
  const pool = getPool();
  const result = await pool.query(`SELECT id FROM categorias WHERE id = $1 AND activo = TRUE`, [id]);
  return result.rows[0] || null;
}

async function findConceptoById(id) {
  const pool = getPool();
  const result = await pool.query(`SELECT id FROM conceptos_deducibilidad WHERE id = $1 AND activo = TRUE`, [id]);
  return result.rows[0] || null;
}

export {
  listDetalles,
  findDetalleById,
  createDetalle,
  updateDetalle,
  deleteDetalle,
  findCategoriaById,
  findConceptoById,
};
