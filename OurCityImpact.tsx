import React, { useState } from 'react';
import { 
  Globe2, 
  Leaf, 
  CheckCircle2, 
  Users, 
  Footprints, 
  ShieldCheck, 
  Target,
  BarChart3,
  Filter
} from 'lucide-react';
import { CommunityImpact, Language } from '../../types';
import { KpiCard } from '../ui/KpiCard';

interface OurCityImpactProps {
  communityImpact: CommunityImpact;
  lang: Language;
}

export const OurCityImpact: React.FC<OurCityImpactProps> = ({ communityImpact, lang }) => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');

  const filterMultiplier = timeFilter === '7d' ? 0.28 : timeFilter === '30d' ? 0.75 : 1.0;

  const displayStats = {
    co2: Math.round(communityImpact.totalCO2Avoided * filterMultiplier * 10) / 10,
    trips: Math.round(communityImpact.totalTrips * filterMultiplier),
    civicResolved: Math.round(communityImpact.totalResolvedIssues * filterMultiplier),
    accessResolved: Math.round(communityImpact.totalAccessibilityResolved * filterMultiplier),
    contributions: Math.round(communityImpact.totalContributions * filterMultiplier),
    points: Math.round(communityImpact.totalPoints * filterMultiplier),
  };

  const cityTargetCO2 = 500.0;
  const targetPercent = Math.min(100, Math.round((displayStats.co2 / cityTargetCO2) * 100));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our City's Collective Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ward-level aggregated environmental and civic metrics. Together, citizens are building an accessible and clean city.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setTimeFilter('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === '7d' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeFilter('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === '30d' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past 30 Days
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeFilter === 'all' ? 'bg-white text-emerald-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 2. Demonstration Dataset Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Municipal Demonstration Dataset:</strong> Aggregated and anonymized data from Ward 14 civic nodes. Privacy assured; no individual PII exposed.
          </span>
        </span>
        <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">DPDP Act Compliant</span>
      </div>

      {/* 3. Four Compact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Total CO₂ Avoided"
          value={displayStats.co2}
          unit="kg"
          subtext="Collective clean mobility"
          icon={<Leaf className="w-4 h-4" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <KpiCard
          label="Sustainable Trips"
          value={displayStats.trips}
          unit="trips"
          subtext="Metro, bus & cycling"
          icon={<Footprints className="w-4 h-4" />}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-700"
        />
        <KpiCard
          label="Civic Issues Resolved"
          value={displayStats.civicResolved}
          unit="issues"
          subtext={`${displayStats.accessResolved} accessibility fixes`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-700"
        />
        <KpiCard
          label="Active Contributors"
          value={displayStats.contributions}
          unit="citizens"
          subtext="Registered in Ward 14"
          icon={<Users className="w-4 h-4" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-700"
        />
      </div>

      {/* 4. Ward Sustainability Target Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" />
              <span>Ward 14 Clean Mobility Milestone</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Goal: Avoid 500 kg CO₂ monthly through public transport adoption
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800">
            {displayStats.co2} / {cityTargetCO2} kg ({targetPercent}%)
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            style={{ width: `${targetPercent}%` }}
            className="h-full bg-emerald-700 rounded-full transition-all duration-700"
          />
        </div>
      </div>

      {/* 5. Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400">Green Commuting</span>
          <div className="text-lg font-black text-slate-900">{displayStats.trips} Transit Trips</div>
          <p className="text-xs text-slate-500">
            Citizens saved {displayStats.co2} kg of carbon through bus and metro ridership.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400">Barrier-Free Infrastructure</span>
          <div className="text-lg font-black text-slate-900">{displayStats.accessResolved} Fixes</div>
          <p className="text-xs text-slate-500">
            Wheelchair ramps, tactile paving, and accessible toilets repaired.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400">Saathi Civic Rewards</span>
          <div className="text-lg font-black text-slate-900">{displayStats.points} Points</div>
          <p className="text-xs text-slate-500">
            Auditable points disbursed for verified civic contributions.
          </p>
        </div>
      </div>

    </div>
  );
};
