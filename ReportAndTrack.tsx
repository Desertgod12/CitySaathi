import React, { useState, useRef } from 'react';
import { 
  AlertCircle, 
  Camera, 
  MapPin, 
  Accessibility, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Search, 
  Building2, 
  Navigation, 
  FileCheck, 
  UploadCloud, 
  Image as ImageIcon,
  Check,
  X,
  Plus
} from 'lucide-react';
import { CivicContribution, Language, ReportCategory, ReportStatus, UserProfile } from '../../types';
import { impactService } from '../../services/impactService';
import { ComplaintAcceptedModal } from './ComplaintAcceptedModal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface ReportAndTrackProps {
  reports: CivicContribution[];
  currentUser: UserProfile;
  onReportSubmitted: () => void;
  onOpenAdminSimulator: () => void;
  onReportUpdated: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const ReportAndTrack: React.FC<ReportAndTrackProps> = ({
  reports,
  currentUser,
  onReportSubmitted,
  onOpenAdminSimulator,
  onReportUpdated,
  lang,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>('accessibility');
  const [isAccessibility, setIsAccessibility] = useState(true);
  const [location, setLocation] = useState('Sector 14 Main Market, Near Ramp #3, Ward 14');
  const [priority, setPriority] = useState<CivicContribution['priority']>('High');
  
  // Real photo upload state
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
  );
  const [fileName, setFileName] = useState<string>('sample_ramp_evidence.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [acceptedModalReport, setAcceptedModalReport] = useState<CivicContribution | null>(null);
  const [searchTicket, setSearchTicket] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: { id: ReportCategory; label: string; desc: string; isAccess?: boolean }[] = [
    { id: 'accessibility', label: 'Accessibility Barrier (Ramps/Toilets)', desc: 'Wheelchair & elderly priority (+40 pts)', isAccess: true },
    { id: 'road_footpath', label: 'Damaged Sidewalk / Pothole', desc: 'Broken pavers & trip hazards (+25 pts)' },
    { id: 'streetlight', label: 'Dark Streetlight Pole', desc: 'Night safety & visibility (+25 pts)' },
    { id: 'sanitation_waste', label: 'Solid Waste / Garbage Overflow', desc: 'Blocked pedestrian walkways (+25 pts)' },
    { id: 'water_drainage', label: 'Drainage Overflow / Waterlogging', desc: 'Waterlogging & submergence (+25 pts)' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    setGpsMessage(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          const locStr = `GPS: ${lat}° N, ${lon}° E, ${currentUser.ward}`;
          setLocation(locStr);
          setGpsMessage(`Location locked via device GPS (${lat}, ${lon})`);
          setIsDetectingLocation(false);
        },
        (error) => {
          setLocation(`Gate 2, Central Transit Hub (28.5921° N, 77.0460° E), ${currentUser.ward}`);
          setGpsMessage('Using default ward GPS coordinates.');
          setIsDetectingLocation(false);
        },
        { timeout: 7000 }
      );
    } else {
      setLocation(`Sector 14 Corridor (28.5921° N, 77.0460° E), ${currentUser.ward}`);
      setIsDetectingLocation(false);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Please provide a descriptive title';
    if (!description.trim()) errs.description = 'Please describe the issue in detail';
    if (!location.trim()) errs.location = 'Please specify the location or use GPS';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReport = impactService.submitReport(
        title.trim(),
        description.trim(),
        category,
        location.trim(),
        isAccessibility || category === 'accessibility',
        uploadedImagePreview,
        priority
      );

      setAcceptedModalReport(newReport);
      setTitle('');
      setDescription('');
      setIsSubmitting(false);
      onReportSubmitted();
    }, 400);
  };

  const displayedReports = reports.filter(r => {
    const query = searchTicket.toLowerCase();
    const matchesSearch = !searchTicket || 
      (r.reportId && r.reportId.toLowerCase().includes(query)) || 
      (r.id && r.id.toLowerCase().includes(query)) ||
      r.title.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Civic Grievance Redressal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lodge complaints with real photo evidence and GPS coordinates. Receive official tracking receipts and earn verified Saathi Points on resolution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="sm"
            variant="secondary"
            onClick={onOpenAdminSimulator}
            icon={<ShieldCheck className="w-4 h-4 text-amber-600" />}
          >
            Authority Console
          </Button>
        </div>
      </div>

      {/* 2. Main Grid: Form on Left, Tracker on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Grievance Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Lodge a Civic Grievance
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Intake
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              label="Grievance Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              placeholder="e.g. Broken wheelchair ramp at Sector 14"
            />

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ReportCategory;
                  setCategory(cat);
                  setIsAccessibility(cat === 'accessibility');
                }}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:border-emerald-600"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location with GPS */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Location / Address <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingLocation}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Detecting...' : 'Detect GPS'}</span>
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-emerald-600"
                placeholder="Street address or landmark"
              />
              {gpsMessage && (
                <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                  {gpsMessage}
                </p>
              )}
              {errors.location && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:border-emerald-600"
                placeholder="Explain the hazard, obstruction, or repair needed..."
              />
              {errors.description && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.description}</p>
              )}
            </div>

            {/* Photo Upload with Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Photo Evidence (Optional)
              </label>
              
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Choose Photo</span>
                </button>
                <span className="text-xs text-slate-500 truncate max-w-[180px]">
                  {fileName}
                </span>
              </div>

              {uploadedImagePreview && (
                <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-200 h-28 w-full bg-slate-50">
                  <img 
                    src={uploadedImagePreview} 
                    alt="Evidence Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                size="md"
                isLoading={isSubmitting}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Submit Grievance
              </Button>
            </div>

          </form>
        </div>

        {/* Right: Grievance Tracker & Status Timeline */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Grievance Status Tracker
              </h3>
              <p className="text-[11px] text-slate-400">
                Live lifecycle tracking from intake to verification and municipal resolution
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="verified">Verified</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Search Ticket */}
          <div>
            <Input
              value={searchTicket}
              onChange={(e) => setSearchTicket(e.target.value)}
              placeholder="Search by ticket ID (e.g. CS-2026), title, or location..."
              prefixIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* List of Reports */}
          {displayedReports.length > 0 ? (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {displayedReports.map((report) => (
                <div 
                  key={report.id}
                  className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                          {report.ticketId || report.id}
                        </span>
                        {report.isAccessibilityIssue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                            <Accessibility className="w-3 h-3" />
                            <span>Accessibility Barrier</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {report.title}
                      </h4>
                    </div>

                    <StatusBadge status={report.status as any} size="sm" />
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate max-w-[220px]">{report.location}</span>
                    <span className="font-mono text-[10px]">
                      {report.submittedAt ? report.submittedAt.slice(0, 10) : ((report as any).createdAt ? (report as any).createdAt.slice(0, 10) : 'Recently')}
                    </span>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Resolution Incentive:</span>
                    {report.status.toLowerCase() === 'resolved' ? (
                      <span className="font-black text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+{report.pointsAwarded ?? (report as any).rewardPoints ?? (report.isAccessibilityIssue ? 40 : 25)} Saathi Points Credited</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 font-semibold">
                        0 pts awarded (Eligible for +{report.isAccessibilityIssue ? 40 : 25} pts on verification)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileCheck className="w-6 h-6" />}
              title="No grievances found"
              description="No reports match your current filter. Lodge an issue using the form on the left."
            />
          )}

        </div>

      </div>

      {/* Official Municipal Acknowledgment Modal */}
      {acceptedModalReport && (
        <ComplaintAcceptedModal
          report={acceptedModalReport}
          onClose={() => setAcceptedModalReport(null)}
          onTrackComplaint={() => {
            setSearchTicket(acceptedModalReport.ticketId || acceptedModalReport.reportId);
            setAcceptedModalReport(null);
          }}
          lang={lang}
        />
      )}

    </div>
  );
};
