import { db } from '@/config/firebase';

export interface TransactionData {
  id?: string;
  description: string;
  amount: number;
  date?: string;
  type: 'INCOME' | 'EXPENSE' | 'GOAL_DEPOSIT';
  categoryId?: string;
  paidBy: string;
  status: 'PENDING' | 'PAID';
  creditCardId?: string;
  installmentId?: string;
  createdAt?: string;
}

export class TransactionRepository {
  async create(familyId: string, data: TransactionData) {
    const ref = db.collection('families').doc(familyId).collection('transactions').doc();
    await ref.set({ ...data, id: ref.id, createdAt: new Date().toISOString() });
    return ref.id;
  }

  async createBatch(familyId: string, transactions: TransactionData[]) {
    const batch = db.batch();
    const createdIds: string[] = [];
    const collRef = db.collection('families').doc(familyId).collection('transactions');

    transactions.forEach(data => {
      const ref = collRef.doc();
      batch.set(ref, { ...data, id: ref.id, createdAt: new Date().toISOString() });
      createdIds.push(ref.id);
    });

    await batch.commit();
    return createdIds;
  }

  async findAll(familyId: string, monthYear?: string) {
    const query = db.collection('families').doc(familyId).collection('transactions');
    const snapshot = await query.get();
    let docs = snapshot.docs.map(doc => doc.data() as TransactionData);

    if (monthYear) {
      docs = docs.filter(d => d.date?.startsWith(monthYear));
    }
    return docs;
  }

  async findById(familyId: string, transactionId: string) {
    const doc = await db.collection('families').doc(familyId).collection('transactions').doc(transactionId).get();
    return doc.exists ? (doc.data() as TransactionData) : null;
  }

  async update(familyId: string, transactionId: string, data: Partial<TransactionData>) {
    await db.collection('families').doc(familyId).collection('transactions').doc(transactionId).update(data);
  }

  async delete(familyId: string, transactionId: string) {
    await db.collection('families').doc(familyId).collection('transactions').doc(transactionId).delete();
  }
}
