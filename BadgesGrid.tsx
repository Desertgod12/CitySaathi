import React from 'react';
import { 
  Award, 
  ShieldAlert, 
  Leaf, 
  Accessibility, 
  Crown, 
  Lock, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { UserBadge, UserImpact, Language } from '../../types';
import { BADGE_DEFINITIONS } from '../../data/rewardRules';
import { StatusBadge } from '../ui/StatusBadge';

interface BadgesGridProps {
  userBadges: UserBadge[];
  userImpact: UserImpact;
  onSelectBadge: (badgeId: string) => void;
  lang: Language;
}

export const BadgesGrid: React.FC<BadgesGridProps> = ({
  userBadges,
  userImpact,
  onSelectBadge,
  lang,
}) => {
  const unlockedMap = new Map(userBadges.map(b => [b.badgeId, b.unlockedAt]));

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Leaf':
        return Leaf;
      case 'Accessibility':
        return Accessibility;
      case 'Crown':
        return Crown;
      case 'Award':
      default:
        return Award;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Saathi Badges & Milestones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Earn official civic milestones for verified community actions and sustainable mobility.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          <strong className="text-emerald-800 font-bold">{userBadges.length}</strong> of {BADGE_DEFINITIONS.length} Unlocked
        </div>
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BADGE_DEFINITIONS.map((badge) => {
          const isUnlocked = unlockedMap.has(badge.id);
          const unlockedDate = unlockedMap.get(badge.id);
          const Icon = getBadgeIcon(badge.icon);

          return (
            <div
              key={badge.id}
              onClick={() => isUnlocked && onSelectBadge(badge.id)}
              className={`p-5 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-white border-emerald-300 shadow-2xs hover:shadow-xs hover:border-emerald-500 cursor-pointer'
                  : 'bg-slate-50/70 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  isUnlocked 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <StatusBadge 
                  status={isUnlocked ? 'Active' : 'Locked'} 
                  size="sm" 
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  {badge.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500">
                  Condition:
                </span>
                <span className="font-bold text-slate-800">
                  {badge.requirement}
                </span>
              </div>

              {isUnlocked && unlockedDate && (
                <div className="mt-2 text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Unlocked on {unlockedDate}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
