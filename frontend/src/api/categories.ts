import { apiClient } from './client';

export interface CategoryPattern {
  id: string; // word
  suggestions: Record<string, number>;
}

export const getCategoryPatterns = async () => {
  const { data } = await apiClient.get('/categories/patterns');
  return data.data as CategoryPattern[];
};
