import { Response } from 'express';
import { BaseController } from './BaseController';
import { CreditCardService } from '@/services/CreditCardService';
import { createCreditCardSchema, updateCreditCardSchema } from '@/validators/creditCard.schema';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class CreditCardController extends BaseController {
  constructor(private readonly service: CreditCardService) {
    super();
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = createCreditCardSchema.parse(req.body);
      const result = await this.service.createCard(req.user!.familyId!, data);
      this.handleSuccess(res, result, 201, 'Credit card created');
    } catch (error) {
      this.handleError(error, res, 'CreditCardController.create');
    }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await this.service.getCards(req.user!.familyId!);
      this.handleSuccess(res, result, 200);
    } catch (error) {
      this.handleError(error, res, 'CreditCardController.list');
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateCreditCardSchema.parse(req.body);
      const result = await this.service.updateCard(req.user!.familyId!, id, data);
      this.handleSuccess(res, result, 200, 'Credit card updated');
    } catch (error) {
      this.handleError(error, res, 'CreditCardController.update');
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteCard(req.user!.familyId!, id);
      this.handleSuccess(res, null, 200, 'Credit card deleted');
    } catch (error) {
      this.handleError(error, res, 'CreditCardController.delete');
    }
  }
}
