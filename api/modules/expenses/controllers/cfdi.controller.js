import { deleteCfdi, getCfdi, uploadCfdi } from '../services/cfdi.service.js';

async function uploadCfdiController(req, res, next) {
  try {
    const cfdi = await uploadCfdi(req.params.id, req.body, req.user);
    res.status(201).json(cfdi);
  } catch (err) {
    next(err);
  }
}

async function getCfdiController(req, res, next) {
  try {
    const cfdi = await getCfdi(req.params.id, req.user);
    res.json(cfdi);
  } catch (err) {
    next(err);
  }
}

async function deleteCfdiController(req, res, next) {
  try {
    await deleteCfdi(req.params.id, req.user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export { uploadCfdiController, getCfdiController, deleteCfdiController };
