import { Search, Bell, User } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-[56px] bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports, IDs, or locations..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-brand-medium focus:border-brand-medium transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-4">
           <span className="text-[13px] font-medium text-slate-900">Welcome, Admin Jane</span>
           <div className="w-7 h-7 bg-purple-gradient rounded-full border border-brand-light flex items-center justify-center text-white text-[10px] font-bold">
             JD
           </div>
        </div>
      </div>
    </header>
  );
}
