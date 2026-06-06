import { HttpError } from '../../../core/exceptions/http-error.js';
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenses,
  sendForApproval,
  updateExpense,
} from '../services/expense.service.js';

function parseExpenseId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'Id invalido');
  return id;
}

async function createExpenseController(req, res, next) {
  try {
    const expense = await createExpense(req.body, req.user);
    res.status(201).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

async function listExpensesController(req, res, next) {
  try {
    const expenses = await getExpenses(req.user);
    res.status(200).json({ data: expenses });
  } catch (error) {
    next(error);
  }
}

async function getExpenseController(req, res, next) {
  try {
    const id = parseExpenseId(req.params.id);
    const expense = await getExpenseById(id, req.user);
    res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

async function updateExpenseController(req, res, next) {
  try {
    const id = parseExpenseId(req.params.id);
    const expense = await updateExpense(id, req.body, req.user);
    res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

async function deleteExpenseController(req, res, next) {
  try {
    const id = parseExpenseId(req.params.id);
    await deleteExpense(id, req.user);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function sendForApprovalController(req, res, next) {
  try {
    const id = parseExpenseId(req.params.id);
    const expense = await sendForApproval(id, req.user);
    res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
}

export {
  createExpenseController,
  listExpensesController,
  getExpenseController,
  updateExpenseController,
  deleteExpenseController,
  sendForApprovalController,
};
