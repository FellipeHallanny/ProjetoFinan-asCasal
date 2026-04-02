import { db } from '@/config/firebase';

export interface GoalData {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export class GoalRepository {
  async create(familyId: string, data: GoalData) {
    const ref = db.collection('families').doc(familyId).collection('goals').doc();
    await ref.set({ ...data, id: ref.id, createdAt: new Date().toISOString() });
    return ref.id;
  }
  async findAll(familyId: string) {
    const snap = await db.collection('families').doc(familyId).collection('goals').get();
    return snap.docs.map(doc => doc.data() as GoalData);
  }
  async findById(familyId: string, goalId: string) {
    const doc = await db.collection('families').doc(familyId).collection('goals').doc(goalId).get();
    return doc.exists ? (doc.data() as GoalData) : null;
  }
  async update(familyId: string, goalId: string, data: Partial<GoalData>) {
    await db.collection('families').doc(familyId).collection('goals').doc(goalId).update(data);
  }
  async delete(familyId: string, goalId: string) {
    await db.collection('families').doc(familyId).collection('goals').doc(goalId).delete();
  }
}
