import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Eye,
  Camera,
  MapPin,
  Calendar,
  User,
  XCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { CivicContribution, Language, ReportStatus, UserProfile } from '../../types';
import { impactService } from '../../services/impactService';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface AuthorityConsoleViewProps {
  reports: CivicContribution[];
  currentUser: UserProfile;
  onReportUpdated: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const AuthorityConsoleView: React.FC<AuthorityConsoleViewProps> = ({
  reports,
  currentUser,
  onReportUpdated,
  lang,
}) => {
  const [selectedReport, setSelectedReport] = useState<CivicContribution | null>(reports[0] || null);
  const [officerNote, setOfficerNote] = useState<string>('Site inspection verified by Ward 14 Field Engineering Team.');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const isOfficer = currentUser.role === 'officer';

  const handleUpdateStatus = (targetStatus: ReportStatus) => {
    if (!selectedReport) return;

    try {
      const result = impactService.updateReportStatus(selectedReport.id, targetStatus, officerNote);
      
      setFeedback({
        text: `Ticket ${result.report.reportId || selectedReport.id} transitioned to "${targetStatus}". ${result.pointsEarned > 0 ? `Awarded ${result.pointsEarned} Saathi Points to citizen!` : ''}`,
        type: 'success',
      });

      setSelectedReport(result.report);
      onReportUpdated(result.newlyUnlockedBadges);
    } catch (err: any) {
      setFeedback({ text: err.message || 'Error updating status', type: 'error' });
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Municipal Authority Resolution Console
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Demo Console
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official municipal review desk for reviewing citizen reports, verifying photo evidence, and disbursing points.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
            Inspector: <strong className="text-slate-900">{isOfficer ? currentUser.name : 'Er. S. Verma (Simulated)'}</strong>
          </div>
        </div>
      </div>

      {/* 2. Notice Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Simulated Administrative Operations:</strong> Changes made here advance the municipal grievance workflow and automatically disburse Saathi Points to the citizen's auditable balance.
          </span>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="underline ml-4">Dismiss</button>
        </div>
      )}

      {/* 3. Main Console Layout: Left Queue, Right Inspection Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Complaints Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase text-slate-500">
              Grievance Intake Queue ({filteredReports.length})
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">All</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredReports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      ID: {r.reportId || r.id}
                    </span>
                    <StatusBadge status={r.status as any} size="sm" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {r.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[180px]">{r.location}</span>
                    <span className="font-mono text-[10px]">
                      {r.submittedAt ? r.submittedAt.slice(0, 10) : ((r as any).createdAt ? (r as any).createdAt.slice(0, 10) : 'Recently')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Inspection & Action Console */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
          {selectedReport ? (
            <>
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      ID: {selectedReport.reportId || selectedReport.id}
                    </span>
                    <StatusBadge status={selectedReport.status as any} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedReport.title}
                  </h3>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Reward on Resolution</span>
                  <strong className="text-emerald-800 font-black">
                    +{selectedReport.isAccessibilityIssue ? 40 : 25} Points
                  </strong>
                </div>
              </div>

              {/* Description & Metadata */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                    Citizen Description
                  </span>
                  <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Location</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedReport.location}</span>
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Category</span>
                    <span className="font-semibold text-slate-800 capitalize mt-0.5 block">
                      {selectedReport.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Evidence Photo Preview */}
                {selectedReport.imageUrl && (
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">
                      Submitted Photo Evidence
                    </span>
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-h-48 w-full bg-slate-100">
                      <img 
                        src={selectedReport.imageUrl} 
                        alt="Grievance evidence" 
                        className="w-full h-48 object-cover" 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inspection Officer Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Official Verification Note
                </label>
                <input
                  type="text"
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white"
                  placeholder="Enter remarks..."
                />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus('Verified' as ReportStatus)}
                    disabled={selectedReport.status === 'resolved' || selectedReport.status === 'verified'}
                    icon={<CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                  >
                    Mark Verified
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus('Resolved' as ReportStatus)}
                    disabled={selectedReport.status === 'resolved'}
                    icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  >
                    Resolve & Disburse Reward
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdateStatus('Rejected' as ReportStatus)}
                    disabled={selectedReport.status === 'resolved'}
                    icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
                  >
                    Reject Issue
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={<FileText className="w-6 h-6" />}
              title="No complaint selected"
              description="Select a report from the intake queue on the left to inspect its evidence and update its status."
            />
          )}
        </div>

      </div>

    </div>
  );
};
