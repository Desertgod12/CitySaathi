import React from 'react';
import { X, HelpCircle, Check, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { REWARD_CONFIG } from '../../data/rewardRules';

interface ImpactCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ImpactCalculationModal: React.FC<ImpactCalculationModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'hi' ? 'मेरे प्रभाव और पॉइंट्स की गणना कैसे होती है?' : 'How is My Impact Calculated?'}
          </h3>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {lang === 'hi'
            ? 'सिटी साथी केवल क्लिक या खोजों को नहीं गिनता। आपका प्रभाव स्कोर और पॉइंट्स वास्तविक, सत्यापित नागरिक और पर्यावरणीय कार्यों पर आधारित हैं।'
            : 'CitySaathi never rewards mere clicks or passive browsing. Your Impact Score and Saathi Points reflect tangible, verified civic and sustainable actions.'}
        </p>

        <div className="space-y-4">
          
          {/* Formula 1: CO2 */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm mb-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? '1. अनुमानित CO₂ बचत का सूत्र' : '1. Estimated CO₂ Avoided Formula'}</span>
            </div>
            <div className="p-3 bg-white rounded-xl font-mono text-xs text-emerald-900 border border-emerald-200 mb-2">
              CO₂ Avoided (kg) = (Baseline Private Car 0.192 - Mode Factor) × Distance (km)
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>{lang === 'hi' ? 'पैदल व साइकिल: 0.000 किग्रा/किमी (100% कार्बन बचत)' : 'Walking & Cycling: 0.000 kg/km (100% emission reduction)'}</li>
              <li>{lang === 'hi' ? 'सीएनजी/इलेक्ट्रिक सिटी बस: 0.040 किग्रा/किमी' : 'City Bus: 0.040 kg/km (Saves ~0.152 kg/km)'}</li>
              <li>{lang === 'hi' ? 'मेट्रो रेल: 0.030 किग्रा/किमी' : 'Metro Transit: 0.030 kg/km (Saves ~0.162 kg/km)'}</li>
            </ul>
          </div>

          {/* Formula 2: Points */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? '2. साथी पॉइंट्स अर्जन नियम' : '2. Saathi Points Award Rules'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <strong>{lang === 'hi' ? 'टिकाऊ यात्रा:' : 'Sustainable Trip:'}</strong> {REWARD_CONFIG.tripBasePoints} {lang === 'hi' ? 'पॉइंट्स + पैदल/साइकिल पर 2 अंक/किमी' : 'base points + 2 pts/km active mobility'}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <strong>{lang === 'hi' ? 'रिपोर्ट दर्ज करना:' : 'Report Submission:'}</strong> 0 {lang === 'hi' ? 'पॉइंट्स (स्पैम से बचाव हेतु)' : 'points (to prevent fraudulent filing)'}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <strong>{lang === 'hi' ? 'सत्यापित सामान्य समस्या समाधान:' : 'Resolved Civic Issue:'}</strong> {REWARD_CONFIG.resolvedCivicPoints} {lang === 'hi' ? 'पॉइंट्स' : 'points'}
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-300 bg-emerald-50/30">
                <strong>{lang === 'hi' ? 'सत्यापित सुगमता समाधान:' : 'Resolved Accessibility Issue:'}</strong> {REWARD_CONFIG.resolvedAccessibilityPoints} {lang === 'hi' ? 'पॉइंट्स' : 'points'}
              </div>
            </div>
          </div>

          {/* Formula 3: Impact Score */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? '3. व्यक्तिगत प्रभाव स्कोर (Impact Score)' : '3. Personal Impact Score Formulation'}</span>
            </div>
            <div className="p-3 bg-white rounded-xl font-mono text-xs text-slate-800 border border-amber-200 mb-2">
              Impact Score = (Resolved Civic × 20) + (Resolved Accessibility × 35) + (Sustainable Trips × 15) + (CO₂ Saved kg × 2)
            </div>
            <p className="text-xs text-slate-600">
              {lang === 'hi'
                ? 'यह स्कोर एक नागरिक के रूप में शहर को अधिक सुलभ और पर्यावरण-अनुकूल बनाने में आपके समग्र योगदान को दर्शाता है।'
                : 'This score separates recognition points from lasting civic quality, measuring real improvements in physical accessibility and clean mobility.'}
            </p>
          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {lang === 'hi' ? 'समझ गया' : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
};
