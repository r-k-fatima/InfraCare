import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { Issue } from '../types';

interface ActiveReportsProps {
  issues: Issue[];
  onAssign: (issue: Issue) => void;
}

export default function ActiveReports({ issues, onAssign }: ActiveReportsProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || 
                          issue.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || issue.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-brand-medium" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      default: return 'text-brand-dark bg-brand-light/30';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active Reports</h1>
          <p className="text-slate-500 text-sm">Monitor and manage all regional infrastructure reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-medium/20 transition-all w-64 shadow-sm"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'pending', 'in-progress', 'resolved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all",
              filter === s 
                ? "bg-brand-medium text-white shadow-md shadow-brand-medium/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-brand-medium/50"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{issue.id}</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(issue.status)}
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                    getPriorityColor(issue.priority)
                  )}>
                    {issue.priority}
                  </span>
                </div>
              </div>
              
              <h3 className="font-bold text-slate-900 line-clamp-1">{issue.title}</h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">{issue.description}</p>
              
              <div className="flex items-center gap-2 mt-4 text-slate-400 text-xs">
                <MapPin className="w-3 h-3" />
                <span>Sector {Math.floor(issue.lat % 10)}, Area {Math.floor(issue.lng % 5)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
              {issue.status !== 'resolved' && (
                <button
                  onClick={() => onAssign(issue)}
                  className="text-xs font-bold text-brand-medium hover:text-brand-dark transition-all px-3 py-1.5 rounded-lg hover:bg-brand-light/10"
                >
                  Assign Field Team
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900">No reports found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
