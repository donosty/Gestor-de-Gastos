import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createDetalle,
  deleteDetalle,
  findCategoriaById,
  findConceptoById,
  findDetalleById,
  listDetalles,
  updateDetalle,
} from '../repositories/expense-detail.repository.js';
import { findExpenseById, findUserAreaId } from '../repositories/expense.repository.js';

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parsePositiveInt(value) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function parsePositiveDecimal(value) {
  if (value === undefined || value === null) return null;
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parseFloat(parsed.toFixed(2));
}

function parseDecimal(value) {
  if (value === undefined || value === null) return null;
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return null;
  return parseFloat(parsed.toFixed(2));
}

// --- access helpers (mirrors expense.service, no cross-service import) ---

async function resolveUserAreaId(userId) {
  const record = await findUserAreaId(userId);
  return record?.area_id ? Number(record.area_id) : null;
}

function canReadExpense(expense, user, userAreaId) {
  if (['ADMIN', 'CUENTAS_POR_PAGAR'].includes(user.rol)) return true;
  if (user.rol === 'JEFE_AREA') return Number(expense.area_id) === userAreaId;
  if (user.rol === 'CAPTURISTA') return Number(expense.usuario_id) === Number(user.id);
  return false;
}

function canMutateExpense(expense, user) {
  if (expense.estatus !== 'BORRADOR') return false;
  if (user.rol === 'ADMIN') return true;
  if (user.rol === 'CAPTURISTA') return Number(expense.usuario_id) === Number(user.id);
  return false;
}

async function resolveAndAssertRead(gastoId, user) {
  const expense = await findExpenseById(gastoId);
  if (!expense || expense.deleted_at) throw new HttpError(404, 'Gasto no encontrado');

  let userAreaId = null;
  if (user.rol === 'JEFE_AREA') userAreaId = await resolveUserAreaId(user.id);

  if (!canReadExpense(expense, user, userAreaId)) throw new HttpError(403, 'No autorizado');
  return expense;
}

async function resolveAndAssertMutate(gastoId, user) {
  const expense = await findExpenseById(gastoId);
  if (!expense || expense.deleted_at) throw new HttpError(404, 'Gasto no encontrado');
  if (!canMutateExpense(expense, user)) {
    if (expense.estatus !== 'BORRADOR') throw new HttpError(409, 'Solo se pueden modificar gastos en borrador');
    throw new HttpError(403, 'No autorizado');
  }
  return expense;
}

// --- payload validation ---

function validateDetallePayload(payload) {
  const categoriaId = parsePositiveInt(payload?.categoria_id);
  if (!categoriaId) throw new HttpError(400, 'categoria_id es requerido');

  const conceptoDeducibilidadId = parsePositiveInt(payload?.concepto_deducibilidad_id);
  if (!conceptoDeducibilidadId) throw new HttpError(400, 'concepto_deducibilidad_id es requerido');

  const descripcion = normalizeString(payload?.descripcion);
  if (!descripcion) throw new HttpError(400, 'descripcion es requerida');

  const cantidad = parsePositiveDecimal(payload?.cantidad ?? 1);
  if (cantidad === null) throw new HttpError(400, 'cantidad debe ser mayor a 0');

  const precioUnitario = parsePositiveDecimal(payload?.precio_unitario);
  if (precioUnitario === null) throw new HttpError(400, 'precio_unitario debe ser mayor a 0');

  const iva = parseDecimal(payload?.iva) ?? 0;
  if (iva === null) throw new HttpError(400, 'iva inválido');

  const subtotal = parseFloat((cantidad * precioUnitario).toFixed(2));
  const total = parseFloat((subtotal + iva).toFixed(2));

  return { categoriaId, conceptoDeducibilidadId, descripcion, cantidad, precioUnitario, subtotal, iva, total };
}

// --- public service functions ---

async function getDetalles(gastoId, user) {
  await resolveAndAssertRead(gastoId, user);
  return listDetalles(gastoId);
}

async function getDetalleById(gastoId, detalleId, user) {
  await resolveAndAssertRead(gastoId, user);

  const detalle = await findDetalleById(detalleId);
  if (!detalle || Number(detalle.gasto_id) !== gastoId) {
    throw new HttpError(404, 'Línea de detalle no encontrada');
  }
  return detalle;
}

async function addDetalle(gastoId, payload, user) {
  await resolveAndAssertMutate(gastoId, user);

  const data = validateDetallePayload(payload);

  const categoria = await findCategoriaById(data.categoriaId);
  if (!categoria) throw new HttpError(404, 'Categoría no encontrada o inactiva');

  const concepto = await findConceptoById(data.conceptoDeducibilidadId);
  if (!concepto) throw new HttpError(404, 'Concepto de deducibilidad no encontrado o inactivo');

  return createDetalle({ gastoId, ...data });
}

async function editDetalle(gastoId, detalleId, payload, user) {
  await resolveAndAssertMutate(gastoId, user);

  const existing = await findDetalleById(detalleId);
  if (!existing || Number(existing.gasto_id) !== gastoId) {
    throw new HttpError(404, 'Línea de detalle no encontrada');
  }

  const data = validateDetallePayload(payload);

  const categoria = await findCategoriaById(data.categoriaId);
  if (!categoria) throw new HttpError(404, 'Categoría no encontrada o inactiva');

  const concepto = await findConceptoById(data.conceptoDeducibilidadId);
  if (!concepto) throw new HttpError(404, 'Concepto de deducibilidad no encontrado o inactivo');

  const updated = await updateDetalle(detalleId, gastoId, data);
  if (!updated) throw new HttpError(404, 'Línea de detalle no encontrada');
  return updated;
}

async function removeDetalle(gastoId, detalleId, user) {
  await resolveAndAssertMutate(gastoId, user);

  const existing = await findDetalleById(detalleId);
  if (!existing || Number(existing.gasto_id) !== gastoId) {
    throw new HttpError(404, 'Línea de detalle no encontrada');
  }

  await deleteDetalle(detalleId, gastoId);
}

export { getDetalles, getDetalleById, addDetalle, editDetalle, removeDetalle };
