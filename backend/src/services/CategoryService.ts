import { CategoryRepository, CategoryData } from '@/repositories/CategoryRepository';

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}
  
  async createCategory(familyId: string, data: CategoryData) {
    const id = await this.repository.create(familyId, data);
    return { id, ...data };
  }
  async getCategories(familyId: string) {
    return this.repository.findAll(familyId);
  }
  async updateCategory(familyId: string, categoryId: string, data: Partial<CategoryData>) {
    await this.repository.update(familyId, categoryId, data);
    return { id: categoryId, ...data };
  }
  async deleteCategory(familyId: string, categoryId: string) {
    await this.repository.delete(familyId, categoryId);
    return { success: true };
  }
  async suggestCategory(familyId: string, description: string) {
    return this.repository.suggest(familyId, description);
  }
  async getCategoryPatterns(familyId: string) {
    return this.repository.findAllPatterns(familyId);
  }
}
