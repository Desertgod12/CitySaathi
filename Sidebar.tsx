import React from 'react';
import { 
  LayoutDashboard,
  Compass, 
  AlertCircle, 
  Footprints,
  Globe2, 
  MessageSquareText, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  Globe, 
  X,
  ChevronRight,
  LogOut,
  User,
  ExternalLink
} from 'lucide-react';
import { Language, UserProfile } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenHowCalculated: () => void;
  onResetDemo: () => void;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  currentUser,
  isOpen,
  onClose,
  onOpenHowCalculated,
  onResetDemo,
  onOpenLogin,
}) => {
  const isOfficer = currentUser.role === 'officer';

  // Exactly the 8 required primary navigation items
  const navItems = [
    { 
      id: 'overview', 
      label: lang === 'hi' ? 'अवलोकन (Overview)' : 'Overview', 
      icon: LayoutDashboard 
    },
    { 
      id: 'navigate', 
      label: lang === 'hi' ? 'सुगम नेविगेशन' : 'Accessible Navigation', 
      icon: Compass 
    },
    { 
      id: 'report', 
      label: lang === 'hi' ? 'नागरिक शिकायतें' : 'Civic Grievances', 
      icon: AlertCircle 
    },
    { 
      id: 'travel', 
      label: lang === 'hi' ? 'टिकाऊ यात्रा' : 'Sustainable Travel', 
      icon: Footprints 
    },
    { 
      id: 'cityImpact', 
      label: lang === 'hi' ? 'शहरव्यापी प्रभाव' : 'Citywide Impact', 
      icon: Globe2 
    },
    { 
      id: 'ask', 
      label: lang === 'hi' ? 'एआई सहायक' : 'AI Assistant', 
      icon: MessageSquareText 
    },
    { 
      id: 'rewards', 
      label: lang === 'hi' ? 'साथी पुरस्कार' : 'Saathi Rewards', 
      icon: Award 
    },
    { 
      id: 'authority', 
      label: lang === 'hi' ? 'अधिकारी कंसोल' : 'Authority Console', 
      icon: ShieldCheck,
      badge: isOfficer ? 'Active' : undefined
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-xl lg:shadow-none flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentTab('overview');
              onClose();
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Compass className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">CitySaathi</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  2.0
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400">
                Inclusive Smart City Platform
              </p>
            </div>
          </button>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Primary Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main Navigation">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {lang === 'hi' ? 'सेवाएं' : 'Menu'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Secondary Utilities: User Profile, Language, Help, Reset */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          
          {/* User profile card */}
          <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <button
              onClick={() => {
                onOpenLogin();
                onClose();
              }}
              className="flex items-center gap-2 text-left min-w-0 group"
              title="Click to switch account"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isOfficer ? 'bg-amber-500 text-slate-950' : 'bg-emerald-700 text-white'
              }`}>
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {isOfficer ? 'Municipal Authority' : currentUser.ward}
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenLogin();
                onClose();
              }}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline px-1 py-0.5"
            >
              Switch
            </button>
          </div>

          {/* Secondary Controls: Language & Reset */}
          <div className="flex items-center gap-1.5 pt-1 text-xs">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Globe className="w-3 h-3 text-emerald-700" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            <button
              onClick={onOpenHowCalculated}
              className="py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
              title="Calculation scoring guide"
            >
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>Guide</span>
            </button>

            <button
              onClick={onResetDemo}
              className="py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 text-[11px] font-bold flex items-center justify-center transition-colors"
              title="Reset state to baseline"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};
