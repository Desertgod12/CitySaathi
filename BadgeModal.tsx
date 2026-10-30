import React from 'react';
import { Award, CheckCircle2, X, Sparkles } from 'lucide-react';
import { BADGE_DEFINITIONS } from '../../data/rewardRules';
import { Language } from '../../types';

interface BadgeModalProps {
  badgeId: string | null;
  onClose: () => void;
  lang: Language;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ badgeId, onClose, lang }) => {
  if (!badgeId) return null;
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon Highlight */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg ring-8 ring-emerald-50 mb-5">
          <Award className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'नया बैज अनलॉक हुआ!' : 'Badge Unlocked!'}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          {lang === 'hi' ? badge.nameHi : badge.name}
        </h3>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {lang === 'hi' ? badge.descriptionHi : badge.description}
        </p>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? 'सत्यापित मानदंड' : 'Verified Requirement'}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 pl-6">
            {lang === 'hi' ? badge.requirementHi : badge.requirement}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
        >
          {lang === 'hi' ? 'शानदार! जारी रखें' : 'Awesome! Keep Impacting'}
        </button>
      </div>
    </div>
  );
};
