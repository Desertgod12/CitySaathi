import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Language, UserProfile } from '../../types';

interface HeaderProps {
  currentTab: string;
  onToggleSidebar: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: UserProfile;
  onOpenLogin: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onToggleSidebar,
  lang,
  setLang,
  currentUser,
  onOpenLogin,
  onNavigateToTab,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isOfficer = currentUser.role === 'officer';

  const tabLabels: Record<string, string> = {
    overview: lang === 'hi' ? 'अवलोकन (Overview)' : 'Overview',
    navigate: lang === 'hi' ? 'सुगम नेविगेशन (Accessible Transit)' : 'Accessible Navigation',
    report: lang === 'hi' ? 'नागरिक शिकायतें (Civic Grievances)' : 'Civic Grievances',
    travel: lang === 'hi' ? 'टिकाऊ यात्रा (Sustainable Travel)' : 'Sustainable Travel',
    cityImpact: lang === 'hi' ? 'शहरव्यापी प्रभाव (Citywide Impact)' : 'Citywide Impact',
    ask: lang === 'hi' ? 'एआई सहायक (AI City Saathi)' : 'AI Assistant',
    rewards: lang === 'hi' ? 'साथी पुरस्कार (Saathi Rewards)' : 'Saathi Rewards',
    authority: lang === 'hi' ? 'अधिकारी कंसोल (Authority Console)' : 'Authority Console',
  };

  const sampleNotifications = [
    {
      id: 'notif_1',
      title: 'Resolution Reward Disbursed',
      desc: 'Ticket CS-2026-4401 verified. 40 Saathi Points credited.',
      time: '10m ago',
      type: 'reward'
    },
    {
      id: 'notif_2',
      title: 'Green Commute Verified',
      desc: 'Metro route logged: 3.2 kg CO₂ avoided.',
      time: '2h ago',
      type: 'travel'
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      
      {/* Left side: Hamburger (Mobile) + Current Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {tabLabels[currentTab] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right side: Notifications, Language, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    onNavigateToTab('rewards');
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center gap-1 mx-auto"
                >
                  <span>View Points Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-700" />
          <span>{lang === 'en' ? 'हिन्दी' : 'EN'}</span>
        </button>

        {/* Profile Pill */}
        <button
          onClick={onOpenLogin}
          className={`flex items-center gap-2 py-1 px-2.5 rounded-xl text-xs font-bold transition-all border ${
            isOfficer 
              ? 'bg-slate-900 text-amber-300 border-slate-800' 
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
          }`}
          title="Switch Account / Login"
        >
          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
            isOfficer ? 'bg-amber-400 text-slate-950' : 'bg-emerald-700 text-white'
          }`}>
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-sm ${
            isOfficer ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-600'
          }`}>
            {isOfficer ? 'Officer' : 'Citizen'}
          </span>
        </button>

      </div>
    </header>
  );
};
