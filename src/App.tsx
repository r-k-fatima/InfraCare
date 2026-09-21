import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import KPICards from './components/KPICards';
import MapSection from './components/MapSection';
import RecentActivity from './components/RecentActivity';
import WorkforceManagement from './components/WorkforceManagement';
import ActiveReports from './components/ActiveReports';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import { Issue } from './types';
import { useFirebase } from './components/FirebaseProvider';
import { LogIn } from 'lucide-react';
import { seedDatabase } from '../seed';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading, issues, workers, assignments, addWorker, assignTask, completeTask } = useFirebase();
  const [assigningIssue, setAssigningIssue] = useState<Issue | null>(null);

  // Auto-seed database if empty (for first time users)
  useEffect(() => {
    seedDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* KPI Section */}
            <KPICards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[320px] flex-shrink-0">
              {/* Map Section (60%) */}
              <div className="lg:col-span-3">
                <MapSection 
                  issues={issues.filter(i => i.status !== 'resolved')} 
                  onAssignClick={(issue) => setAssigningIssue(issue)}
                />
              </div>

              {/* Workforce Management (40%) */}
              <div className="lg:col-span-2">
                <WorkforceManagement 
                  workers={workers}
                  assignments={assignments}
                  issues={issues}
                  onAddWorker={addWorker}
                  onAssign={assignTask}
                  onComplete={completeTask}
                  assigningIssue={assigningIssue}
                  setAssigningIssue={setAssigningIssue}
                />
              </div>
            </div>

            {/* Secondary Content Section */}
            <div className="flex-1 min-h-[220px]">
              <RecentActivity issues={issues} />
            </div>
          </>
        );
      case 'reports':
        return <ActiveReports issues={issues} onAssign={setAssigningIssue} />;
      case 'users':
        return <UserManagement workers={workers} onAdd={addWorker} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <div>Tab not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-[220px] flex flex-col h-screen overflow-hidden">
        <TopNav />
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 flex flex-col animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
