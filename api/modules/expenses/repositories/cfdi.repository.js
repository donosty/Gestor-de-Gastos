import { getPool } from '../../../database/connection/index.js';

async function findCfdiByGastoId(gastoId) {
  const pool = getPool();
  const result = await pool.query(
    `SELECT fc.*, p.razon_social AS proveedor_nombre, p.rfc AS proveedor_rfc
       FROM facturas_cfdi fc
       LEFT JOIN proveedores p ON p.id = fc.proveedor_id
      WHERE fc.gasto_id = $1`,
    [gastoId],
  );
  return result.rows[0] || null;
}

async function findCfdiByUuid(uuid) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id FROM facturas_cfdi WHERE uuid = $1',
    [uuid],
  );
  return result.rows[0] || null;
}

async function findProveedorByRfc(rfc) {
  const pool = getPool();
  const result = await pool.query(
    'SELECT id, razon_social, rfc FROM proveedores WHERE rfc = $1 AND activo = TRUE',
    [rfc],
  );
  return result.rows[0] || null;
}

async function createCfdi({ gastoId, proveedorId, uuid, serie, folio, rfcEmisor, rfcReceptor, fechaEmision, metodoPago, subtotal, iva, total, rutaXml, nombreArchivoXml }) {
  const pool = getPool();
  await pool.query(
    `INSERT INTO facturas_cfdi
       (gasto_id, proveedor_id, uuid, serie, folio, rfc_emisor, rfc_receptor,
        fecha_emision, metodo_pago, subtotal, iva, total, ruta_xml, nombre_archivo_xml)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [gastoId, proveedorId, uuid, serie, folio, rfcEmisor, rfcReceptor, fechaEmision, metodoPago, subtotal, iva, total, rutaXml, nombreArchivoXml],
  );
  return findCfdiByGastoId(gastoId);
}

async function deleteCfdiByGastoId(gastoId) {
  const pool = getPool();
  const result = await pool.query(
    'DELETE FROM facturas_cfdi WHERE gasto_id = $1 RETURNING ruta_xml',
    [gastoId],
  );
  return result.rows[0] || null;
}

export { findCfdiByGastoId, findCfdiByUuid, findProveedorByRfc, createCfdi, deleteCfdiByGastoId };
