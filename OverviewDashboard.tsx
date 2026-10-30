import React, { useState } from 'react';
import { 
  Award, 
  Leaf, 
  CheckCircle2, 
  Footprints, 
  AlertCircle, 
  Compass, 
  ArrowRight, 
  TrendingUp,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Bike,
  Bus,
  Train
} from 'lucide-react';
import { 
  UserImpact, 
  SustainableTrip, 
  CivicContribution, 
  SaathiTransaction, 
  Language, 
  UserProfile 
} from '../../types';
import { KpiCard } from '../ui/KpiCard';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface OverviewDashboardProps {
  userImpact: UserImpact;
  trips: SustainableTrip[];
  reports: CivicContribution[];
  transactions: SaathiTransaction[];
  currentUser: UserProfile;
  onNavigate: (tab: string, subTab?: string) => void;
  lang: Language;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  userImpact,
  trips,
  reports,
  transactions,
  currentUser,
  onNavigate,
  lang,
}) => {
  const [metricView, setMetricView] = useState<'co2' | 'points'>('co2');

  // Realistic monthly impact data
  const monthlyData = [
    { month: 'Jun', co2: 3.2, points: 20 },
    { month: 'Jul', co2: 4.8, points: 30 },
    { month: 'Aug', co2: 2.4, points: 15 },
    { month: 'Sep', co2: 5.1, points: 35 },
    { month: 'Oct', co2: userImpact.totalCO2Avoided, points: userImpact.totalPoints },
  ];

  const maxVal = Math.max(...monthlyData.map(d => metricView === 'co2' ? d.co2 : d.points), 1);

  // Combine latest activity items safely
  const recentActivities = [
    ...trips.map(t => {
      const mode = t.transportMode || (t as any).mode || 'transit';
      const from = t.fromLocation || (t as any).from || 'Origin';
      const to = t.toLocation || (t as any).to || 'Destination';
      const date = t.createdAt ? t.createdAt.slice(0, 10) : ((t as any).date || 'Recently');
      const points = t.pointsAwarded ?? (t as any).pointsEarned ?? 10;
      const co2 = t.estimatedCO2Avoided ?? (t as any).co2AvoidedKg ?? 0;
      const isConfirmed = t.verificationStatus === 'Confirmed' || (t as any).verified === true;
      return {
        id: t.id,
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Trip: ${from} → ${to}`,
        date,
        type: 'trip' as const,
        points: `+${points} pts`,
        meta: `${t.distanceKm} km • ${co2} kg CO₂ avoided`,
        status: isConfirmed ? 'Verified' : 'Pending',
      };
    }),
    ...reports.map(r => {
      const date = r.submittedAt ? r.submittedAt.slice(0, 10) : ((r as any).createdAt ? (r as any).createdAt.slice(0, 10) : 'Recently');
      const pts = r.pointsAwarded ?? (r as any).rewardPoints ?? 0;
      return {
        id: r.id,
        title: r.title || 'Civic Grievance',
        date,
        type: 'report' as const,
        points: pts > 0 ? `+${pts} pts` : 'Pending resolution',
        meta: `${(r.category || 'CIVIC').toUpperCase().replace('_', ' ')} • ${r.location || 'Ward 14'}`,
        status: r.status || 'Submitted',
      };
    }),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Compact Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Your actions. Your impact. A better city.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Welcome back, <strong className="text-slate-800">{currentUser.name}</strong>. Here is your verified civic contribution overview.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Jurisdiction: <span className="text-slate-700 font-semibold">{currentUser.ward}</span>
        </div>
      </div>

      {/* 2. ONLY 4 Compact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Saathi Points"
          value={userImpact.totalPoints}
          unit="pts"
          subtext="Auditable points balance"
          icon={<Award className="w-4 h-4" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
          onClick={() => onNavigate('rewards', 'history')}
        />
        <KpiCard
          label="CO₂ Avoided"
          value={userImpact.totalCO2Avoided}
          unit="kg"
          subtext="Transit baseline savings"
          icon={<Leaf className="w-4 h-4" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
          onClick={() => onNavigate('travel')}
        />
        <KpiCard
          label="Civic Issues Resolved"
          value={userImpact.resolvedReports}
          unit="resolved"
          subtext="100% municipal verified"
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-700"
          onClick={() => onNavigate('report')}
        />
        <KpiCard
          label="Sustainable Trips"
          value={userImpact.sustainableTrips}
          unit="trips"
          subtext="Step-free & green travel"
          icon={<Footprints className="w-4 h-4" />}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-700"
          onClick={() => onNavigate('travel')}
        />
      </div>

      {/* 3. Two Balanced Sections: Left Chart, Right Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Impact Over Time Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Impact Over Time
              </h3>
              <p className="text-[11px] text-slate-400">
                Monthly verified environmental & civic contributions
              </p>
            </div>

            {/* Toggle metric */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setMetricView('co2')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  metricView === 'co2' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                CO₂ (kg)
              </button>
              <button
                onClick={() => setMetricView('points')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  metricView === 'points' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Points
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          {monthlyData.length > 0 ? (
            <div className="pt-2">
              <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2">
                {monthlyData.map((d, i) => {
                  const val = metricView === 'co2' ? d.co2 : d.points;
                  const heightPct = Math.max(12, Math.round((val / maxVal) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {val} {metricView === 'co2' ? 'kg' : 'pts'}
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-lg h-36 flex items-end overflow-hidden">
                        <div 
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            i === monthlyData.length - 1 
                              ? 'bg-emerald-700 group-hover:bg-emerald-600' 
                              : 'bg-emerald-500/70 group-hover:bg-emerald-500'
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                  <span>Current Month Verified</span>
                </span>
                <span>Formula: Standard Transport Baseline 0.192 kg/km</span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<TrendingUp className="w-6 h-6" />}
              title="No historical trend yet"
              description="Record your first sustainable trip or resolve a civic grievance to see your monthly impact trajectory."
              actionLabel="Record Trip"
              onAction={() => onNavigate('travel')}
            />
          )}
        </div>

        {/* Right: Recent Verified Activity */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Activity
              </h3>
              <p className="text-[11px] text-slate-400">
                Latest verified trips, reports & reward credits
              </p>
            </div>
            <button
              onClick={() => onNavigate('rewards', 'history')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              View All
            </button>
          </div>

          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {act.title}
                    </span>
                    <span className="text-xs font-black text-emerald-800 shrink-0">
                      {act.points}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{act.meta}</span>
                    <StatusBadge status={act.status as any} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Clock className="w-6 h-6" />}
              title="No activity recorded yet"
              description="Your completed sustainable trips and verified civic complaints will appear here."
              actionLabel="Report Grievance"
              onAction={() => onNavigate('report')}
            />
          )}
        </div>

      </div>

      {/* 4. Small Quick Actions Section */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Actions
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('report')}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
              Report an Issue
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Broken footpath, lamp, ramp
            </p>
          </button>

          <button
            onClick={() => onNavigate('navigate')}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
              Plan Accessible Route
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Step-free & transit directions
            </p>
          </button>

          <button
            onClick={() => onNavigate('travel')}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Footprints className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
              Record a Green Trip
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Calculate CO₂ & earn points
            </p>
          </button>

          <button
            onClick={() => onNavigate('rewards')}
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
              View Rewards
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Badges & points history
            </p>
          </button>
        </div>
      </div>

    </div>
  );
};
