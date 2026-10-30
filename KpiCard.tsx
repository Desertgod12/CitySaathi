import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon,
  iconBgColor = 'bg-emerald-50',
  iconColor = 'text-emerald-700',
  onClick,
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs sm:text-sm font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-[11px] font-medium text-slate-400 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
};
