import { db } from '@/config/firebase';
import * as admin from 'firebase-admin';

export class FamilyRepository {
  async createFamily(name: string, ownerUid: string) {
    const ref = db.collection('families').doc();
    await ref.set({
      name,
      users: [ownerUid],
      createdAt: new Date().toISOString()
    });
    return ref.id;
  }

  async getFamily(familyId: string) {
    const doc = await db.collection('families').doc(familyId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
  
  async getFamilyByInviteCode(inviteCode: string) {
    // For simplicity the invite code is the familyId
    return this.getFamily(inviteCode);
  }

  async addUserToFamily(familyId: string, uid: string) {
    const FieldValue = admin.firestore.FieldValue;
    await db.collection('families').doc(familyId).update({
      users: FieldValue.arrayUnion(uid)
    });
  }
}
