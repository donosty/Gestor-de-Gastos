import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError } from '../../../core/exceptions/http-error.js';
import { createDocumento, findDocumentoById, listDocumentosByGastoId, softDeleteDocumento } from '../repositories/documento.repository.js';
import { findExpenseById, findUserAreaId } from '../repositories/expense.repository.js';

const STORAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../storage/uploads/docs');

const XML_MIMES = new Set(['text/xml', 'application/xml']);

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

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

async function uploadDocumento(gastoId, file, observaciones, user) {
  if (!file) throw new HttpError(400, 'Se requiere un archivo (campo: archivo)');

  if (XML_MIMES.has(file.mimetype) || file.originalname.toLowerCase().endsWith('.xml')) {
    throw new HttpError(422, 'Los archivos XML deben adjuntarse como CFDI (POST /:id/cfdi)');
  }

  const enriched = await enrichUser(user);
  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanRead(expense, enriched);
  assertCanMutate(expense, enriched);

  await fs.mkdir(STORAGE_DIR, { recursive: true });

  const safeName = sanitizeFilename(file.originalname);
  const nombreArchivo = `doc_${gastoId}_${Date.now()}_${safeName}`;
  const rutaArchivo = path.join(STORAGE_DIR, nombreArchivo);

  await fs.writeFile(rutaArchivo, file.buffer);

  let documento;
  try {
    documento = await createDocumento({
      gastoId: Number(gastoId),
      nombreOriginal: file.originalname,
      nombreArchivo,
      rutaArchivo,
      tipoMime: file.mimetype || null,
      tamanioBytes: file.size,
      observaciones: typeof observaciones === 'string' && observaciones.trim() ? observaciones.trim() : null,
    });
  } catch (dbErr) {
    await fs.unlink(rutaArchivo).catch(() => {});
    throw dbErr;
  }

  return documento;
}

async function listDocumentos(gastoId, user) {
  const enriched = await enrichUser(user);
  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanRead(expense, enriched);

  return listDocumentosByGastoId(gastoId);
}

async function deleteDocumento(gastoId, docId, user) {
  const enriched = await enrichUser(user);
  const expense = await findExpenseById(gastoId);
  if (!expense) throw new HttpError(404, 'Gasto no encontrado');

  assertCanMutate(expense, enriched);

  const doc = await findDocumentoById(docId);
  if (!doc || Number(doc.gasto_id) !== Number(gastoId)) {
    throw new HttpError(404, 'Documento no encontrado');
  }

  await softDeleteDocumento(docId);
}

export { uploadDocumento, listDocumentos, deleteDocumento };
