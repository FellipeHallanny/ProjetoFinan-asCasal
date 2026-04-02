import { apiClient } from './client';

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export const getGoals = async () => {
  const { data } = await apiClient.get('/goals');
  return data.data as Goal[];
};

export const createGoal = async (goalData: Partial<Goal>) => {
  const { data } = await apiClient.post('/goals', goalData);
  return data.data;
};

export const updateGoal = async (id: string, goalData: Partial<Goal>) => {
  const { data } = await apiClient.put(`/goals/${id}`, goalData);
  return data.data;
};

export const deleteGoal = async (id: string) => {
  const { data } = await apiClient.delete(`/goals/${id}`);
  return data.data;
};

export const depositGoal = async (id: string, amount: number, description?: string) => {
  const { data } = await apiClient.post(`/goals/${id}/deposit`, { amount, description });
  return data.data;
};
