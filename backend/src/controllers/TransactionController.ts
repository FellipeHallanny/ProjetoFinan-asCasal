import { Response } from 'express';
import { BaseController } from './BaseController';
import { TransactionService } from '@/services/TransactionService';
import { createTransactionSchema, updateTransactionSchema } from '@/validators/transaction.schema';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class TransactionController extends BaseController {
  constructor(private readonly service: TransactionService) {
    super();
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = createTransactionSchema.parse(req.body);
      const result = await this.service.createTransaction(req.user!.familyId!, data);
      this.handleSuccess(res, result, 201, 'Transaction created');
    } catch (error) {
      this.handleError(error, res, 'TransactionController.create');
    }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const monthYear = req.query.monthYear as string | undefined;
      const result = await this.service.getTransactions(req.user!.familyId!, monthYear);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'TransactionController.list');
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateTransactionSchema.parse(req.body);
      const result = await this.service.updateTransaction(req.user!.familyId!, id, data);
      this.handleSuccess(res, result, 200, 'Transaction updated');
    } catch (error) {
      this.handleError(error, res, 'TransactionController.update');
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteTransaction(req.user!.familyId!, id);
      this.handleSuccess(res, null, 200, 'Transaction deleted');
    } catch (error) {
      this.handleError(error, res, 'TransactionController.delete');
    }
  }
}
