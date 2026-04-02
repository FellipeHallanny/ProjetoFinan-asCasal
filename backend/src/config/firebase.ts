import * as admin from 'firebase-admin';
import { config } from './unifiedConfig';

if (!admin.apps.length) {
  if (config.firebase.projectId && config.firebase.clientEmail && config.firebase.privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
      }),
    });
  } else {
    console.warn("Firebase config is incomplete. Falling back to default app credentials.");
    admin.initializeApp();
  }
}

export const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
export const auth = admin.auth();
