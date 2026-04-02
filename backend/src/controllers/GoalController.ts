import { Response } from 'express';
import { BaseController } from './BaseController';
import { GoalService } from '@/services/GoalService';
import { createGoalSchema, updateGoalSchema, depositGoalSchema } from '@/validators/goal.schema';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class GoalController extends BaseController {
  constructor(private readonly service: GoalService) {
    super();
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = createGoalSchema.parse(req.body);
      const result = await this.service.createGoal(req.user!.familyId!, data);
      this.handleSuccess(res, result, 201, 'Goal created');
    } catch (error) { this.handleError(error, res, 'GoalController.create'); }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await this.service.getGoals(req.user!.familyId!);
      this.handleSuccess(res, result, 200);
    } catch (error) { this.handleError(error, res, 'GoalController.list'); }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateGoalSchema.parse(req.body);
      const result = await this.service.updateGoal(req.user!.familyId!, id, data);
      this.handleSuccess(res, result, 200, 'Goal updated');
    } catch (error) { this.handleError(error, res, 'GoalController.update'); }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteGoal(req.user!.familyId!, id);
      this.handleSuccess(res, null, 200, 'Goal deleted');
    } catch (error) { this.handleError(error, res, 'GoalController.delete'); }
  }

  async deposit(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { amount, description } = depositGoalSchema.parse(req.body);
      const result = await this.service.deposit(req.user!.familyId!, id, amount, req.user!.uid, description);
      this.handleSuccess(res, result, 200, 'Deposit successful');
    } catch (error) { this.handleError(error, res, 'GoalController.deposit'); }
  }
}
