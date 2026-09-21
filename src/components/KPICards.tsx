import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  color: string;
}

const stats: Stat[] = [
  {
    label: 'Total Reports',
    value: '1,284',
    change: '+12%',
    isPositive: true,
    icon: AlertCircle,
    color: 'text-brand-medium bg-indigo-50'
  },
  {
    label: 'Pending Tasks',
    value: '42',
    change: '-5%',
    isPositive: true,
    icon: Clock,
    color: 'text-amber-600 bg-amber-50'
  },
  {
    label: 'Resolved Issues',
    value: '956',
    change: '+18%',
    isPositive: true,
    icon: CheckCircle2,
    color: 'text-emerald-600 bg-emerald-50'
  },
  {
    label: 'Avg Resolution',
    value: '4.2h',
    change: '-22%',
    isPositive: true,
    icon: MapPin,
    color: 'text-slate-600 bg-slate-50'
  }
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-4 gap-3 h-[85px] flex-shrink-0">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={cn(
            "p-3 px-4 rounded-lg border shadow-sm flex flex-col justify-between transition-hover",
            stat.label === 'Total Reports' 
              ? "bg-purple-gradient border-brand-light text-white" 
              : "bg-white border-slate-200 text-slate-900"
          )}
        >
          <p className={cn(
            "text-[11px] font-bold uppercase tracking-tight",
            stat.label === 'Total Reports' ? "text-white/80" : "text-slate-600"
          )}>
            {stat.label}
          </p>
          <h3 className={cn(
            "text-2xl font-bold mt-1",
            stat.label === 'Total Reports' ? "text-white" :
            stat.label === 'Pending Tasks' ? "text-red-500" : 
            stat.label === 'Resolved Issues' ? "text-emerald-500" : "text-slate-900"
          )}>
            {stat.value.split(' ')[0]}
          </h3>
        </div>
      ))}
    </div>
  );
}
