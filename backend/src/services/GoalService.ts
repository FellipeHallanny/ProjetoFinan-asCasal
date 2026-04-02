import { GoalRepository, GoalData } from '@/repositories/GoalRepository';
import { TransactionService } from '@/services/TransactionService';
import { NotFoundError } from '@/types/errors';

export class GoalService {
  constructor(
    private readonly repository: GoalRepository,
    private readonly transactionService: TransactionService
  ) {}

  async createGoal(familyId: string, data: GoalData) {
    const id = await this.repository.create(familyId, data);
    return { id, ...data };
  }

  async getGoals(familyId: string) {
    return this.repository.findAll(familyId);
  }

  async updateGoal(familyId: string, goalId: string, data: Partial<GoalData>) {
    const goal = await this.repository.findById(familyId, goalId);
    if (!goal) throw new NotFoundError('Goal not found');
    await this.repository.update(familyId, goalId, data);
    return { id: goalId, ...goal, ...data };
  }

  async deposit(familyId: string, goalId: string, amount: number, userId: string, description?: string) {
    const goal = await this.repository.findById(familyId, goalId);
    if (!goal) throw new NotFoundError('Goal not found');

    const newAmount = (goal.currentAmount || 0) + amount;
    
    await this.transactionService.createTransaction(familyId, {
      description: description || `Aporte na meta: ${goal.name}`,
      amount,
      type: 'GOAL_DEPOSIT',
      paidBy: userId,
      status: 'PAID'
    });

    await this.repository.update(familyId, goalId, { currentAmount: newAmount });
    
    return { id: goalId, currentAmount: newAmount };
  }

  async deleteGoal(familyId: string, goalId: string) {
    const goal = await this.repository.findById(familyId, goalId);
    if (!goal) throw new NotFoundError('Goal not found');
    await this.repository.delete(familyId, goalId);
    return { success: true };
  }
}
