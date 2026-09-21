import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Settings as SettingsIcon, Bell, Shield, Smartphone, Globe, Cloud, Terminal, Save, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';

interface SettingsProps {
  user: User | null;
}

export default function Settings({ user }: SettingsProps) {
  const [activePanel, setActivePanel] = useState<'profile' | 'notifications' | 'security' | 'system'>('profile');

  const panels = [
    { id: 'profile', icon: SettingsIcon, label: 'Account Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security & Access' },
    { id: 'system', icon: Cloud, label: 'System Configuration' },
  ] as const;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm">Configure your personal preferences and system-wide parameters.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-gradient text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-medium/20 hover:brightness-110 transition-all active:scale-95">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex divide-x divide-slate-100">
        <div className="w-64 flex-shrink-0 bg-slate-50/50 p-4 space-y-1">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activePanel === panel.id 
                  ? "bg-white border border-slate-200 text-brand-dark shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              <panel.icon className={cn("w-4 h-4", activePanel === panel.id ? "text-brand-medium" : "text-slate-400")} />
              {panel.label}
            </button>
          ))}

          <div className="pt-8 px-4">
             <div className="bg-brand-medium/5 p-4 rounded-2xl border border-brand-medium/10">
               <div className="flex items-center gap-2 text-brand-dark mb-2">
                 <HelpCircle className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-wider">Need help?</span>
               </div>
               <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                 Check out our municipal infrastructure guide for best practices.
               </p>
             </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activePanel === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
                    <input 
                      disabled
                      type="text" 
                      value={user?.email || ''} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.displayName || 'Administrator'} 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Municipal Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Station ID</label>
                    <input 
                      type="text" 
                      defaultValue="STA-NY-CENTRAL" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Jurisdiction</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/20 transition-all font-medium">
                      <option>Metropolitan North</option>
                      <option>Downtown District</option>
                      <option>Western Precinct</option>
                    </select>
                  </div>
                </div>
              </section>

              <button 
                onClick={() => auth.signOut()}
                className="mt-8 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
              >
                Sign Out of Account
              </button>
            </div>
          )}

          {activePanel === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <h3 className="text-lg font-bold text-slate-900">Alert Preferences</h3>
               <div className="space-y-4">
                 {[
                   { label: 'Critical Infrastructure Breach', desc: 'Instant push alerts for major utility failures.', default: true },
                   { label: 'New Work Report Submitted', desc: 'Daily summary of citizen-reported issues.', default: true },
                   { label: 'Field Team Activity', desc: 'Real-time updates on workforce movement.', default: false },
                   { label: 'System Maintenance', desc: 'Alerts about InfraCare platform updates.', default: true },
                 ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
                      <div>
                        <p className="font-bold text-slate-800">{n.label}</p>
                        <p className="text-xs text-slate-500">{n.desc}</p>
                      </div>
                      <div className={cn(
                        "w-12 h-6 rounded-full relative transition-all cursor-pointer",
                        n.default ? "bg-brand-medium" : "bg-slate-200"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                          n.default ? "right-1" : "left-1"
                        )}></div>
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          )}

          {activePanel !== 'profile' && activePanel !== 'notifications' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Terminal className="w-8 h-8 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Advanced Config Restricted</h2>
              <p className="text-slate-500 max-w-sm text-sm">
                Access to {activePanel} settings requires multi-factor authentication (MFA) and master key level clearance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
