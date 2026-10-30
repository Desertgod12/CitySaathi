import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Building2, 
  Clock, 
  FileText, 
  ArrowRight,
  Accessibility,
  Share2
} from 'lucide-react';
import { CivicContribution, Language } from '../../types';

interface ComplaintAcceptedModalProps {
  report: CivicContribution | null;
  onClose: () => void;
  onTrackComplaint?: () => void;
  lang: Language;
}

export const ComplaintAcceptedModal: React.FC<ComplaintAcceptedModalProps> = ({
  report,
  onClose,
  onTrackComplaint,
  lang,
}) => {
  if (!report) return null;

  const isAccess = report.isAccessibilityIssue;
  const rewardPoints = isAccess ? 40 : 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-200 border border-emerald-400/30">
                Official MCD Acknowledgment
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {lang === 'hi' ? 'नागरिक शिकायत स्वीकृत की गई!' : 'Civic Complaint Accepted!'}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto flex-1">
          
          {/* Tracking Ticket Number Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Unique Tracking Ticket ID
              </p>
              <p className="text-2xl font-black font-mono text-emerald-950 tracking-tight">
                {report.reportId}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Accepted & In System</span>
              </span>
            </div>
          </div>

          {/* 5-Stage LifeCycle Progress Tracker */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {lang === 'hi' ? 'समाधान जीवनचक्र प्रगति' : 'Complaint Resolution Progress Tracker'}
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              {/* Step 1: Filed */}
              <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900">
                <div className="w-5 h-5 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold mb-1">
                  ✓
                </div>
                <p className="text-[11px] font-bold">1. Filed</p>
                <p className="text-[9px] text-emerald-700">Received</p>
              </div>

              {/* Step 2: Accepted (Active) */}
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400">
                <div className="w-5 h-5 mx-auto rounded-full bg-white text-emerald-800 flex items-center justify-center text-[10px] font-bold mb-1 animate-pulse">
                  ●
                </div>
                <p className="text-[11px] font-bold">2. Accepted</p>
                <p className="text-[9px] text-emerald-100">Acknowledged</p>
              </div>

              {/* Step 3: Inspection */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <div className="w-5 h-5 mx-auto rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold mb-1">
                  3
                </div>
                <p className="text-[11px] font-medium">3. Inspection</p>
                <p className="text-[9px] text-slate-400">Field visit</p>
              </div>

              {/* Step 4: Resolved */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <div className="w-5 h-5 mx-auto rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold mb-1">
                  ⭐
                </div>
                <p className="text-[11px] font-medium">4. Resolved</p>
                <p className="text-[9px] text-slate-400">+{rewardPoints} pts</p>
              </div>
            </div>
          </div>

          {/* Detailed Receipt Information */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-600">Issue Title:</span>
              <span className="font-bold text-slate-900 text-right max-w-xs">{report.title}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-600">Category & Priority:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                {isAccess && <Accessibility className="w-3.5 h-3.5 text-teal-600" />}
                <span>{report.category.replace('_', ' ').toUpperCase()} • {report.priority || 'High'}</span>
              </span>
            </div>

            <div className="flex items-start justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-600">Assigned Municipal Authority:</span>
              <span className="font-bold text-emerald-900 text-right max-w-xs">
                {report.assignedDepartment || 'Ward 14 Engineering & Accessibility Cell'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-600">Geotagged Location:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1 text-right max-w-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{report.location}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Acknowledgment Timestamp:</span>
              <span className="font-mono text-slate-700">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Reward Incentive Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                Expected Resolution Reward: <strong>+{rewardPoints} Saathi Points</strong>
              </p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                As per municipal anti-spam policies, submission earns 0 points upfront. When our ward team inspects and resolves this issue, <strong>{rewardPoints} Saathi Points</strong> will be credited directly to your auditable ledger!
              </p>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 font-medium">
            SLA: Target inspection within 24 hours
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onTrackComplaint) onTrackComplaint();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View in Complaint Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
