import React, { useState } from 'react';
import { 
  Award, 
  Footprints, 
  AlertCircle, 
  Sparkles, 
  Receipt,
  LayoutDashboard
} from 'lucide-react';
import { 
  UserImpact, 
  SustainableTrip, 
  CivicContribution, 
  SaathiTransaction, 
  UserBadge, 
  Language, 
  UserProfile 
} from '../../types';
import { OverviewDashboard } from './OverviewDashboard';
import { SustainableTravel } from './SustainableTravel';
import { CivicReportingRewards } from './CivicReportingRewards';
import { BadgesGrid } from './BadgesGrid';
import { PointsHistoryTable } from './PointsHistoryTable';

interface SaathiRewardsViewProps {
  initialTab?: 'overview' | 'travel' | 'reports' | 'badges' | 'history';
  userImpact: UserImpact;
  trips: SustainableTrip[];
  reports: CivicContribution[];
  transactions: SaathiTransaction[];
  userBadges: UserBadge[];
  currentUser: UserProfile;
  onTripRecorded: (unlockedBadges: string[]) => void;
  onReportUpdated: (unlockedBadges: string[]) => void;
  onOpenReportModal: () => void;
  onOpenAdminSimulator: () => void;
  onSelectBadge: (badgeId: string) => void;
  onNavigateToTab: (tab: string) => void;
  lang: Language;
}

export const SaathiRewardsView: React.FC<SaathiRewardsViewProps> = ({
  initialTab = 'overview',
  userImpact,
  trips,
  reports,
  transactions,
  userBadges,
  currentUser,
  onTripRecorded,
  onReportUpdated,
  onOpenReportModal,
  onOpenAdminSimulator,
  onSelectBadge,
  onNavigateToTab,
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'travel' | 'reports' | 'badges' | 'history'>(initialTab);

  const subTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'travel', label: 'Sustainable Travel', icon: Footprints },
    { id: 'reports', label: 'Civic Rewards', icon: AlertCircle },
    { id: 'badges', label: 'Badges', icon: Sparkles },
    { id: 'history', label: 'Points History', icon: Receipt },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 5 Distinct Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {subTabs.map((st) => {
          const Icon = st.icon;
          const isActive = activeSubTab === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubTab(st.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Only display the selected tab content */}
      <div>
        {activeSubTab === 'overview' && (
          <OverviewDashboard
            userImpact={userImpact}
            trips={trips}
            reports={reports}
            transactions={transactions}
            currentUser={currentUser}
            onNavigate={(tab, sub) => {
              if (tab === 'rewards' && sub) {
                setActiveSubTab(sub as any);
              } else {
                onNavigateToTab(tab);
              }
            }}
            lang={lang}
          />
        )}

        {activeSubTab === 'travel' && (
          <SustainableTravel
            trips={trips}
            onTripRecorded={onTripRecorded}
            lang={lang}
          />
        )}

        {activeSubTab === 'reports' && (
          <CivicReportingRewards
            reports={reports}
            onOpenReportModal={onOpenReportModal}
            onOpenAdminSimulator={onOpenAdminSimulator}
            onReportUpdated={onReportUpdated}
            lang={lang}
          />
        )}

        {activeSubTab === 'badges' && (
          <BadgesGrid
            userBadges={userBadges}
            userImpact={userImpact}
            onSelectBadge={onSelectBadge}
            lang={lang}
          />
        )}

        {activeSubTab === 'history' && (
          <PointsHistoryTable
            transactions={transactions}
            totalPoints={userImpact.totalPoints}
            lang={lang}
          />
        )}
      </div>

    </div>
  );
};
