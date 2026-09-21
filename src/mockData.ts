import { Issue, Worker } from './types';

export const mockIssues: Issue[] = [
  {
    id: 'REP-001',
    title: 'Burst Pipe',
    description: 'Main water line burst at intersection.',
    priority: 'high',
    status: 'pending',
    lat: 40.7128,
    lng: -74.0060,
    createdAt: '2024-03-15T08:30:00Z'
  },
  {
    id: 'REP-002',
    title: 'Broken Streetlight',
    description: 'Streetlight out on 5th Ave.',
    priority: 'low',
    status: 'pending',
    lat: 40.7589,
    lng: -73.9851,
    createdAt: '2024-03-15T09:15:00Z'
  },
  {
    id: 'REP-003',
    title: 'Pothole Alert',
    description: 'Large pothole forming near Central Park.',
    priority: 'medium',
    status: 'in-progress',
    lat: 40.7812,
    lng: -73.9665,
    createdAt: '2024-03-15T10:45:00Z'
  },
  {
    id: 'REP-004',
    title: 'Exposed Wiring',
    description: 'Electrical junction box left open.',
    priority: 'high',
    status: 'pending',
    lat: 40.7306,
    lng: -73.9352,
    createdAt: '2024-03-15T11:20:00Z'
  },
  {
    id: 'REP-005',
    title: 'Graffiti Removal',
    description: 'Vandalism on public monument.',
    priority: 'low',
    status: 'resolved',
    lat: 40.7061,
    lng: -73.9969,
    createdAt: '2024-03-14T15:00:00Z'
  }
];

export const mockWorkers: Worker[] = [
  { id: 'W-01', name: 'James Wilson', isAvailable: true },
  { id: 'W-02', name: 'Sarah Chen', isAvailable: true },
  { id: 'W-03', name: 'Michael Brown', isAvailable: true },
  { id: 'W-04', name: 'Elena Rodriguez', isAvailable: true },
  { id: 'W-05', name: 'David Kim', isAvailable: true }
];
