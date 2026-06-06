import { deleteDocumento, listDocumentos, uploadDocumento } from '../services/documento.service.js';

async function uploadDocumentoController(req, res, next) {
  try {
    const doc = await uploadDocumento(req.params.id, req.file, req.body.observaciones, req.user);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

async function listDocumentosController(req, res, next) {
  try {
    const docs = await listDocumentos(req.params.id, req.user);
    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
}

async function deleteDocumentoController(req, res, next) {
  try {
    await deleteDocumento(req.params.id, req.params.docId, req.user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export { uploadDocumentoController, listDocumentosController, deleteDocumentoController };
