import { Response } from 'express';
import { BaseController } from './BaseController';
import { CategoryService } from '@/services/CategoryService';
import { createCategorySchema, updateCategorySchema, suggestCategorySchema } from '@/validators/category.schema';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

export class CategoryController extends BaseController {
  constructor(private readonly service: CategoryService) {
    super();
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = createCategorySchema.parse(req.body);
      const result = await this.service.createCategory(req.user!.familyId!, data);
      this.handleSuccess(res, result, 201, 'Category created');
    } catch (error) { this.handleError(error, res, 'CategoryController.create'); }
  }

  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await this.service.getCategories(req.user!.familyId!);
      this.handleSuccess(res, result, 200);
    } catch (error) { this.handleError(error, res, 'CategoryController.list'); }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = updateCategorySchema.parse(req.body);
      const result = await this.service.updateCategory(req.user!.familyId!, id, data);
      this.handleSuccess(res, result, 200, 'Category updated');
    } catch (error) { this.handleError(error, res, 'CategoryController.update'); }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.service.deleteCategory(req.user!.familyId!, id);
      this.handleSuccess(res, null, 200, 'Category deleted');
    } catch (error) { this.handleError(error, res, 'CategoryController.delete'); }
  }

  async suggest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { description } = suggestCategorySchema.parse(req.query);
      const result = await this.service.suggestCategory(req.user!.familyId!, description);
      this.handleSuccess(res, result, 200);
    } catch (error) { this.handleError(error, res, 'CategoryController.suggest'); }
  }

  async getPatterns(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await this.service.getCategoryPatterns(req.user!.familyId!);
      this.handleSuccess(res, result, 200);
    } catch (error) { this.handleError(error, res, 'CategoryController.getPatterns'); }
  }
}
