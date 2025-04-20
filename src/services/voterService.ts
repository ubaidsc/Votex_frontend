import api from './api';
import { Voter, ApiResponse } from '@/types';

export const voterService = {
  // Get all voters
  getAllVoters: async (): Promise<Voter[]> => {
    const response = await api.get<ApiResponse<Voter[]>>('/voters');
    return response.data.data || [];
  },

  // Get voter by ID
  getVoter: async (id: string): Promise<Voter> => {
    const response = await api.get<ApiResponse<Voter>>(`/voters/${id}`);
    return response.data.data as Voter;
  },

  // Create voter
  createVoter: async (voterData: Omit<Voter, 'id' | 'isActive'>): Promise<Voter> => {
    const response = await api.post<ApiResponse<Voter>>('/voters', voterData);
    return response.data.data as Voter;
  },

  // Update voter
  updateVoter: async (id: string, voterData: Partial<Voter>): Promise<Voter> => {
    const response = await api.put<ApiResponse<Voter>>(`/voters/${id}`, voterData);
    return response.data.data as Voter;
  },

  // Delete voter
  deleteVoter: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/voters/${id}`);
  },

  // Reset voter password
  resetVoterPassword: async (id: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/voters/${id}/reset-password`);
  },
};