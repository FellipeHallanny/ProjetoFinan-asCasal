import { TransactionRepository, TransactionData } from '@/repositories/TransactionRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { CreditCardRepository } from '@/repositories/CreditCardRepository';
import { NotFoundError } from '@/types/errors';

export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly creditCardRepository: CreditCardRepository
  ) {}

  async createTransaction(familyId: string, inputData: any) {
    const { installments, creditCardId, ...baseData } = inputData;

    if (!installments || installments <= 1 || !creditCardId) {
      const id = await this.repository.create(familyId, { 
        ...baseData, 
        creditCardId,
        date: baseData.date || new Date().toISOString()
      });

      if (baseData.description && baseData.categoryId) {
        await this.categoryRepository.registerPattern(familyId, baseData.description, baseData.categoryId);
      }

      if (creditCardId && baseData.type === 'EXPENSE') {
        await this.creditCardRepository.adjustUsedLimit(familyId, creditCardId, baseData.amount);
      }

      return { id };
    }

    const installmentGroupId = `inst_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    const amountPerInstallment = Number((baseData.amount / installments).toFixed(2));
    const batchData: TransactionData[] = [];

    const baseDate = new Date(baseData.date || new Date().toISOString());

    for (let i = 1; i <= installments; i++) {
      const instDate = new Date(baseDate);
      instDate.setMonth(instDate.getMonth() + (i - 1));

      batchData.push({
        ...baseData,
        amount: amountPerInstallment,
        creditCardId,
        date: instDate.toISOString(),
        installmentId: `${installmentGroupId}_${i}/${installments}`,
        description: `${baseData.description} (${i}/${installments})`
      });
    }

    const ids = await this.repository.createBatch(familyId, batchData);

    if (baseData.description && baseData.categoryId) {
      await this.categoryRepository.registerPattern(familyId, baseData.description, baseData.categoryId);
    }

    if (creditCardId && baseData.type === 'EXPENSE') {
      await this.creditCardRepository.adjustUsedLimit(familyId, creditCardId, baseData.amount);
    }

    return { ids, installmentGroupId };
  }

  async getTransactions(familyId: string, monthYear?: string) {
    return this.repository.findAll(familyId, monthYear);
  }

  async updateTransaction(familyId: string, transactionId: string, data: Partial<TransactionData>) {
    const trx = await this.repository.findById(familyId, transactionId);
    if (!trx) throw new NotFoundError('Transaction not found');

    // Handle Limit Adjustments if amount or card or type changed
    if (trx.type === 'EXPENSE' || data.type === 'EXPENSE') {
      const oldCard = trx.creditCardId;
      const newCard = data.creditCardId !== undefined ? data.creditCardId : trx.creditCardId;
      const oldAmount = trx.amount;
      const newAmount = data.amount !== undefined ? data.amount : trx.amount;

      if (oldCard && !newCard) {
        // Removed from card
        await this.creditCardRepository.adjustUsedLimit(familyId, oldCard, -oldAmount);
      } else if (!oldCard && newCard) {
        // Linked to card
        await this.creditCardRepository.adjustUsedLimit(familyId, newCard, newAmount);
      } else if (oldCard && newCard) {
        if (oldCard === newCard) {
          // Same card, adjust difference
          if (oldAmount !== newAmount) {
            await this.creditCardRepository.adjustUsedLimit(familyId, oldCard, newAmount - oldAmount);
          }
        } else {
          // Changed card
          await this.creditCardRepository.adjustUsedLimit(familyId, oldCard, -oldAmount);
          await this.creditCardRepository.adjustUsedLimit(familyId, newCard, newAmount);
        }
      }
    }

    await this.repository.update(familyId, transactionId, data);
    return { id: transactionId, ...trx, ...data };
  }

  async deleteTransaction(familyId: string, transactionId: string) {
    const trx = await this.repository.findById(familyId, transactionId);
    if (!trx) throw new NotFoundError('Transaction not found');

    if (trx.creditCardId && trx.type === 'EXPENSE') {
      await this.creditCardRepository.adjustUsedLimit(familyId, trx.creditCardId, -trx.amount);
    }

    await this.repository.delete(familyId, transactionId);
    return { success: true };
  }
}
