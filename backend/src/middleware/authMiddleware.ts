import { Request, Response, NextFunction } from 'express';
import { auth, db } from '@/config/firebase';
import { UnauthorizedError, ForbiddenError } from '@/types/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    familyId?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    let familyId: string | undefined = undefined;
    
    if (userDoc.exists) {
      familyId = userDoc.data()?.familyId;
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      familyId
    };

    next();
  } catch (error) {
    console.error('[Firebase Auth Error]', error);
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const requireFamilySpace = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user?.familyId) {
    next(new ForbiddenError('User is not associated with any family workspace.'));
    return;
  }
  next();
};
