import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  KeyRound,
  Mail,
  MapPin,
  UserPlus
} from 'lucide-react';
import { Language, UserProfile, UserRole } from '../../types';
import { DEMO_PROFILES } from '../../data/initialData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (profile: UserProfile) => void;
  lang: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  lang,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  
  // Login form state
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone?.replace('+91 ', '') || '9876543210');
  const [otpCode, setOtpCode] = useState('4242');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWard, setRegWard] = useState('Ward 14 (South-West Zone)');
  const [regCity, setRegCity] = useState('New Delhi');

  if (!isOpen) return null;

  const handleQuickPreset = (role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const profile = DEMO_PROFILES[role];
      onLoginSuccess(profile);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const profile: UserProfile = {
        ...DEMO_PROFILES[selectedRole],
        phone: `+91 ${phoneNumber}`,
      };
      onLoginSuccess(profile);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newCitizen: UserProfile = {
        id: `usr_${Date.now().toString().slice(-6)}`,
        name: regName.trim(),
        role: 'citizen',
        ward: regWard,
        city: regCity,
        phone: `+91 ${regPhone.trim()}`,
        email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '')}@citizen.org`,
        citizenId: `CS-DL-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: 'Registered Resident Contributor',
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      onLoginSuccess(newCitizen);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-7 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-emerald-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Compass className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">CitySaathi Portal</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  Citizen & Authority
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                Ministry of Housing & Urban Affairs • Municipal Corporation
              </p>
            </div>
          </div>

          {/* Login / Register Toggle */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-white/10 rounded-xl border border-white/15 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'login' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Sign In (लॉगिन)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authMode === 'register' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-100 hover:text-white'
              }`}
            >
              New Citizen Registration (पंजीकरण)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          
          {authMode === 'login' ? (
            <>
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('citizen');
                      setPhoneNumber('9876543210');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedRole === 'citizen'
                        ? 'bg-white text-emerald-950 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className={`w-4 h-4 ${selectedRole === 'citizen' ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Citizen Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('officer');
                      setPhoneNumber('9811200414');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedRole === 'officer'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className={`w-4 h-4 ${selectedRole === 'officer' ? 'text-emerald-300' : 'text-slate-400'}`} />
                    <span>Municipal Officer</span>
                  </button>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">
                    {selectedRole === 'citizen' ? 'Demo Citizen: Ananya Sharma' : 'Demo Officer: Er. S. Verma'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedRole === 'citizen' ? 'Ward 14 Resident • 65 Saathi Points' : 'Executive Engineer • Grievance Authority'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(selectedRole)}
                  disabled={isSubmitting}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>1-Click Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Phone OTP Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Registered Mobile Number
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
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Enter OTP Code
                      </label>
                      <span className="text-[11px] text-emerald-700 font-bold">Demo OTP: 4242</span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-widest text-slate-800 focus:bg-white"
                        placeholder="4242"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  {otpSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Verify & Access Dashboard</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 text-emerald-300" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Full Name (पूरा नाम) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white"
                      placeholder="citizen@domain.com"
                    />
                  </div>
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white"
                    placeholder="New Delhi"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <UserPlus className="w-4 h-4 text-emerald-200" />
                <span>Create Citizen Account & Login</span>
              </button>
            </form>
          )}

          {/* Privacy & Legal */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>MoHUA Citizen Auth Standard</span>
            </span>
            <span>256-bit Secure</span>
          </div>

        </div>

      </div>
    </div>
  );
};
