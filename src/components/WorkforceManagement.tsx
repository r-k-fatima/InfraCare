import React, { useState } from 'react';
import { Worker, Assignment, Issue } from '../types';
import { UserPlus, CheckCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorkforceManagementProps {
  workers: Worker[];
  assignments: Assignment[];
  issues: Issue[];
  onAddWorker: (name: string) => void;
  onAssign: (workerId: string, issueId: string) => void;
  onComplete: (assignmentId: string) => void;
  assigningIssue: Issue | null;
  setAssigningIssue: (issue: Issue | null) => void;
}

export default function WorkforceManagement({
  workers,
  assignments,
  issues,
  onAddWorker,
  onAssign,
  onComplete,
  assigningIssue,
  setAssigningIssue
}: WorkforceManagementProps) {
  const [newWorkerName, setNewWorkerName] = useState('');

  const availableWorkers = workers.filter(w => w.isAvailable);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkerName.trim()) {
      onAddWorker(newWorkerName.trim());
      setNewWorkerName('');
    }
  };

  const activeAssignmentsData = assignments.map(a => {
    const worker = workers.find(w => w.id === a.workerId);
    const issue = issues.find(i => i.id === a.issueId);
    return { ...a, workerName: worker?.name, issueTitle: issue?.title };
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-3 px-4 border-b border-slate-200 font-bold text-sm bg-purple-gradient text-white">
        Smart Workforce
      </div>
      
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Add Worker</label>
          <form onSubmit={handleAddWorker} className="flex gap-1.5">
            <input
              type="text"
              value={newWorkerName}
              onChange={(e) => setNewWorkerName(e.target.value)}
              placeholder="Enter name..."
              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-medium transition-all"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-gradient text-white rounded text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              Add
            </button>
          </form>
        </div>

        {assigningIssue && (
          <div className="p-3 bg-brand-light/20 border border-brand-light/30 rounded">
            <label className="text-[11px] font-bold text-brand-dark uppercase mb-1 block">Assign Task: {assigningIssue.id}</label>
            <div className="flex gap-1.5">
              <select
                className="flex-1 px-2 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-medium"
                onChange={(e) => {
                  if (e.target.value) {
                    onAssign(e.target.value, assigningIssue.id);
                    setAssigningIssue(null);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select worker...</option>
                {availableWorkers.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <button
                onClick={() => setAssigningIssue(null)}
                className="px-2 py-1.5 bg-white border border-slate-200 text-slate-600 rounded text-xs font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="pt-2">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-tight block mb-2">Active Assignments</label>
          <table className="w-full text-left worker-table">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pr-2 py-2 text-[10px] font-bold text-slate-500 uppercase">Worker</th>
                <th className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase">Task</th>
                <th className="pl-2 py-2 text-[10px] font-bold text-slate-500 uppercase text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeAssignmentsData.map((assignment) => (
                <tr key={assignment.id} className="text-[11px]">
                  <td className="pr-2 py-2 text-slate-900 font-medium">{assignment.workerName?.split(' ')[0]} {assignment.workerName?.split(' ')[1]?.charAt(0)}.</td>
                  <td className="px-2 py-2 text-slate-600">{assignment.issueId}</td>
                  <td className="pl-2 py-2 text-right">
                    <button
                      onClick={() => onComplete(assignment.id)}
                      className="px-2 py-1 bg-brand-medium text-white rounded text-[9px] font-bold hover:bg-brand-dark transition-all"
                    >
                      Done
                    </button>
                  </td>
                </tr>
              ))}
              {activeAssignmentsData.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 italic text-[10px]">No active tasks</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
