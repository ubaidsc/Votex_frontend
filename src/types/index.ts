export type UserRole = 'organizer' | 'voter';

export interface User {
  id: string;
  name: string;
  email?: string;
  cnic?: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Voter {
  id: string;
  name: string;
  cnic: string;
  email: string;
  isActive: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount?: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  deadline: string;
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  createdBy: string;
}

export interface VoteStatus {
  hasVoted: boolean;
  optionId?: string;
}

export interface PollResult {
  pollId: string;
  pollTitle: string;
  totalVotes: number;
  options: {
    id: string;
    text: string;
    voteCount: number;
    percentage: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}