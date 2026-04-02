import { apiClient } from './client';

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  usedLimit: number;
  closingDay: number;
  dueDay: number;
}

export const getCreditCards = async () => {
  const { data } = await apiClient.get('/credit-cards');
  return data.data as CreditCard[];
};

export const createCreditCard = async (cardData: Partial<CreditCard>) => {
  const { data } = await apiClient.post('/credit-cards', cardData);
  return data.data;
};

export const updateCreditCard = async (id: string, cardData: Partial<CreditCard>) => {
  const { data } = await apiClient.put(`/credit-cards/${id}`, cardData);
  return data.data;
};

export const deleteCreditCard = async (id: string) => {
  const { data } = await apiClient.delete(`/credit-cards/${id}`);
  return data.data;
};
