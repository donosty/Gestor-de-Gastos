import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  activateProvider,
  createProvider,
  deactivateProvider,
  getProviderById,
  getProviders,
  updateProvider,
} from '../services/provider.service.js';

function parseProviderId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function createProviderController(req, res, next) {
  try {
    const provider = await createProvider(req.body);
    res.status(201).json({ data: provider });
  } catch (error) {
    next(error);
  }
}

async function listProvidersController(req, res, next) {
  try {
    const providers = await getProviders();
    res.status(200).json({ data: providers });
  } catch (error) {
    next(error);
  }
}

async function getProviderController(req, res, next) {
  try {
    const id = parseProviderId(req.params.id);
    const provider = await getProviderById(id);
    res.status(200).json({ data: provider });
  } catch (error) {
    next(error);
  }
}

async function updateProviderController(req, res, next) {
  try {
    const id = parseProviderId(req.params.id);
    const provider = await updateProvider(id, req.body);
    res.status(200).json({ data: provider });
  } catch (error) {
    next(error);
  }
}

async function activateProviderController(req, res, next) {
  try {
    const id = parseProviderId(req.params.id);
    const provider = await activateProvider(id);
    res.status(200).json({ data: provider });
  } catch (error) {
    next(error);
  }
}

async function deactivateProviderController(req, res, next) {
  try {
    const id = parseProviderId(req.params.id);
    const provider = await deactivateProvider(id);
    res.status(200).json({ data: provider });
  } catch (error) {
    next(error);
  }
}

export {
  createProviderController,
  listProvidersController,
  getProviderController,
  updateProviderController,
  activateProviderController,
  deactivateProviderController,
};
