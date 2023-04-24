import { Router } from 'express';

import {
  addTransaction,
  getTransactionsByToken
} from '../controllers/transactions.controller.js';
import { validateTransaction } from '../middlewares/validate.middleware.js';
import { transactionSchema } from '../schemas/transactions.schema.js';

const transactionsRouter = Router();

transactionsRouter.post(
  '/new-transaction/:type',
  validateTransaction(transactionSchema),
  addTransaction
);
transactionsRouter.get('/transactions', getTransactionsByToken);

export default transactionsRouter;
