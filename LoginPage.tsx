import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  KeyRound, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  Sparkles, 
  Award, 
  Check, 
  QrCode,
  MapPin,
  Calendar,
  LogOut,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../../types';
import { DEMO_PROFILES } from '../../data/initialData';

interface LoginPageProps {
  currentUser: UserProfile;
  onLoginSuccess: (profile: UserProfile) => void;
  lang: Language;
  onNavigateToImpact: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  lang,
  onNavigateToImpact,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'otp' | 'officer' | 'register'>('quick');

  // Phone OTP State
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('4242');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpRole, setOtpRole] = useState<UserRole>('citizen');

  // Officer Credentials State
  const [officerId, setOfficerId] = useState('MCD-ENG-4402');
  const [officerPass, setOfficerPass] = useState('GovAdmin@2026');
  const [officerWard, setOfficerWard] = useState('Ward 14 (South-West Zone)');

  // Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWard, setRegWard] = useState('Ward 14 (South-West Zone)');
  const [regCity, setRegCity] = useState('New Delhi');
  const [regAccessibility, setRegAccessibility] = useState<string>('none');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleQuickLogin = (role: UserRole) => {
    const profile = DEMO_PROFILES[role];
    onLoginSuccess(profile);
    setFeedbackMsg(lang === 'hi' ? `${profile.name} के रूप में सफलतापूर्वक लॉगिन किया गया!` : `Signed in successfully as ${profile.name}!`);
    setTimeout(() => {
      setFeedbackMsg(null);
      onNavigateToImpact();
    }, 900);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpLoading(true);
      setTimeout(() => {
        setOtpLoading(false);
        setOtpSent(true);
      }, 400);
      return;
    }

    if (otpCode.trim() !== '4242' && otpCode.trim().length !== 4) {
      alert(lang === 'hi' ? 'कृपया मान्य 4-अंकीय ओटीपी दर्ज करें (डेमो: 4242)' : 'Please enter valid 4-digit OTP (Demo code: 4242)');
      return;
    }

    const baseProfile = DEMO_PROFILES[otpRole];
    const user: UserProfile = {
      ...baseProfile,
      phone: `+91 ${phoneNumber}`,
    };
    onLoginSuccess(user);
    setFeedbackMsg(lang === 'hi' ? 'ओटीपी सत्यापन सफल! डैशबोर्ड पर पुनर्निर्देशित किया जा रहा है...' : 'OTP Verified! Redirecting to dashboard...');
    setTimeout(() => {
      setFeedbackMsg(null);
      onNavigateToImpact();
    }, 800);
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const officerProfile: UserProfile = {
      ...DEMO_PROFILES.officer,
      citizenId: officerId,
      ward: officerWard,
    };
    onLoginSuccess(officerProfile);
    setFeedbackMsg(lang === 'hi' ? 'अधिकारी क्रेडेंशियल सत्यापित! स्वागत है, Er. S. Verma' : 'Authority Credentials Verified! Welcome Er. S. Verma');
    setTimeout(() => {
      setFeedbackMsg(null);
      onNavigateToImpact();
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert(lang === 'hi' ? 'कृपया नाम और मोबाइल नंबर दर्ज करें' : 'Please provide name and phone number');
      return;
    }

    const newCitizen: UserProfile = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: regName.trim(),
      role: 'citizen',
      ward: regWard,
      city: regCity,
      phone: `+91 ${regPhone.trim()}`,
      email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@delhi.gov.in`,
      citizenId: `CS-DL-${Math.floor(1000 + Math.random() * 9000)}`,
      designation: regAccessibility !== 'none' 
        ? `Citizen Contributor (${regAccessibility})` 
        : 'Active Resident Contributor',
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    onLoginSuccess(newCitizen);
    setFeedbackMsg(lang === 'hi' ? 'पंजीकरण सफल! आपका सिटी साथी डिजिटल कार्ड तैयार है।' : 'Registration Successful! Your CitySaathi card is ready.');
    setTimeout(() => {
      setFeedbackMsg(null);
      onNavigateToImpact();
    }, 900);
  };

  const isOfficer = currentUser.role === 'officer';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Success Notification Banner */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-800 text-white rounded-2xl flex items-center gap-3 shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="font-bold text-sm">{feedbackMsg}</span>
        </div>
      )}

      {/* Active Session & Digital Citizen ID Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md border-2 ${
              isOfficer ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-emerald-700 text-white border-emerald-400'
            }`}>
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser.name}</h2>
                <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isOfficer ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-emerald-950'
                }`}>
                  {isOfficer ? 'Municipal Authority Officer' : 'Verified Resident'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{currentUser.ward}, {currentUser.city}</span>
                </span>
                <span>•</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded-sm text-[11px] font-bold">
                  ID: {currentUser.citizenId}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined: {currentUser.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action to return to dashboard */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onNavigateToImpact}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-emerald-950 font-bold rounded-xl text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Go to My Impact Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Authentication & Registration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-1 overflow-x-auto">
          {[
            { id: 'quick', label: lang === 'hi' ? 'त्वरित 1-क्लिक एक्सेस' : '1-Click Quick Access', icon: Sparkles },
            { id: 'otp', label: lang === 'hi' ? 'मोबाइल ओटीपी लॉगिन' : 'Phone OTP Login', icon: Phone },
            { id: 'officer', label: lang === 'hi' ? 'नगर निगम अधिकारी लॉगिन' : 'Municipal Authority Login', icon: Building2 },
            { id: 'register', label: lang === 'hi' ? 'नया नागरिक पंजीकरण' : 'Register New Citizen', icon: UserPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-950 hover:bg-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          
          {/* TAB 1: 1-Click Quick Access for Demo & Testing */}
          {activeTab === 'quick' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'त्वरित डेमो प्रोफाइल चुनें' : 'Select a Test Identity'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === 'hi' 
                    ? 'बिना किसी पासवर्ड के तुरंत नागरिक या नगर निगम अधिकारी की भूमिका में स्विच करें।'
                    : 'Switch instantly between Citizen and Municipal Authority roles to test all platform features.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Citizen Card */}
                <div className={`p-5 rounded-2xl border-2 transition-all ${
                  !isOfficer 
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                        AS
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Ananya Sharma</h4>
                        <p className="text-xs text-slate-500">Citizen Resident • Ward 14</p>
                      </div>
                    </div>
                    {!isOfficer && (
                      <span className="px-2 py-0.5 bg-emerald-700 text-white rounded-full text-[10px] font-bold">
                        Current Active
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Saathi Points Balance:</span>
                      <strong className="text-emerald-800 font-bold">65 Points</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Personal Impact Score:</span>
                      <strong className="text-slate-800 font-bold">124</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Verified Actions:</span>
                      <span className="text-slate-700 font-semibold">2 Trips • 1 Resolved Complaint</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin('citizen')}
                    className="mt-4 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Switch to Citizen Identity</span>
                  </button>
                </div>

                {/* Municipal Authority Card */}
                <div className={`p-5 rounded-2xl border-2 transition-all ${
                  isOfficer 
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20' 
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-lg">
                        SV
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Er. S. Verma</h4>
                        <p className="text-xs text-slate-500">Executive Engineer • Grievance Authority</p>
                      </div>
                    </div>
                    {isOfficer && (
                      <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold">
                        Current Active
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Official Jurisdictional ID:</span>
                      <strong className="text-slate-900 font-mono font-bold">MCD-ENG-4402</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Authority Power:</span>
                      <strong className="text-amber-800 font-bold">Inspect, Verify & Disburse Points</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Jurisdiction:</span>
                      <span className="text-slate-700 font-semibold">South-West Municipal Zone</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin('officer')}
                    className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Switch to Municipal Authority</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Mobile Phone OTP Authentication */}
          {activeTab === 'otp' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'मोबाइल नंबर से सुरक्षित लॉगिन' : 'Sign In with Mobile OTP'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === 'hi' 
                    ? 'अपने पंजीकृत मोबाइल नंबर पर 4-अंकीय ओटीपी प्राप्त करें।' 
                    : 'Enter your 10-digit mobile number to receive a secure one-time passcode.'}
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                
                {/* Account Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpRole('citizen');
                        setPhoneNumber('9876543210');
                      }}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        otpRole === 'citizen'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>Citizen Resident</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOtpRole('officer');
                        setPhoneNumber('9811200414');
                      }}
                      className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        otpRole === 'officer'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-amber-300" />
                      <span>Municipal Official</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    10-Digit Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-600"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                {/* OTP Field (shows after button clicked) */}
                {otpSent && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Enter 4-Digit OTP Code
                      </label>
                      <span className="text-xs text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                        Demo OTP: 4242
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        maxLength={4}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-base font-mono font-bold tracking-widest text-slate-900"
                        placeholder="4242"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  {otpLoading ? (
                    <span>Sending SMS...</span>
                  ) : otpSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Verify OTP & Enter Portal</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 text-emerald-200" />
                      <span>Request One-Time Password (OTP)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Municipal Officer Login */}
          {activeTab === 'officer' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'नगर निगम अधिकारी / कर्मचारी पोर्टल' : 'Municipal Authority & Staff Access'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === 'hi' 
                    ? 'शिकायत समीक्षा, सत्यापन व साधी अंक संवितरण हेतु आधिकारिक लॉगिन।' 
                    : 'Official console for municipal engineers to verify civic complaints and disburse Saathi Points.'}
                </p>
              </div>

              <form onSubmit={handleOfficerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Government Staff / Officer ID
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white"
                    placeholder="MCD-ENG-4402"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Assigned Ward / Jurisdiction
                  </label>
                  <select
                    value={officerWard}
                    onChange={(e) => setOfficerWard(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                  >
                    <option value="Ward 14 (South-West Zone)">Ward 14 (South-West Zone)</option>
                    <option value="Ward 22 (Central Zone)">Ward 22 (Central Zone)</option>
                    <option value="Ward 08 (North Zone)">Ward 08 (North Zone)</option>
                    <option value="Ward 41 (East Zone)">Ward 41 (East Zone)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Secure Passcode / Security Key
                  </label>
                  <input
                    type="password"
                    value={officerPass}
                    onChange={(e) => setOfficerPass(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white"
                    placeholder="••••••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Authorize & Access Resolution Console</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Citizen Registration Form */}
          {activeTab === 'register' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'नया नागरिक खाता बनाएं' : 'Register for CitySaathi Platform'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {lang === 'hi' 
                    ? 'शिकायत दर्ज करने, टिकाऊ यात्रा लॉग करने व साधी पुरस्कार अर्जित करने हेतु नामांकन करें।' 
                    : 'Join your smart city community, log green commutes, and get rewarded for civic reporting.'}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Full Name (पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">+91</div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        required
                        maxLength={10}
                        className="w-full pl-11 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white"
                      placeholder="citizen@domain.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Municipal Ward
                    </label>
                    <select
                      value={regWard}
                      onChange={(e) => setRegWard(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                    >
                      <option value="Ward 14 (South-West Zone)">Ward 14 (South-West Zone)</option>
                      <option value="Ward 22 (Central Zone)">Ward 22 (Central Zone)</option>
                      <option value="Ward 08 (North Zone)">Ward 08 (North Zone)</option>
                      <option value="Ward 41 (East Zone)">Ward 41 (East Zone)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white"
                      placeholder="New Delhi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Accessibility Preference (Optional)
                  </label>
                  <select
                    value={regAccessibility}
                    onChange={(e) => setRegAccessibility(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white"
                  >
                    <option value="none">No specific accommodation required</option>
                    <option value="Wheelchair User">Wheelchair User (Step-free ramp priority)</option>
                    <option value="Visually Impaired">Visually Impaired (Tactile paving & audio priority)</option>
                    <option value="Senior Citizen">Senior Citizen (Low-walking & elevator routes)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <UserPlus className="w-4 h-4 text-emerald-200" />
                  <span>Generate Citizen Saathi Card & Sign In</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Trust & Governance Footer */}
      <div className="p-4 bg-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Compliant with Ministry of Housing & Urban Affairs Open Digital Infrastructure Standard</span>
        </div>
        <div className="font-mono text-[11px]">
          Citizen Data Protected • Zero Commercial Monetization
        </div>
      </div>

    </div>
  );
};