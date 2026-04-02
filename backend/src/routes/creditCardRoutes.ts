import { Router } from 'express';
import { CreditCardController } from '@/controllers/CreditCardController';
import { CreditCardService } from '@/services/CreditCardService';
import { CreditCardRepository } from '@/repositories/CreditCardRepository';
import { requireAuth, requireFamilySpace } from '@/middleware/authMiddleware';
import { asyncErrorWrapper } from '@/utils/asyncErrorWrapper';

const router = Router();
const repository = new CreditCardRepository();
const service = new CreditCardService(repository);
const controller = new CreditCardController(service);

router.use(requireAuth, requireFamilySpace);

router.post('/', asyncErrorWrapper((req, res) => controller.create(req, res)));
router.get('/', asyncErrorWrapper((req, res) => controller.list(req, res)));
router.put('/:id', asyncErrorWrapper((req, res) => controller.update(req, res)));
router.delete('/:id', asyncErrorWrapper((req, res) => controller.delete(req, res)));

export default router;
