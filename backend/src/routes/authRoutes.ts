import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { AuthService } from '@/services/AuthService';
import { UserRepository } from '@/repositories/UserRepository';
import { FamilyRepository } from '@/repositories/FamilyRepository';
import { requireAuth } from '@/middleware/authMiddleware';
import { asyncErrorWrapper } from '@/utils/asyncErrorWrapper';

const router = Router();

const userRepository = new UserRepository();
const familyRepository = new FamilyRepository();
const authService = new AuthService(userRepository, familyRepository);
const authController = new AuthController(authService);

router.post('/space/create', requireAuth, asyncErrorWrapper((req, res) => authController.createSpace(req, res)));
router.post('/space/join', requireAuth, asyncErrorWrapper((req, res) => authController.joinSpace(req, res)));

export default router;
