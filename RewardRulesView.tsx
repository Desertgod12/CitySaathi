import React from 'react';
import { 
  BookOpen, 
  Leaf, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../data/translations';
import { REWARD_CONFIG, EMISSION_FACTORS } from '../../data/rewardRules';

interface RewardRulesViewProps {
  lang: Language;
}

export const RewardRulesView: React.FC<RewardRulesViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'hi' ? 'पारदर्शी नियम और नीतियां' : 'Open Civic Governance'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t.rulesView.title}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t.rulesView.subtitle}
        </p>
      </div>

      {/* Non-Monetary Disclaimer (Section 9 requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Civic Recognition Principle:</strong> CitySaathi points and badges represent civic recognition, volunteer contribution, and environmental impact. They cannot be converted to cash, financial instruments, or monetary rewards.
        </p>
      </div>

      {/* The 4 Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. CO2 Avoided Formula */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.rulesView.co2FormulaTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.rulesView.co2FormulaBody}
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 font-mono text-xs text-slate-800 space-y-1">
            <p className="font-bold text-emerald-800">CO₂ Avoided = (0.192 - Factor) × Distance</p>
            <p className="text-[11px] text-slate-500 font-sans">
              • Walking / Cycling: 0.000 kg/km (100% saved)<br />
              • City CNG/Electric Bus: 0.040 kg/km (~79% saved)<br />
              • Metro / Train: 0.030 kg/km (~84% saved)<br />
              • Private Vehicle Baseline: 0.192 kg/km (0 saved)
            </p>
          </div>
        </div>

        {/* 2. Saathi Points Structure */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.rulesView.pointsFormulaTitle}
            </h3>
          </div>

          <ul className="text-xs text-slate-600 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.rulesView.pointsRule1}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.rulesView.pointsRule2}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.rulesView.pointsRule3}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t.rulesView.pointsRule4}</span>
            </li>
          </ul>
        </div>

        {/* 3. Personal Impact Score */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.rulesView.scoreFormulaTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.rulesView.scoreFormulaBody}
          </p>

          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-medium">
            <strong>Transparent Separation:</strong> Saathi Points represent redeemable recognition, while Impact Score reflects verified civic quality. Refreshing pages or submitting duplicate forms cannot game this score.
          </div>
        </div>

        {/* 4. Anti-Duplicate & Verification Integrity */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t.rulesView.antiCheatTitle}
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t.rulesView.antiCheatBody}
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <p>• <strong>Idempotency:</strong> Reports resolved by authorities reward points exactly once.</p>
            <p>• <strong>Audit Ledger:</strong> Every transaction is logged with reference IDs and timestamps.</p>
            <p>• <strong>Reversals:</strong> Audits can revoke points with a documented reason if an entry is rejected.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
