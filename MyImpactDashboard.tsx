import React, { useState } from 'react';
import { 
  Award, 
  Leaf, 
  Compass, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  Calendar, 
  ArrowUpRight,
  ShieldCheck,
  Footprints,
  Bike,
  Bus,
  Train,
  AlertCircle
} from 'lucide-react';
import { 
  UserImpact, 
  SustainableTrip, 
  CivicContribution, 
  SaathiTransaction, 
  UserBadge, 
  Language 
} from '../../types';
import { StatCard } from '../common/StatCard';
import { translations } from '../../data/translations';

interface MyImpactDashboardProps {
  userImpact: UserImpact;
  trips: SustainableTrip[];
  reports: CivicContribution[];
  transactions: SaathiTransaction[];
  userBadges: UserBadge[];
  onOpenHowCalculated: () => void;
  onNavigateToTrips: () => void;
  onNavigateToReport: () => void;
  lang: Language;
}

export const MyImpactDashboard: React.FC<MyImpactDashboardProps> = ({
  userImpact,
  trips,
  reports,
  transactions,
  userBadges,
  onOpenHowCalculated,
  onNavigateToTrips,
  onNavigateToReport,
  lang,
}) => {
  const [chartMetric, setChartMetric] = useState<'co2' | 'points'>('co2');
  const t = translations[lang];

  // Prepare simple dynamic trend bars (last 6 months / recent milestones)
  const monthlyData = [
    { label: 'May', co2: 2.1, points: 15 },
    { label: 'Jun', co2: 3.4, points: 25 },
    { label: 'Jul', co2: 2.8, points: 20 },
    { label: 'Aug', co2: 4.2, points: 30 },
    { label: 'Sep', co2: 3.1, points: 20 },
    { label: 'Oct (Now)', co2: userImpact.totalCO2Avoided, points: userImpact.totalPoints },
  ];

  const maxVal = Math.max(...monthlyData.map(d => chartMetric === 'co2' ? d.co2 : d.points), 1);

  // Category breakdown
  const categoryStats = [
    {
      name: lang === 'hi' ? 'हरित गतिशीलता (Sustainability)' : 'Green Mobility',
      count: `${userImpact.sustainableTrips} Trips`,
      impact: `${userImpact.totalCO2Avoided} kg CO₂`,
      color: 'bg-emerald-500',
    },
    {
      name: lang === 'hi' ? 'सुलभ बुनियादी ढांचा (Accessibility)' : 'Accessibility Barriers',
      count: `${userImpact.resolvedAccessibilityReports} Resolved`,
      impact: `${userImpact.resolvedAccessibilityReports * 40} Points`,
      color: 'bg-teal-500',
    },
    {
      name: lang === 'hi' ? 'नागरिक मरम्मत (Civic Reporting)' : 'Civic Grievances',
      count: `${userImpact.resolvedReports} Resolved`,
      impact: `${userImpact.resolvedReports * 25} Points`,
      color: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'hi' ? 'सिटी साथी प्रभाव यात्रा' : 'CitySaathi Impact Journey'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'मेरा नागरिक और पर्यावरणीय प्रभाव' : 'My Civic & Environmental Impact'}
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {lang === 'hi'
                ? 'सूचना → कार्रवाई → प्रभाव → मान्यता। आपकी हर सार्वजनिक यात्रा और नागरिक रिपोर्ट शहर को अधिक समावेशी और स्वच्छ बना रही है।'
                : 'Information → Action → Impact → Recognition. Every sustainable trip and verified civic report directly transforms our urban community.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={onNavigateToTrips}
              className="flex-1 sm:flex-initial px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'hi' ? 'टिकाऊ यात्रा दर्ज करें' : 'Record Green Trip'}</span>
            </button>
            <button
              onClick={onNavigateToReport}
              className="flex-1 sm:flex-initial px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <AlertCircle className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'hi' ? 'समस्या रिपोर्ट करें' : 'File Report'}</span>
            </button>
            <button
              onClick={onOpenHowCalculated}
              className="p-3 bg-white/10 hover:bg-white/20 text-emerald-200 rounded-xl border border-white/20 transition-colors"
              title="How is my impact calculated?"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3.A Personal Impact Summary Cards */}
      <section aria-labelledby="personal-impact-summary">
        <div className="flex items-center justify-between mb-4">
          <h2 id="personal-impact-summary" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t.summary.totalPoints} & {t.summary.impactScore}</span>
          </h2>
          <button
            onClick={onOpenHowCalculated}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'स्कोरिंग कैसे काम करती है?' : 'Scoring Breakdown'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title={t.summary.totalPoints}
            value={userImpact.totalPoints}
            unit="pts"
            subtitle={t.summary.pointsDesc}
            icon={Sparkles}
            variant="emerald"
            highlight={true}
          />
          <StatCard
            title={t.summary.impactScore}
            value={userImpact.impactScore}
            subtitle={t.summary.scoreDesc}
            icon={Award}
            variant="mint"
          />
          <StatCard
            title={t.summary.co2Avoided}
            value={userImpact.totalCO2Avoided}
            unit="kg CO₂"
            subtitle={t.summary.co2Desc}
            icon={Leaf}
            variant="emerald"
          />
          <StatCard
            title={t.summary.sustainableTrips}
            value={userImpact.sustainableTrips}
            unit="trips"
            subtitle={t.summary.tripsDesc}
            icon={Compass}
            variant="slate"
          />
          <StatCard
            title={t.summary.resolvedReports}
            value={userImpact.resolvedReports}
            unit="issues"
            subtitle={t.summary.resolvedDesc}
            icon={CheckCircle2}
            variant="slate"
          />
          <StatCard
            title={t.summary.communityContributions}
            value={userImpact.communityContributions}
            unit="checks"
            subtitle={t.summary.communityDesc}
            icon={ShieldCheck}
            variant="slate"
          />
        </div>
      </section>

      {/* 3.B Visual Statistics & Category Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simple Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'समय के साथ प्रभाव प्रगति' : 'Impact Growth Over Time'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'सत्यापित कार्बन बचत व अर्जित पॉइंट्स' : 'Verified emissions saved and reward recognition'}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartMetric('co2')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  chartMetric === 'co2' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'CO₂ बचत (kg)' : 'CO₂ Avoided (kg)'}
              </button>
              <button
                onClick={() => setChartMetric('points')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  chartMetric === 'points' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'hi' ? 'साथी पॉइंट्स' : 'Saathi Points'}
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="pt-4 pb-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-100">
              {monthlyData.map((item, idx) => {
                const val = chartMetric === 'co2' ? item.co2 : item.points;
                const heightPercent = Math.min(100, Math.max(15, Math.round((val / maxVal) * 100)));
                const isCurrent = idx === monthlyData.length - 1;
                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {val} {chartMetric === 'co2' ? 'kg' : 'pts'}
                    </span>
                    <div 
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                        isCurrent 
                          ? 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-sm' 
                          : 'bg-emerald-100 hover:bg-emerald-200'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className={`text-[11px] font-medium tracking-tight mt-1 truncate ${
                      isCurrent ? 'text-emerald-900 font-bold' : 'text-slate-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-1">
            <span>• {chartMetric === 'co2' ? 'Current verified savings: ' : 'Audited Points: '} <strong className="text-emerald-800">{chartMetric === 'co2' ? `${userImpact.totalCO2Avoided} kg` : userImpact.totalPoints}</strong></span>
            <span className="text-emerald-700 font-medium">✓ Updated live</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            {lang === 'hi' ? 'श्रेणी अनुसार योगदान' : 'Contributions by Category'}
          </h3>
          <p className="text-xs text-slate-500 -mt-2">
            {lang === 'hi' ? 'नागरिक, सुगमता और पर्यावरण संतुलन' : 'Sustainability, Accessibility, and Civic Reporting'}
          </p>

          <div className="space-y-3 pt-2">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>{cat.name}</span>
                  <span className="text-emerald-800 font-extrabold">{cat.count}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Impact: {cat.impact}</span>
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900">
              <strong>{lang === 'hi' ? 'संतुलित प्रभाव:' : 'Balanced Impact:'}</strong> {lang === 'hi' ? 'आपकी सुगमता रिपोर्ट ने 350+ बुजुर्गों व व्हीलचेयर यात्रियों की मदद की है।' : 'Your accessibility reporting restored step-free transit for 350+ citizens.'}
            </div>
          </div>
        </div>

      </section>

      {/* 3.C Recent Activity Timeline */}
      <section aria-labelledby="activity-timeline" className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="activity-timeline" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'हाल की गतिविधि समयरेखा' : 'Recent Impact Activity Timeline'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'प्रत्येक कार्रवाई, तिथि, अर्जित अंक और सत्यापन स्थिति' : 'Auditable log of completed trips, resolutions, and rewards'}
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          // Meaningful Empty State for New Users
          <div className="py-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Footprints className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">
              {lang === 'hi' ? 'अभी तक कोई गतिविधि नहीं' : 'No Impact Activities Recorded Yet'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'hi'
                ? 'अपनी पहली सार्वजनिक बस या पैदल यात्रा दर्ज करके, या टूटे फुटपाथ की रिपोर्ट करके साथी पॉइंट्स अर्जित करना शुरू करें।'
                : 'Start earning Saathi Points by taking public transit, walking, or reporting an inaccessible civic spot today!'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onNavigateToTrips}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                {lang === 'hi' ? 'पहली यात्रा दर्ज करें' : 'Record First Trip'}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-100 space-y-6">
            {transactions.map((txn) => {
              const isTrip = txn.activityType === 'SUSTAINABLE_TRIP';
              const isAccess = txn.activityType === 'ACCESSIBILITY_RESOLUTION';
              const isCivic = txn.activityType === 'CIVIC_RESOLUTION';

              return (
                <div key={txn.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full border-4 border-white ${
                    isAccess ? 'bg-teal-500 ring-2 ring-teal-200' : isTrip ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-500 ring-2 ring-amber-200'
                  }`} />

                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 group-hover:bg-emerald-50/30 group-hover:border-emerald-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">
                          {txn.referenceId}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAccess 
                            ? 'bg-teal-100 text-teal-800' 
                            : isTrip 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isAccess ? 'Accessibility Fix' : isTrip ? 'Green Trip' : 'Civic Repair'}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
                          ✓ {txn.verificationStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-black text-emerald-800 text-sm">
                          +{txn.points} {lang === 'hi' ? 'अंक' : 'Points'}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(txn.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {txn.reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
