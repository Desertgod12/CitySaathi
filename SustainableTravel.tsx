import React, { useState } from 'react';
import { 
  Footprints, 
  Bike, 
  Bus, 
  Train, 
  Car, 
  Leaf, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { TransportMode, SustainableTrip, Language } from '../../types';
import { EMISSION_FACTORS, REWARD_CONFIG } from '../../data/rewardRules';
import { impactService } from '../../services/impactService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';

interface SustainableTravelProps {
  trips: SustainableTrip[];
  onTripRecorded: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const SustainableTravel: React.FC<SustainableTravelProps> = ({
  trips,
  onTripRecorded,
  lang,
}) => {
  const [selectedMode, setSelectedMode] = useState<TransportMode>('bus');
  const [distanceKm, setDistanceKm] = useState<string>('5.0');
  const [fromLocation, setFromLocation] = useState<string>('Dwarka Sector 21 Terminal');
  const [toLocation, setToLocation] = useState<string>('Central Secretariat Transit Hub');
  const [tripDate, setTripDate] = useState<string>(new Date().toISOString().slice(0, 10));
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    points: number;
    co2: number;
    mode: string;
    distance: number;
    explanation: string;
  } | null>(null);

  const parsedDistance = parseFloat(distanceKm) || 0;

  // Calculation Math:
  // CO2 Avoided = max(0, (Baseline - Selected) * Distance)
  const baselineFactor = REWARD_CONFIG.baselineCarKgPerKm; // 0.192
  const selectedFactor = EMISSION_FACTORS[selectedMode]?.factorKgPerKm ?? 0.040;
  const savingsPerKm = Math.max(0, baselineFactor - selectedFactor);
  const estimatedCO2 = Number((savingsPerKm * parsedDistance).toFixed(2));

  let eligiblePoints = 0;
  if (selectedMode !== 'personal_vehicle' && parsedDistance > 0) {
    eligiblePoints = REWARD_CONFIG.tripBasePoints;
    if (selectedMode === 'walking' || selectedMode === 'cycling') {
      const bonus = Math.min(20, Math.round(parsedDistance * REWARD_CONFIG.activeMobilityPerKmBonus));
      eligiblePoints += bonus;
    }
  }

  const modes: { mode: TransportMode; icon: any; label: string; factor: number; desc: string }[] = [
    { mode: 'walking', icon: Footprints, label: 'Walking', factor: 0.0, desc: 'Zero emissions + bonus' },
    { mode: 'cycling', icon: Bike, label: 'Cycling', factor: 0.0, desc: 'Zero emissions' },
    { mode: 'bus', icon: Bus, label: 'City Bus', factor: 0.04, desc: '79% CO₂ avoided' },
    { mode: 'public_transport', icon: Train, label: 'Metro Rail', factor: 0.03, desc: '84% CO₂ avoided' },
    { mode: 'personal_vehicle', icon: Car, label: 'Private Car', factor: 0.192, desc: 'Baseline (0 pts)' },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fromLocation.trim()) errs.fromLocation = 'Starting location is required';
    if (!toLocation.trim()) errs.toLocation = 'Destination is required';
    if (!distanceKm || parsedDistance <= 0) {
      errs.distanceKm = 'Please enter a valid distance greater than 0 km';
    } else if (parsedDistance > 200) {
      errs.distanceKm = 'Distance exceeds single city commute limit (200 km)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const { trip, newlyUnlockedBadges } = impactService.recordSustainableTrip(
          selectedMode,
          parsedDistance,
          fromLocation.trim(),
          toLocation.trim()
        );

        const explanation = selectedMode === 'personal_vehicle'
          ? 'Personal combustion vehicles match baseline emissions (0.192 kg CO₂/km), yielding 0 kg savings.'
          : `Avoided ${(savingsPerKm).toFixed(3)} kg CO₂/km compared to personal vehicle baseline (0.192 kg/km). Total: ${trip.estimatedCO2Avoided} kg CO₂ saved.`;

        setSubmissionResult({
          points: trip.pointsAwarded,
          co2: trip.estimatedCO2Avoided,
          mode: EMISSION_FACTORS[selectedMode].name,
          distance: trip.distanceKm,
          explanation,
        });

        onTripRecorded(newlyUnlockedBadges);
      } catch (err: any) {
        alert(err.message || 'Error recording trip');
      } finally {
        setIsSubmitting(false);
      }
    }, 450);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sustainable Travel Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Record verified public transit and active mobility trips to calculate emissions avoided and earn Saathi Points.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Baseline: 0.192 kg CO₂/km</span>
        </div>
      </div>

      {/* 2. Success Result View (Shows after submission) */}
      {submissionResult ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                Trip Recorded Successfully!
              </h3>
              <p className="text-xs text-emerald-800">
                Your environmental contribution has been recorded in the platform ledger.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-white rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Mode</span>
              <span className="text-sm font-bold text-slate-900">{submissionResult.mode}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Distance</span>
              <span className="text-sm font-bold text-slate-900">{submissionResult.distance} km</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">CO₂ Avoided</span>
              <span className="text-sm font-black text-emerald-800">{submissionResult.co2} kg</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Points Earned</span>
              <span className="text-sm font-black text-amber-700">+{submissionResult.points} pts</span>
            </div>
          </div>

          <div className="p-3 bg-white/80 rounded-xl text-xs text-slate-600 border border-emerald-100">
            <strong>Calculation Method: </strong>{submissionResult.explanation}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button 
              size="sm"
              onClick={() => {
                setSubmissionResult(null);
                setDistanceKm('5.0');
              }}
            >
              Record Another Trip
            </Button>
          </div>
        </div>
      ) : (
        /* 3. Input Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-6">
          
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2.5">
              Select Transport Mode <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {modes.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMode === m.mode;
                return (
                  <button
                    key={m.mode}
                    type="button"
                    onClick={() => setSelectedMode(m.mode)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-2xs ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                      {m.factor === 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                          0-Emissions
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location and Distance Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Starting Location"
              required
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              error={errors.fromLocation}
              placeholder="e.g. Dwarka Sector 21"
              prefixIcon={<MapPin className="w-4 h-4" />}
            />

            <Input
              label="Destination"
              required
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              error={errors.toLocation}
              placeholder="e.g. Central Secretariat"
              prefixIcon={<MapPin className="w-4 h-4" />}
            />

            <Input
              label="Distance in Kilometres"
              required
              type="number"
              step="0.1"
              min="0.1"
              max="200"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              error={errors.distanceKm}
              placeholder="e.g. 5.0"
              suffixIcon={<span className="text-xs font-semibold text-slate-500">km</span>}
            />
          </div>

          {/* Date and Estimation Preview Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <Input
              label="Date of Travel"
              required
              type="date"
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
              prefixIcon={<Calendar className="w-4 h-4" />}
            />

            {/* Live Calculation Preview */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">Estimated Trip Outcome:</span>
                <p className="text-[11px] text-slate-500">
                  {selectedMode === 'personal_vehicle' 
                    ? 'Private vehicle baseline: 0 kg CO₂ avoided' 
                    : `Saves ~${savingsPerKm.toFixed(3)} kg CO₂ per km`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-800">
                    {estimatedCO2} kg CO₂
                  </div>
                  <div className="text-[10px] text-slate-400">avoided</div>
                </div>

                <div className="w-px h-6 bg-slate-200" />

                <div className="text-right">
                  <div className="text-sm font-black text-amber-700">
                    +{eligiblePoints} pts
                  </div>
                  <div className="text-[10px] text-slate-400">Saathi Points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="submit"
              size="md"
              isLoading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm & Record Trip
            </Button>
          </div>

        </form>
      )}

      {/* 4. Past Recorded Trips Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Recorded Sustainable Trips
            </h3>
            <p className="text-[11px] text-slate-400">
              Audit log of completed public transport and active transit journeys
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {trips.length} Total Trips
          </span>
        </div>

        {trips.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">CO₂ Avoided</th>
                  <th className="py-2.5 px-3">Points</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((t) => {
                  const mode = t.transportMode || (t as any).mode || 'bus';
                  const from = t.fromLocation || (t as any).from || 'Origin';
                  const to = t.toLocation || (t as any).to || 'Destination';
                  const date = t.createdAt ? t.createdAt.slice(0, 10) : ((t as any).date || 'Recently');
                  const points = t.pointsAwarded ?? (t as any).pointsEarned ?? 10;
                  const co2 = t.estimatedCO2Avoided ?? (t as any).co2AvoidedKg ?? 0;
                  const isConfirmed = t.verificationStatus === 'Confirmed' || (t as any).verified === true;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-600">{date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 capitalize">{mode.replace('_', ' ')}</td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[200px] truncate">{from} → {to}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{t.distanceKm} km</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-800">+{co2} kg</td>
                      <td className="py-2.5 px-3 font-black text-amber-700">+{points} pts</td>
                      <td className="py-2.5 px-3 text-right">
                        <StatusBadge status={isConfirmed ? 'Verified' : 'Pending'} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Footprints className="w-6 h-6" />}
            title="No sustainable trips recorded"
            description="Use the form above to record your first transit commute and begin earning points."
          />
        )}
      </div>

    </div>
  );
};
