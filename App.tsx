import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquareText, 
  AlertCircle, 
  Award, 
  Globe2, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Leaf, 
  Receipt, 
  BookOpen,
  CheckCircle2,
  Building2,
  LogIn,
  HelpCircle,
  Footprints
} from 'lucide-react';
import { 
  Language, 
  UserImpact, 
  SustainableTrip, 
  CivicContribution, 
  SaathiTransaction, 
  UserBadge, 
  CommunityImpact,
  UserProfile
} from './types';
import { impactService } from './services/impactService';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { BadgeModal } from './components/common/BadgeModal';
import { ImpactCalculationModal } from './components/common/ImpactCalculationModal';
import { DemoAdminDrawer } from './components/common/DemoAdminDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { LoginPage } from './components/auth/LoginPage';

// Module Views
import { OverviewDashboard } from './components/impact/OverviewDashboard';
import { NavigateAccessible } from './components/modules/NavigateAccessible';
import { ReportAndTrack } from './components/modules/ReportAndTrack';
import { SustainableTravel } from './components/impact/SustainableTravel';
import { OurCityImpact } from './components/impact/OurCityImpact';
import { AskAIAssistant } from './components/modules/AskAIAssistant';
import { SaathiRewardsView } from './components/impact/SaathiRewardsView';
import { AuthorityConsoleView } from './components/modules/AuthorityConsoleView';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Application User & State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => impactService.getActiveUser());
  const [userImpact, setUserImpact] = useState<UserImpact>(() => impactService.getUserImpact());
  const [trips, setTrips] = useState<SustainableTrip[]>(() => impactService.getTrips());
  const [reports, setReports] = useState<CivicContribution[]>(() => impactService.getReports());
  const [transactions, setTransactions] = useState<SaathiTransaction[]>(() => impactService.getTransactions());
  const [userBadges, setUserBadges] = useState<UserBadge[]>(() => impactService.getUserBadges());
  const [communityImpact, setCommunityImpact] = useState<CommunityImpact>(() => impactService.getCommunityImpact());

  // Modals
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [howCalculatedModalOpen, setHowCalculatedModalOpen] = useState(false);
  const [unlockedBadgeId, setUnlockedBadgeId] = useState<string | null>(null);

  // Sync state helper
  const reloadState = () => {
    setCurrentUser(impactService.getActiveUser());
    setUserImpact(impactService.getUserImpact());
    setTrips(impactService.getTrips());
    setReports(impactService.getReports());
    setTransactions(impactService.getTransactions());
    setUserBadges(impactService.getUserBadges());
    setCommunityImpact(impactService.getCommunityImpact());
  };

  const handleTripRecorded = (newlyUnlockedBadges: string[]) => {
    reloadState();
    if (newlyUnlockedBadges.length > 0) {
      setUnlockedBadgeId(newlyUnlockedBadges[0]);
    }
  };

  const handleReportUpdated = (newlyUnlockedBadges: string[]) => {
    reloadState();
    if (newlyUnlockedBadges.length > 0) {
      setUnlockedBadgeId(newlyUnlockedBadges[0]);
    }
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    impactService.setActiveUser(profile.role);
    setCurrentUser(profile);
    reloadState();
  };

  const handleResetDemo = () => {
    if (window.confirm(lang === 'hi' ? 'क्या आप डेटा को डिफ़ॉल्ट स्थिति पर रीसेट करना चाहते हैं?' : 'Reset state to default baseline configuration?')) {
      impactService.resetDemoData();
      reloadState();
      alert(lang === 'hi' ? 'डेटा रीसेट हो गया है।' : 'Platform data reset to baseline.');
    }
  };

  const isOfficer = currentUser.role === 'officer';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-600 selection:text-white flex">
      
      {/* 1. Simplified Left Sidebar (8 Main Nav Items) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenHowCalculated={() => setHowCalculatedModalOpen(true)}
        onResetDemo={handleResetDemo}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* 2. Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Compact, Uncluttered Top Navigation */}
        <Header
          currentTab={currentTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          lang={lang}
          setLang={setLang}
          currentUser={currentUser}
          onOpenLogin={() => setLoginModalOpen(true)}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />

        {/* Municipal Authority Mode Banner (shown when officer identity is active) */}
        {isOfficer && (
          <div className="bg-amber-400 text-slate-950 px-4 sm:px-6 py-2 text-xs font-bold border-b border-amber-500 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-900 shrink-0" />
              <span>
                <strong>Municipal Authority Active:</strong> Logged in as Executive Engineer with jurisdiction over {currentUser.ward}.
              </span>
            </div>
            <button
              onClick={() => setCurrentTab('authority')}
              className="px-2.5 py-0.5 bg-slate-950 text-white rounded-md text-[10px] uppercase tracking-wider font-extrabold hover:bg-slate-800"
            >
              Open Resolution Desk
            </button>
          </div>
        )}

        {/* Main Route View */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl mx-auto">
          
          {/* 1. OVERVIEW */}
          {currentTab === 'overview' && (
            <OverviewDashboard
              userImpact={userImpact}
              trips={trips}
              reports={reports}
              transactions={transactions}
              currentUser={currentUser}
              onNavigate={(tab) => setCurrentTab(tab)}
              lang={lang}
            />
          )}

          {/* 2. ACCESSIBLE NAVIGATION */}
          {currentTab === 'navigate' && (
            <NavigateAccessible
              onTripRecorded={handleTripRecorded}
              lang={lang}
            />
          )}

          {/* 3. CIVIC GRIEVANCES */}
          {currentTab === 'report' && (
            <ReportAndTrack
              reports={reports}
              currentUser={currentUser}
              onReportSubmitted={reloadState}
              onOpenAdminSimulator={() => setAdminDrawerOpen(true)}
              onReportUpdated={handleReportUpdated}
              lang={lang}
            />
          )}

          {/* 4. SUSTAINABLE TRAVEL */}
          {currentTab === 'travel' && (
            <SustainableTravel
              trips={trips}
              onTripRecorded={handleTripRecorded}
              lang={lang}
            />
          )}

          {/* 5. CITYWIDE IMPACT */}
          {currentTab === 'cityImpact' && (
            <OurCityImpact
              communityImpact={communityImpact}
              lang={lang}
            />
          )}

          {/* 6. AI ASSISTANT */}
          {currentTab === 'ask' && (
            <AskAIAssistant
              userImpact={userImpact}
              onNavigateToTrips={() => setCurrentTab('travel')}
              lang={lang}
            />
          )}

          {/* 7. SAATHI REWARDS (5 Organized Tabs: Overview, Travel, Reports, Badges, History) */}
          {currentTab === 'rewards' && (
            <SaathiRewardsView
              userImpact={userImpact}
              trips={trips}
              reports={reports}
              transactions={transactions}
              userBadges={userBadges}
              currentUser={currentUser}
              onTripRecorded={handleTripRecorded}
              onReportUpdated={handleReportUpdated}
              onOpenReportModal={() => setCurrentTab('report')}
              onOpenAdminSimulator={() => setAdminDrawerOpen(true)}
              onSelectBadge={(id) => setUnlockedBadgeId(id)}
              onNavigateToTab={(t) => setCurrentTab(t)}
              lang={lang}
            />
          )}

          {/* 8. AUTHORITY CONSOLE */}
          {currentTab === 'authority' && (
            <AuthorityConsoleView
              reports={reports}
              currentUser={currentUser}
              onReportUpdated={handleReportUpdated}
              lang={lang}
            />
          )}

          {/* DEDICATED LOGIN / PORTAL VIEW */}
          {currentTab === 'login' && (
            <LoginPage
              currentUser={currentUser}
              onLoginSuccess={handleLoginSuccess}
              lang={lang}
              onNavigateToImpact={() => setCurrentTab('overview')}
            />
          )}

        </main>

        {/* Polished, Compact Municipal Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-700 flex items-center justify-center text-white">
                <Compass className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-slate-800">CitySaathi 2.0</span>
              <span>•</span>
              <span>Ministry of Housing & Urban Affairs (MoHUA)</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Toll-Free Helpline: <strong className="text-slate-800 font-mono">1800-11-7228</strong></span>
              <span>•</span>
              <span>Zero Speculation</span>
              <span>•</span>
              <button onClick={() => setHowCalculatedModalOpen(true)} className="hover:text-emerald-700 underline font-semibold">
                Scoring Guide
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      <BadgeModal
        badgeId={unlockedBadgeId}
        onClose={() => setUnlockedBadgeId(null)}
        lang={lang}
      />

      <ImpactCalculationModal
        isOpen={howCalculatedModalOpen}
        onClose={() => setHowCalculatedModalOpen(false)}
        lang={lang}
      />

      <DemoAdminDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        reports={reports}
        onReportUpdated={handleReportUpdated}
        lang={lang}
      />

    </div>
  );
}
