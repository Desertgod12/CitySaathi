import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Building2,
  Sparkles
} from 'lucide-react';
import { CivicContribution, Language, ReportStatus } from '../../types';
import { impactService } from '../../services/impactService';

interface DemoAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reports: CivicContribution[];
  onReportUpdated: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const DemoAdminDrawer: React.FC<DemoAdminDrawerProps> = ({
  isOpen,
  onClose,
  reports,
  onReportUpdated,
  lang,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<ReportStatus>('Resolved');
  const [adminNote, setAdminNote] = useState<string>('Verified and resolved by Ward 14 Field Officer.');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleUpdate = () => {
    if (!selectedReportId) {
      setStatusMessage({ text: 'Please select a report first.', type: 'error' });
      return;
    }

    try {
      const result = impactService.updateReportStatus(selectedReportId, targetStatus, adminNote);
      setStatusMessage({
        text: `Report ${result.report.reportId} updated to "${targetStatus}". ${result.pointsEarned > 0 ? `Awarded ${result.pointsEarned} Saathi Points!` : ''}`,
        type: 'success',
      });
      onReportUpdated(result.newlyUnlockedBadges);
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error updating report', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-emerald-100">
        
        {/* Header */}
        <div className="p-6 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800/80 rounded-xl">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Authorized Demo Admin</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-400 text-slate-950">
                  Demo Tool
                </span>
              </div>
              <p className="text-xs text-emerald-200">Municipal Verification Simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-4 bg-amber-50 border-b border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>For Hackathon Presentation:</strong> In real deployment, status updates are triggered by municipal APIs. Here you can simulate an inspector verifying and resolving civic complaints to test the real-time reward pipeline!
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Select Civic Report to Update
            </label>
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white"
            >
              <option value="">-- Choose a Complaint --</option>
              {reports.map((r) => (
                <option key={r.reportId} value={r.reportId}>
                  [{r.reportId}] {r.title.slice(0, 35)}... ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              New Resolution Status
            </label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as ReportStatus)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white"
            >
              <option value="Submitted">Submitted (0 pts)</option>
              <option value="Under Review">Under Review (0 pts)</option>
              <option value="Verified">Verified by Field Team (0 pts)</option>
              <option value="In Progress">In Progress (0 pts)</option>
              <option value="Resolved">Resolved (Eligible for Reward! ⭐)</option>
              <option value="Rejected">Rejected (Ineligible)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              Official Resolution Notes
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white resize-none"
              placeholder="e.g., Physical ramp cleared and slope leveled compliant with CPWD norms."
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Reward Trigger Rules:</span>
            </div>
            <p>• Standard Civic Fix: <strong>+25 Saathi Points</strong></p>
            <p>• Accessibility Barrier Fix: <strong>+40 Saathi Points</strong></p>
            <p>• Duplicate resolution calls on the same report are blocked.</p>
          </div>

        </div>

        {/* Footer Button */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleUpdate}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Apply Status & Trigger Reward</span>
          </button>
        </div>

      </div>
    </div>
  );
};
