import React from 'react';
import { 
  Compass, 
  MessageSquareText, 
  AlertCircle, 
  Award, 
  Globe2, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X,
  BookOpen,
  User,
  LogIn,
  Building2
} from 'lucide-react';
import { Language, UserImpact, UserProfile } from '../../types';
import { translations } from '../../data/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  userImpact: UserImpact;
  currentUser: UserProfile;
  onOpenLogin: () => void;
  onResetDemo: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  userImpact,
  currentUser,
  onOpenLogin,
  onResetDemo,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'myImpact', label: t.nav.myImpact, icon: Award, highlight: true },
    { id: 'report', label: lang === 'hi' ? 'नागरिक शिकायतें' : 'Civic Grievances', icon: AlertCircle },
    { id: 'navigate', label: t.nav.navigate, icon: Compass },
    { id: 'ask', label: t.nav.ask, icon: MessageSquareText },
    { id: 'cityImpact', label: t.nav.cityImpact, icon: Globe2 },
    { id: 'rules', label: t.nav.rules, icon: BookOpen },
  ];

  const isOfficer = currentUser.role === 'officer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('myImpact')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden"
              aria-label="CitySaathi Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-950 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
                <Compass className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-emerald-950">CitySaathi</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Smart City Portal
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-800/80 -mt-0.5">
                  {lang === 'hi' ? 'समावेशी स्मार्ट-सिटी प्लेटफॉर्म' : 'Inclusive Smart-City Platform'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : item.highlight
                      ? 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : item.highlight ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Points, Login / Switch, Lang, and Admin Controls */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Saathi Points Badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-900 text-xs font-semibold shadow-xs"
              title="Your auditable Saathi Points balance"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>
                <strong className="text-emerald-950 font-black text-sm">{userImpact.totalPoints}</strong> {t.userHeader.saathiPoints}
              </span>
            </div>

            {/* Impact Score Badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-xs font-medium"
              title="Personal Impact Score based on verified actions"
            >
              <span className="text-[11px] text-slate-500 font-semibold">{t.userHeader.impactScore}:</span>
              <strong className="text-slate-900 font-bold text-sm">{userImpact.impactScore}</strong>
            </div>

            {/* User Profile / Login Pill */}
            <button
              onClick={onOpenLogin}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs ${
                isOfficer 
                  ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800' 
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-300'
              }`}
              title="Click to Switch Account or Login"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-black ${
                isOfficer ? 'bg-amber-500 text-slate-950' : 'bg-emerald-700'
              }`}>
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded-sm">
                {isOfficer ? 'Authority' : 'Resident'}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-emerald-800 transition-colors"
              aria-label="Switch Language between English and Hindi"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Authority Console Simulator Trigger */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-xs"
              title="Open municipal resolution console to simulate verification"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
              <span>Authority Console</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={onResetDemo}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Reset data to default state"
              aria-label="Reset Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="p-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200"
            >
              <User className="w-4 h-4 inline" />
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 text-xs font-bold rounded-md border border-slate-200 text-slate-700"
            >
              {lang === 'en' ? 'HI' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-emerald-50 text-emerald-900 font-bold rounded-full">
                ⭐ {userImpact.totalPoints} Points
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded-full">
                Score: {userImpact.impactScore}
              </span>
            </div>
            <button
              onClick={onResetDemo}
              className="text-xs text-rose-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Account: {currentUser.name} ({currentUser.role})</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authority Resolution Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
