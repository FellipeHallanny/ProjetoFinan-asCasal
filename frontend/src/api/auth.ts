import { apiClient } from './client';

export const createSpace = async (familyName: string) => {
  const { data } = await apiClient.post('/auth/space/create', { familyName });
  return data.data;
};

export const joinSpace = async (inviteCode: string) => {
  const { data } = await apiClient.post('/auth/space/join', { inviteCode });
  return data.data;
};
