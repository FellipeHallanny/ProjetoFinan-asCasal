import { apiClient } from './client';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'ACHIEVEMENT';
export type PaymentStatus = 'PENDING' | 'PAID';
export type PaidBy = 'M' | 'F' | 'BOTH';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: string;
  creditCardId?: string;
  paidBy?: PaidBy;
  status: PaymentStatus;
  installments?: { current: number; total: number };
}

export const getTransactions = async (filters?: { startDate?: string; endDate?: string }) => {
  const { data } = await apiClient.get('/transactions', { params: filters });
  return data.data as Transaction[];
};

export const createTransaction = async (txData: Partial<Transaction>) => {
  const { data } = await apiClient.post('/transactions', txData);
  return data.data;
};

export const updateTransaction = async (id: string, txData: Partial<Transaction>) => {
  const { data } = await apiClient.put(`/transactions/${id}`, txData);
  return data.data;
};

export const deleteTransaction = async (id: string) => {
  const { data } = await apiClient.delete(`/transactions/${id}`);
  return data.data;
};
