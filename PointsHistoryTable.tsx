import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Filter
} from 'lucide-react';
import { SaathiTransaction, Language } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { Input } from '../ui/Input';

interface PointsHistoryTableProps {
  transactions: SaathiTransaction[];
  totalPoints: number;
  lang: Language;
}

export const PointsHistoryTable: React.FC<PointsHistoryTableProps> = ({
  transactions,
  totalPoints,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Saathi Points Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent, tamper-evident record of all civic points credited and redeemed.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200 text-right self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-emerald-800">Verified Balance</div>
          <div className="text-lg font-black text-emerald-950">{totalPoints} Points</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="w-full sm:w-72">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activity or description..."
            prefixIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="sustainability">Sustainability (Green Commute)</option>
            <option value="civic_reporting">Civic Reporting</option>
            <option value="accessibility">Accessibility Barrier Resolution</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Activity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Points</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {tx.timestamp.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.activityName}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{tx.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium capitalize text-slate-600">
                        {tx.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                        tx.points >= 0 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {tx.points >= 0 ? `+${tx.points}` : tx.points} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <StatusBadge status={tx.verified ? 'Verified' : 'Pending'} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Receipt className="w-6 h-6" />}
            title="No ledger entries found"
            description="No transactions match your current search or filter query."
          />
        )}
      </div>

    </div>
  );
};
