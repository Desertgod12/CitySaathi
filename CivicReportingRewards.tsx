import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  PlusCircle, 
  Filter,
  Eye,
  Camera,
  Accessibility,
  ArrowRight
} from 'lucide-react';
import { CivicContribution, Language } from '../../types';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface CivicReportingRewardsProps {
  reports: CivicContribution[];
  onOpenReportModal: () => void;
  onOpenAdminSimulator: () => void;
  onReportUpdated: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const CivicReportingRewards: React.FC<CivicReportingRewardsProps> = ({
  reports,
  onOpenReportModal,
  onOpenAdminSimulator,
  onReportUpdated,
  lang,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = reports.filter(r => {
    if (filterCategory !== 'all') {
      if (filterCategory === 'accessibility' && !r.isAccessibilityIssue) return false;
      if (filterCategory !== 'accessibility' && r.category !== filterCategory) return false;
    }
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Anti-Cheat / Scoring Policy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Civic Grievance Rewards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track status of lodged issues and earn verified Saathi Points upon municipal resolution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="sm"
            onClick={onOpenReportModal}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            Submit New Report
          </Button>
        </div>
      </div>

      {/* 2. Verification Policy Info Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Official Policy:</strong> 0 points for filing. Resolution rewards (+25 pts civic, +40 pts accessibility) are credited only after municipal engineering inspection.
          </span>
        </div>
        <button
          onClick={onOpenAdminSimulator}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline self-start sm:self-auto shrink-0"
        >
          Open Authority Console
        </button>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="accessibility">Accessibility Only</option>
            <option value="road_safety">Road & Pavements</option>
            <option value="sanitation">Sanitation</option>
            <option value="lighting">Public Lighting</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing {filteredReports.length} of {reports.length} reports
        </span>
      </div>

      {/* 4. Reports List */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div 
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      ID: {report.ticketId || report.id}
                    </span>
                    {report.isAccessibilityIssue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                        <Accessibility className="w-3 h-3" />
                        <span>Accessibility Barrier</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1">
                    {report.title}
                  </h3>
                </div>

                <StatusBadge status={report.status as any} size="sm" />
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {report.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{report.location}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 shrink-0">
                  {report.submittedAt ? report.submittedAt.slice(0, 10) : ((report as any).createdAt ? (report as any).createdAt.slice(0, 10) : 'Recently')}
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Reward Status:</span>
                {report.status.toLowerCase() === 'resolved' ? (
                  <span className="font-black text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+{report.pointsAwarded ?? (report as any).rewardPoints ?? (report.isAccessibilityIssue ? 40 : 25)} Saathi Points Credited</span>
                  </span>
                ) : (
                  <span className="text-slate-500 font-semibold">
                    0 pts (Eligible for +{report.isAccessibilityIssue ? 40 : 25} pts on resolution)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<AlertCircle className="w-6 h-6" />}
          title="No reports match this filter"
          description="Try changing your filter settings or submit a new civic complaint."
          actionLabel="Submit New Report"
          onAction={onOpenReportModal}
        />
      )}

    </div>
  );
};
