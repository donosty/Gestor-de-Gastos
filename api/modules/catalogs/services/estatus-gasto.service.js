import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  findEstatusGastoById,
  listEstatusGastos,
} from '../repositories/estatus-gasto.repository.js';

async function getEstatusGastos() {
  return listEstatusGastos();
}

async function getEstatusGastoById(id) {
  const estatus = await findEstatusGastoById(id);
  if (!estatus) throw new HttpError(404, 'Estatus no encontrado');
  return estatus;
}

export { getEstatusGastos, getEstatusGastoById };
