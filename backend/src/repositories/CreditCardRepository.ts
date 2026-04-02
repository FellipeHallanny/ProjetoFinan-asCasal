import { db } from '@/config/firebase';
import * as admin from 'firebase-admin';

export interface CreditCardData {
  id?: string;
  name: string;
  limit: number;
  usedLimit?: number;
  closingDay: number;
  dueDay: number;
  createdAt?: string;
}

export class CreditCardRepository {
  async create(familyId: string, data: CreditCardData) {
    const ref = db.collection('families').doc(familyId).collection('creditCards').doc();
    await ref.set({ 
      ...data, 
      id: ref.id, 
      usedLimit: 0, 
      createdAt: new Date().toISOString() 
    });
    return ref.id;
  }

  async findAll(familyId: string) {
    const snapshot = await db.collection('families').doc(familyId).collection('creditCards').get();
    return snapshot.docs.map(doc => doc.data() as CreditCardData);
  }

  async findById(familyId: string, cardId: string) {
    const doc = await db.collection('families').doc(familyId).collection('creditCards').doc(cardId).get();
    return doc.exists ? (doc.data() as CreditCardData) : null;
  }

  async update(familyId: string, cardId: string, data: Partial<CreditCardData>) {
    await db.collection('families').doc(familyId).collection('creditCards').doc(cardId).update(data);
  }

  async delete(familyId: string, cardId: string) {
    await db.collection('families').doc(familyId).collection('creditCards').doc(cardId).delete();
  }

  async adjustUsedLimit(familyId: string, cardId: string, amount: number) {
    const ref = db.collection('families').doc(familyId).collection('creditCards').doc(cardId);
    await ref.update({
      usedLimit: admin.firestore.FieldValue.increment(amount)
    });
  }
}
