import { LayoutDashboard, AlertCircle, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'reports', label: 'Active Reports', icon: AlertCircle },
  { id: 'users', label: 'Identity & Access', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out of the Command Center?')) {
      auth.signOut();
    }
  };

  return (
    <aside className="w-[220px] h-screen bg-slate-800 text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-700 flex-shrink-0 z-30">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700 bg-purple-gradient">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
           <span>🌉</span>
           InfraCare
        </h1>
      </div>

      <nav className="flex-1 mt-6 space-y-1 text-sm px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              activeTab === item.id 
                ? "bg-brand-medium text-white shadow-lg shadow-brand-medium/20" 
                : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
            )}
          >
            <item.icon className={cn("w-4 h-4 transition-colors", activeTab === item.id ? "text-white" : "text-slate-500")} />
            <span className="font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
