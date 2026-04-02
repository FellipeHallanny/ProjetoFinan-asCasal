import { Router } from 'express';
import { CategoryController } from '@/controllers/CategoryController';
import { CategoryService } from '@/services/CategoryService';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { requireAuth, requireFamilySpace } from '@/middleware/authMiddleware';
import { asyncErrorWrapper } from '@/utils/asyncErrorWrapper';

const router = Router();
const repository = new CategoryRepository();
const service = new CategoryService(repository);
const controller = new CategoryController(service);

router.use(requireAuth, requireFamilySpace);

router.post('/', asyncErrorWrapper((req, res) => controller.create(req, res)));
router.get('/', asyncErrorWrapper((req, res) => controller.list(req, res)));
router.get('/patterns', asyncErrorWrapper((req, res) => controller.getPatterns(req, res)));
router.get('/suggest', asyncErrorWrapper((req, res) => controller.suggest(req, res)));
router.put('/:id', asyncErrorWrapper((req, res) => controller.update(req, res)));
router.delete('/:id', asyncErrorWrapper((req, res) => controller.delete(req, res)));

export default router;
