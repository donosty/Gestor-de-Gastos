import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createExpense as createExpenseRecord,
  findAreaById,
  findCentroCostoById,
  findEstatusByNombre,
  findExpenseById,
  findUserAreaId,
  listExpenses,
  softDeleteExpense,
  updateExpense as updateExpenseRecord,
} from '../repositories/expense.repository.js';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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

function parseDecimal(value) {
  if (value === undefined || value === null) return null;
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return null;
  return parseFloat(parsed.toFixed(2));
}

// --- access helpers ---

function buildListFilter(user) {
  if (['ADMIN', 'CUENTAS_POR_PAGAR'].includes(user.rol)) return {};
  if (user.rol === 'JEFE_AREA') return { _needsUserArea: true };
  return { usuarioId: Number(user.id) };
}

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

// --- area/cc resolution ---

async function resolveAreaId(payload, user) {
  if (user.rol === 'CAPTURISTA') {
    const record = await findUserAreaId(user.id);
    if (!record?.area_id) {
      throw new HttpError(422, 'Tu usuario no tiene área asignada');
    }
    return Number(record.area_id);
  }

  const areaId = parsePositiveInt(payload?.area_id);
  if (!areaId) throw new HttpError(400, 'area_id es requerido');
  return areaId;
}

async function resolveUserAreaForFilter(userId) {
  const record = await findUserAreaId(userId);
  return record?.area_id ? Number(record.area_id) : null;
}

async function validateAreaAndCC(areaId, centroCostoId) {
  const area = await findAreaById(areaId);
  if (!area) throw new HttpError(404, 'Área no encontrada');

  const cc = await findCentroCostoById(centroCostoId);
  if (!cc) throw new HttpError(404, 'Centro de costo no encontrado');
  if (Number(cc.area_id) !== areaId) {
    throw new HttpError(422, 'El centro de costo no pertenece al área indicada');
  }
}

function validateCorePayload(payload) {
  const centroCostoId = parsePositiveInt(payload?.centro_costo_id);
  if (!centroCostoId) throw new HttpError(400, 'centro_costo_id es requerido');

  const fechaGasto = normalizeString(payload?.fecha_gasto);
  if (!fechaGasto || !DATE_REGEX.test(fechaGasto)) {
    throw new HttpError(400, 'fecha_gasto es requerida (formato YYYY-MM-DD)');
  }

  const conceptoGeneral = normalizeString(payload?.concepto_general);
  if (!conceptoGeneral) throw new HttpError(400, 'concepto_general es requerido');

  const justificacion = normalizeString(payload?.justificacion);
  const subtotal = parseDecimal(payload?.subtotal) ?? 0;
  const iva = parseDecimal(payload?.iva) ?? 0;

  if (subtotal === null) throw new HttpError(400, 'subtotal inválido');
  if (iva === null) throw new HttpError(400, 'iva inválido');

  const total = parseFloat((subtotal + iva).toFixed(2));

  return { centroCostoId, fechaGasto, conceptoGeneral, justificacion, subtotal, iva, total };
}

// --- public service functions ---

async function createExpense(payload, user) {
  const areaId = await resolveAreaId(payload, user);
  const core = validateCorePayload(payload);
  await validateAreaAndCC(areaId, core.centroCostoId);

  const estatus = await findEstatusByNombre('BORRADOR');

  return createExpenseRecord({
    usuarioId: Number(user.id),
    areaId,
    centroCostoId: core.centroCostoId,
    estatusId: Number(estatus.id),
    fechaGasto: core.fechaGasto,
    conceptoGeneral: core.conceptoGeneral,
    justificacion: core.justificacion,
    subtotal: core.subtotal,
    iva: core.iva,
    total: core.total,
  });
}

async function getExpenses(user) {
  const filter = buildListFilter(user);

  if (filter._needsUserArea) {
    const areaId = await resolveUserAreaForFilter(user.id);
    return listExpenses({ areaId });
  }

  return listExpenses(filter);
}

async function getExpenseById(id, user) {
  const expense = await findExpenseById(id);
  if (!expense || expense.deleted_at) throw new HttpError(404, 'Gasto no encontrado');

  let enrichedUser = user;
  if (user.rol === 'JEFE_AREA') {
    enrichedUser = { ...user, _areaId: await resolveUserAreaForFilter(user.id) };
  }

  assertCanRead(expense, enrichedUser);
  return expense;
}

async function updateExpense(id, payload, user) {
  const existing = await findExpenseById(id);
  if (!existing || existing.deleted_at) throw new HttpError(404, 'Gasto no encontrado');

  assertCanMutate(existing, user);

  // CAPTURISTA locked to their assigned area; ADMIN can change area
  let areaId;
  if (user.rol === 'CAPTURISTA') {
    areaId = Number(existing.area_id);
  } else {
    areaId = parsePositiveInt(payload?.area_id) ?? Number(existing.area_id);
    if (!areaId) throw new HttpError(400, 'area_id es requerido');
  }

  const core = validateCorePayload(payload);
  await validateAreaAndCC(areaId, core.centroCostoId);

  const updated = await updateExpenseRecord(id, { areaId, ...core });
  if (!updated) throw new HttpError(404, 'Gasto no encontrado');
  return updated;
}

async function deleteExpense(id, user) {
  const existing = await findExpenseById(id);
  if (!existing || existing.deleted_at) throw new HttpError(404, 'Gasto no encontrado');

  assertCanMutate(existing, user);

  await softDeleteExpense(id);
}

export { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense };
