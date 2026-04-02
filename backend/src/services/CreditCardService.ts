import { CreditCardRepository, CreditCardData } from '@/repositories/CreditCardRepository';
import { NotFoundError } from '@/types/errors';

export class CreditCardService {
  constructor(private readonly repository: CreditCardRepository) {}

  async createCard(familyId: string, data: CreditCardData) {
    const id = await this.repository.create(familyId, data);
    return { id, ...data };
  }

  async getCards(familyId: string) {
    return this.repository.findAll(familyId);
  }

  async updateCard(familyId: string, cardId: string, data: Partial<CreditCardData>) {
    const card = await this.repository.findById(familyId, cardId);
    if (!card) throw new NotFoundError('Credit card not found');
    await this.repository.update(familyId, cardId, data);
    return { id: cardId, ...card, ...data };
  }

  async deleteCard(familyId: string, cardId: string) {
    const card = await this.repository.findById(familyId, cardId);
    if (!card) throw new NotFoundError('Credit card not found');
    await this.repository.delete(familyId, cardId);
    return { success: true };
  }
}
