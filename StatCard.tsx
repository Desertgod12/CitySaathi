import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'mint' | 'amber' | 'slate' | 'blue';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'emerald',
  highlight = false,
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-white',
      border: highlight ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-700',
      valueColor: 'text-emerald-950',
    },
    mint: {
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-800',
      valueColor: 'text-emerald-900',
    },
    amber: {
      bg: 'bg-white',
      border: 'border-amber-100',
      iconBg: 'bg-amber-50 text-amber-700',
      valueColor: 'text-slate-900',
    },
    blue: {
      bg: 'bg-white',
      border: 'border-sky-100',
      iconBg: 'bg-sky-50 text-sky-700',
      valueColor: 'text-slate-900',
    },
    slate: {
      bg: 'bg-white',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
    },
  }[variant];

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-sm ${variantStyles.bg} ${variantStyles.border}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${variantStyles.valueColor}`}>
              {value}
            </span>
            {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed pt-0.5">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
