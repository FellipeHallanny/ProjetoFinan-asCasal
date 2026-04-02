import { db } from '@/config/firebase';

export interface CategoryData {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
}

export class CategoryRepository {
  async create(familyId: string, data: CategoryData) {
    const ref = db.collection('families').doc(familyId).collection('categories').doc();
    await ref.set({ ...data, id: ref.id });
    return ref.id;
  }

  async findAll(familyId: string) {
    const snap = await db.collection('families').doc(familyId).collection('categories').get();
    return snap.docs.map(doc => doc.data() as CategoryData);
  }

  async update(familyId: string, categoryId: string, data: Partial<CategoryData>) {
    await db.collection('families').doc(familyId).collection('categories').doc(categoryId).update(data);
  }

  async delete(familyId: string, categoryId: string) {
    await db.collection('families').doc(familyId).collection('categories').doc(categoryId).delete();
  }

  async registerPattern(familyId: string, description: string, categoryId: string) {
    // Uses the first word as the simplest indexing pattern
    const term = description.toLowerCase().trim().split(' ')[0];
    if (!term) return;

    const ref = db.collection('families').doc(familyId).collection('categoryPatterns').doc(term);
    
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        transaction.set(ref, { categoryId, count: 1 });
      } else {
        const data = doc.data() as { categoryId: string, count: number };
        if (data.categoryId === categoryId) {
          transaction.update(ref, { count: data.count + 1 });
        } else {
          // Resets for the newly preferred category for this term
          transaction.set(ref, { categoryId, count: 1 });
        }
      }
    });
  }

  async suggest(familyId: string, description: string) {
    const term = description.toLowerCase().trim().split(' ')[0];
    if (!term) return null;

    const doc = await db.collection('families').doc(familyId).collection('categoryPatterns').doc(term).get();
    return doc.exists ? doc.data() : null;
  }

  async findAllPatterns(familyId: string) {
    const snap = await db.collection('families').doc(familyId).collection('categoryPatterns').get();
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}
