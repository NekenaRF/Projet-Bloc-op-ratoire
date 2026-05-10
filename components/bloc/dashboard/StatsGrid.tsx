import { StatCard } from "@/types/bloc";

interface StatsGridProps {
  stats: StatCard[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white rounded-xl shadow-sm border border-outline-variant/10 p-6 flex items-center gap-4 transition-all hover:shadow-md"
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${getIconBgColor(stat.color)}`}>
            <span className={`material-symbols-outlined text-2xl ${getIconTextColor(stat.color)}`}>
              {stat.icon}
            </span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-on-surface tracking-tight">
              {stat.value}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              {stat.label}
            </p>
            <p className="text-[10px] font-medium text-outline flex items-center gap-1 mt-0.5">
              {stat.subLabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getIconBgColor(color: string) {
  switch (color) {
    case 'primary': return 'bg-primary/10';
    case 'secondary': return 'bg-secondary/10';
    case 'emerald-600': return 'bg-emerald-500/10';
    case 'tertiary': return 'bg-tertiary/10';
    default: return 'bg-slate-100';
  }
}

function getIconTextColor(color: string) {
  switch (color) {
    case 'primary': return 'text-primary';
    case 'secondary': return 'text-secondary';
    case 'emerald-600': return 'text-emerald-600';
    case 'tertiary': return 'text-tertiary';
    default: return 'text-slate-600';
  }
}
