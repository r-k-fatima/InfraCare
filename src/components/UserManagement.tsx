import React, { useState } from 'react';
import { Users, UserPlus, Shield, UserCheck, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { Worker } from '../types';

interface UserManagementProps {
  workers: Worker[];
  onAdd: (name: string) => void;
}

export default function UserManagement({ workers, onAdd }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'field' | 'admin'>('field');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkerName.trim()) {
      onAdd(newWorkerName);
      setNewWorkerName('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Identity & Access</h1>
          <p className="text-slate-500 text-sm">Manage administrative roles and field workforce permissions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-purple-gradient text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-medium/20 hover:brightness-110 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('field')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px]",
            activeTab === 'field' ? "border-brand-medium text-brand-dark" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Field Workforce ({workers.length})
        </button>
        <button 
          onClick={() => setActiveTab('admin')}
          className={cn(
            "px-6 py-3 text-sm font-bold transition-all border-b-2 -mb-[2px]",
            activeTab === 'admin' ? "border-brand-medium text-brand-dark" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          Admin Personnel (1)
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'field' ? (
                workers.map(worker => (
                  <tr key={worker.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-light/30 rounded-xl flex items-center justify-center font-bold text-brand-dark text-sm">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{worker.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">{worker.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <UserCheck className="w-3.5 h-3.5 text-brand-medium" />
                        Field Maintenance
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        worker.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        {worker.isAvailable ? 'Available' : 'On-Duty'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          <span>{worker.name.toLowerCase().replace(' ', '.')}@city.gov</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-slate-50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-gradient rounded-xl flex items-center justify-center font-bold text-white text-sm">
                        RJ
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Primary Admin</p>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">USR-ALPHA-1</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <Shield className="w-3.5 h-3.5 text-brand-medium" />
                      System Administrator
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] bg-brand-light/30 text-brand-dark font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />
                        <span>admin@infracare.io</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add Field Personnel</h2>
              <p className="text-slate-500 text-sm mt-1">Register a new worker to the active field roster.</p>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">Worker Full Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  placeholder="e.g. Robert Martin"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-medium/20 text-sm transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-purple-gradient text-white rounded-xl font-bold shadow-lg shadow-brand-medium/20 hover:brightness-110 transition-all"
                >
                  Add Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
