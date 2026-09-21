import { db } from './src/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const mockIssues = [
  {
    title: 'Burst Pipe',
    description: 'Main water line burst at intersection.',
    priority: 'high',
    status: 'pending',
    lat: 28.6139,
    lng: 77.2090,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Broken Streetlight',
    description: 'Streetlight out on Janpath.',
    priority: 'low',
    status: 'pending',
    lat: 28.6250,
    lng: 77.2200,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Pothole Alert',
    description: 'Large pothole forming near Lodhi Circle.',
    priority: 'medium',
    status: 'in-progress',
    lat: 28.5900,
    lng: 77.2100,
    createdAt: new Date().toISOString()
  }
];

const mockWorkers = [
  { name: 'James Wilson', isAvailable: true },
  { name: 'Sarah Chen', isAvailable: true },
  { name: 'Michael Brown', isAvailable: true }
];

export async function seedDatabase() {
  const issuesSnap = await getDocs(collection(db, 'issues'));
  if (issuesSnap.empty) {
    console.log('Seeding issues...');
    for (const issue of mockIssues) {
      await addDoc(collection(db, 'issues'), issue);
    }
  }

  const workersSnap = await getDocs(collection(db, 'workers'));
  if (workersSnap.empty) {
    console.log('Seeding workers...');
    for (const worker of mockWorkers) {
      await addDoc(collection(db, 'workers'), worker);
    }
  }
}
