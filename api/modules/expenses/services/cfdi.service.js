import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError } from '../../../core/exceptions/http-error.js';
import { parseCFDI } from '../../../utils/cfdi-parser.js';
import { createCfdi, deleteCfdiByGastoId, findCfdiByGastoId, findCfdiByUuid, findProveedorByRfc } from '../repositories/cfdi.repository.js';
import { findExpenseById, findUserAreaId } from '../repositories/expense.repository.js';

const STORAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../storage/uploads/xml');

function assertCanRead(expense, user) {
  if (['ADMIN', 'CUENTAS_POR_PAGAR'].includes(user.rol)) return;
  if (user.rol === 'JEFE_AREA') {
    if (Number(expense.area_id) === Number(user._areaId)) return;
    throw new HttpError(403, 'No autorizado');
  }
  if (user.rol === 'CAPTURISTA') {
    if (Number(expense.usuario_id) === Number(user.id)) return;
    throw new HttpError(403, 'No autorizado');
  }
  throw new HttpError(403, 'No autorizado');
}

function assertCanMutate(expense, user) {
  if (expense.estatus !== 'BORRADOR') {
    throw new HttpError(409, 'Solo se pueden modificar gastos en borrador');
  }
  if (user.rol === 'ADMIN') return;
  if (user.rol === 'CAPTURISTA' && Number(expense.usuario_id) === Number(user.id)) return;
  throw new HttpError(403, 'No autorizado');
}

async function enrichUser(user) {
  if (user.rol === 'JEFE_AREA') {
    const record = await findUserAreaId(user.id);
    return { ...user, _areaId: record?.area_id ?? null };
  }
  return user;
}

async function uploadCfdi(gastoId, xmlString, user) {
  const enriched = await enrichUser(user);

  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanRead(expense, enriched);
  assertCanMutate(expense, enriched);

  const existing = await findCfdiByGastoId(gastoId);
  if (existing) throw new HttpError(409, 'Este gasto ya tiene una factura CFDI adjunta');

  let parsed;
  try {
    parsed = parseCFDI(xmlString);
  } catch (e) {
    throw new HttpError(422, e.message);
  }

  const duplicate = await findCfdiByUuid(parsed.uuid);
  if (duplicate) throw new HttpError(409, `El UUID ${parsed.uuid} ya está registrado en el sistema`);

  const proveedor = await findProveedorByRfc(parsed.rfcEmisor);

  await fs.mkdir(STORAGE_DIR, { recursive: true });

  const nombreArchivo = `cfdi_${gastoId}_${Date.now()}.xml`;
  const rutaXml = path.join(STORAGE_DIR, nombreArchivo);
  await fs.writeFile(rutaXml, xmlString, 'utf8');

  let cfdi;
  try {
    cfdi = await createCfdi({
      gastoId: Number(gastoId),
      proveedorId: proveedor?.id ?? null,
      uuid: parsed.uuid,
      serie: parsed.serie,
      folio: parsed.folio,
      rfcEmisor: parsed.rfcEmisor,
      rfcReceptor: parsed.rfcReceptor,
      fechaEmision: parsed.fechaEmision,
      metodoPago: parsed.metodoPago,
      subtotal: parsed.subtotal,
      iva: parsed.iva,
      total: parsed.total,
      rutaXml,
      nombreArchivoXml: nombreArchivo,
    });
  } catch (dbErr) {
    // Clean up stored file if DB insert fails
    await fs.unlink(rutaXml).catch(() => {});
    throw dbErr;
  }

  return cfdi;
}

async function getCfdi(gastoId, user) {
  const enriched = await enrichUser(user);

  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanRead(expense, enriched);

  const cfdi = await findCfdiByGastoId(gastoId);
  if (!cfdi) throw new HttpError(404, 'No hay factura CFDI adjunta a este gasto');

  return cfdi;
}

async function deleteCfdi(gastoId, user) {
  const enriched = await enrichUser(user);

  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanMutate(expense, enriched);

  const deleted = await deleteCfdiByGastoId(gastoId);
  if (!deleted) throw new HttpError(404, 'No hay factura CFDI adjunta a este gasto');

  await fs.unlink(deleted.ruta_xml).catch(() => {});
}

export { uploadCfdi, getCfdi, deleteCfdi };
