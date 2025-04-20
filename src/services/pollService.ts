import api from './api';
import { Poll, PollResult, VoteStatus, ApiResponse } from '@/types';

export const pollService = {
  // Get all polls (for organizer)
  getAllPolls: async (): Promise<Poll[]> => {
    const response = await api.get<ApiResponse<Poll[]>>('/polls');
    return response.data.data || [];
  },

  // Get available polls (for voter)
  getAvailablePolls: async (): Promise<Poll[]> => {
    const response = await api.get<ApiResponse<Poll[]>>('/polls/available');
    return response.data.data || [];
  },

  // Get poll by ID
  getPoll: async (id: string): Promise<Poll> => {
    const response = await api.get<ApiResponse<Poll>>(`/polls/${id}`);
    return response.data.data as Poll;
  },

  // Create poll
  createPoll: async (pollData: Omit<Poll, 'id' | 'createdAt' | 'createdBy' | 'status'>): Promise<Poll> => {
    const response = await api.post<ApiResponse<Poll>>('/polls', pollData);
    return response.data.data as Poll;
  },

  // Update poll
  updatePoll: async (id: string, pollData: Partial<Poll>): Promise<Poll> => {
    const response = await api.put<ApiResponse<Poll>>(`/polls/${id}`, pollData);
    return response.data.data as Poll;
  },

  // Delete poll
  deletePoll: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/polls/${id}`);
  },

  // Get poll results
  getPollResults: async (id: string): Promise<PollResult> => {
    const response = await api.get<ApiResponse<PollResult>>(`/polls/${id}/results`);
    return response.data.data as PollResult;
  },

  // Cast vote
  castVote: async (pollId: string, optionId: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/vote/${pollId}`, { optionId });
  },

  // Check vote status
  getVoteStatus: async (pollId: string): Promise<VoteStatus> => {
    const response = await api.get<ApiResponse<VoteStatus>>(`/vote/status/${pollId}`);
    return response.data.data as VoteStatus;
  },
};