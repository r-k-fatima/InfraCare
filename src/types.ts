export type Priority = 'very_high'|'high' | 'moderate' | 'low';
export type Status = 'pending' | 'in-progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  lat: number;
  lng: number;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface Assignment {
  id: string;
  workerId: string;
  issueId: string;
  assignedAt: string;
}
