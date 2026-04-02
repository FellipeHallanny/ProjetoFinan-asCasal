import { db } from '@/config/firebase';

export class UserRepository {
  async getUser(uid: string) {
    const doc = await db.collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  async createUser(uid: string, data: any) {
    await db.collection('users').doc(uid).set(data, { merge: true });
  }

  async updateUserFamily(uid: string, familyId: string) {
    await db.collection('users').doc(uid).update({ familyId });
  }
}
