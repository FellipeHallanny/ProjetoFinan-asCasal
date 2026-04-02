import { Router } from 'express';
import { GoalController } from '@/controllers/GoalController';
import { GoalService } from '@/services/GoalService';
import { GoalRepository } from '@/repositories/GoalRepository';
import { TransactionService } from '@/services/TransactionService';
import { TransactionRepository } from '@/repositories/TransactionRepository';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { CreditCardRepository } from '@/repositories/CreditCardRepository';
import { requireAuth, requireFamilySpace } from '@/middleware/authMiddleware';
import { asyncErrorWrapper } from '@/utils/asyncErrorWrapper';

const router = Router();
const repository = new GoalRepository();
const txRepo = new TransactionRepository();
const catRepo = new CategoryRepository();
const cardRepo = new CreditCardRepository();
const txService = new TransactionService(txRepo, catRepo, cardRepo);

const service = new GoalService(repository, txService);
const controller = new GoalController(service);

router.use(requireAuth, requireFamilySpace);

router.post('/', asyncErrorWrapper((req, res) => controller.create(req, res)));
router.get('/', asyncErrorWrapper((req, res) => controller.list(req, res)));
router.post('/:id/deposit', asyncErrorWrapper((req, res) => controller.deposit(req, res)));
router.put('/:id', asyncErrorWrapper((req, res) => controller.update(req, res)));
router.delete('/:id', asyncErrorWrapper((req, res) => controller.delete(req, res)));

export default router;
