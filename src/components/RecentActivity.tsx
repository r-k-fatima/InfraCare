import { Issue } from '../types';
import { cn } from '../lib/utils';
import { MoreHorizontal, Filter } from 'lucide-react';

interface RecentActivityProps {
  issues: Issue[];
}

export default function RecentActivity({ issues }: RecentActivityProps) {
  const recentIssues = [...issues].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-[#d1fae5] text-[#065f46]';
      case 'in-progress': return 'bg-[#fef3c7] text-[#92400e]';
      case 'pending': return 'bg-[#fee2e2] text-[#991b1b]';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-400';
      case 'low': return 'bg-brand-medium';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full min-h-[220px]">
      <div className="p-3 px-4 border-b border-slate-200 font-bold text-sm bg-purple-gradient text-white">
        Recent Activity
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase w-[100px]">Report ID</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase w-[150px]">Issue Type</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase w-[200px]">Location</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase w-[120px]">Status</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-600 uppercase">Date Reported</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentIssues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-4 py-2.5 text-xs font-bold text-brand-dark">{issue.id}</td>
                <td className="px-4 py-2.5 text-xs font-medium text-slate-900 truncate">{issue.title}</td>
                <td className="px-4 py-2.5 text-xs text-slate-600 truncate">North St, Sector 4</td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
                    getStatusBadge(issue.status)
                  )}>
                    {issue.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
