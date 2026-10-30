import React from 'react';
import { ContributionStatus } from '../../types';

interface StatusBadgeProps {
  status: ContributionStatus | 'Active' | 'Locked' | 'Verified' | 'Pending';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const styles: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
    'submitted': {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
      label: 'Submitted'
    },
    'under_review': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Under Review'
    },
    'verified': {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
      label: 'Verified'
    },
    'in_progress': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      dot: 'bg-indigo-500',
      label: 'In Progress'
    },
    'resolved': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
      label: 'Resolved'
    },
    'rejected': {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      label: 'Rejected'
    },
    'Active': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-600',
      label: 'Active'
    },
    'Locked': {
      bg: 'bg-slate-100',
      text: 'text-slate-500',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
      label: 'Locked'
    },
    'Pending': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Pending'
    },
    'Verified': {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      dot: 'bg-sky-500',
      label: 'Verified'
    }
  };

  const config = styles[status] || styles['submitted'];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
