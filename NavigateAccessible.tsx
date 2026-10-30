import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Accessibility, 
  Bus, 
  Train, 
  Footprints, 
  Navigation, 
  CheckCircle2, 
  Leaf, 
  Sparkles, 
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';
import { Language, TransportMode } from '../../types';
import { impactService } from '../../services/impactService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NavigateAccessibleProps {
  onTripRecorded: (unlockedBadges: string[]) => void;
  lang: Language;
}

export const NavigateAccessible: React.FC<NavigateAccessibleProps> = ({
  onTripRecorded,
  lang,
}) => {
  const [origin, setOrigin] = useState('Sector 14 Resident Enclave');
  const [destination, setDestination] = useState('Central Metro Transit Hub');
  
  // Accessibility toggles
  const [prefWheelchair, setPrefWheelchair] = useState(true);
  const [prefElevator, setPrefElevator] = useState(true);
  const [prefAudioTactile, setPrefAudioTactile] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [routeResult, setRouteResult] = useState<{
    routeName: string;
    distanceKm: number;
    durationMins: number;
    mode: TransportMode;
    co2Avoided: number;
    steps: { text: string; tag: string; icon: any }[];
  } | null>({
    routeName: 'Primary Step-Free Corridor via Metro Line 2',
    distanceKm: 8.5,
    durationMins: 22,
    mode: 'public_transport',
    co2Avoided: 1.38,
    steps: [
      { text: 'Board low-floor feeder bus at Sector 14 Stop (Level entry ramp deployed)', tag: 'Step-Free Ramp', icon: Bus },
      { text: 'Disembark at Interchange Station; take Elevator B to concourse level', tag: 'Working Elevator', icon: Navigation },
      { text: 'Board Metro Line 2 (Dedicated wheelchair bay at car #2)', tag: 'Accessible Train', icon: Train },
      { text: 'Exit at Central Metro Gate 2 with continuous tactile guiding paving', tag: 'Braille & Tactile', icon: Accessibility },
    ],
  });

  const [recordedSuccess, setRecordedSuccess] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setRouteResult({
        routeName: `Direct Step-Free Transit: ${origin} → ${destination}`,
        distanceKm: 6.2,
        durationMins: 18,
        mode: 'public_transport',
        co2Avoided: 1.01,
        steps: [
          { text: `Depart ${origin} via continuous step-free footpath`, tag: 'Wheelchair Ramp', icon: Footprints },
          { text: 'Transit via Electric City Bus with low-floor step-free ramp', tag: 'Accessible Transit', icon: Bus },
          { text: `Arrive at ${destination} with elevator access to platform`, tag: 'Elevator Active', icon: Train },
        ],
      });
      setRecordedSuccess(null);
    }, 400);
  };

  const handleRecordJourney = () => {
    if (!routeResult) return;
    try {
      const { trip, newlyUnlockedBadges } = impactService.recordSustainableTrip(
        routeResult.mode,
        routeResult.distanceKm,
        origin,
        destination
      );
      setRecordedSuccess(`Journey recorded! Earned +${trip.pointsAwarded} Saathi Points and avoided ${trip.estimatedCO2Avoided} kg CO₂.`);
      onTripRecorded(newlyUnlockedBadges);
    } catch (err: any) {
      alert(err.message || 'Error recording journey');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Accessible Route Planning
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover step-free, barrier-free pedestrian walkways, wheelchair ramps, and public transit directions.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-800 rounded-xl border border-teal-200 flex items-center gap-1.5 self-start sm:self-auto">
          <Accessibility className="w-3.5 h-3.5 text-teal-600" />
          <span>MoHUA Harmonised Guidelines 2021 Compliant</span>
        </div>
      </div>

      {/* 2. Route Planner Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Origin (प्रस्थान)"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Enter starting street or landmark"
            prefixIcon={<MapPin className="w-4 h-4 text-emerald-600" />}
          />

          <Input
            label="Destination (गंतव्य)"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination transit stop or facility"
            prefixIcon={<MapPin className="w-4 h-4 text-rose-500" />}
          />
        </div>

        {/* Accessibility Preferences */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Accessibility Filters
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPrefWheelchair(!prefWheelchair)}
              className={`px-3 py-2 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
                prefWheelchair 
                  ? 'bg-teal-50 text-teal-900 border-teal-300 shadow-2xs' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${prefWheelchair ? 'text-teal-700' : 'text-slate-300'}`} />
              <span>Step-Free Ramp Priority</span>
            </button>

            <button
              type="button"
              onClick={() => setPrefElevator(!prefElevator)}
              className={`px-3 py-2 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
                prefElevator 
                  ? 'bg-teal-50 text-teal-900 border-teal-300 shadow-2xs' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${prefElevator ? 'text-teal-700' : 'text-slate-300'}`} />
              <span>Elevator / Lift Priority</span>
            </button>

            <button
              type="button"
              onClick={() => setPrefAudioTactile(!prefAudioTactile)}
              className={`px-3 py-2 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
                prefAudioTactile 
                  ? 'bg-teal-50 text-teal-900 border-teal-300 shadow-2xs' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${prefAudioTactile ? 'text-teal-700' : 'text-slate-300'}`} />
              <span>Tactile & Audio Signals</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-100">
          <Button
            type="submit"
            isLoading={isSearching}
            icon={<Search className="w-4 h-4" />}
          >
            Find Accessible Route
          </Button>
        </div>
      </form>

      {/* 3. Success Notification if Journey Recorded */}
      {recordedSuccess && (
        <div className="p-4 bg-emerald-100 text-emerald-950 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{recordedSuccess}</span>
          </span>
          <button onClick={() => setRecordedSuccess(null)} className="underline ml-3">Close</button>
        </div>
      )}

      {/* 4. Route Result Card */}
      {routeResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Verified Step-Free
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {routeResult.distanceKm} km • ~{routeResult.durationMins} mins
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {routeResult.routeName}
              </h3>
            </div>

            <Button
              size="sm"
              onClick={handleRecordJourney}
              icon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            >
              Record Trip (+10 pts)
            </Button>
          </div>

          {/* Step-by-Step Waypoints */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-slate-500">
              Verified Navigation Checkpoints
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {routeResult.steps.map((st, i) => {
                const Icon = st.icon;
                return (
                  <div key={i} className="relative flex items-start justify-between gap-3 text-xs">
                    <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-slate-800">{st.text}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                      {st.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental Savings Tag */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>Environmental Avoidance Factor:</span>
            </span>
            <span className="font-bold">+{routeResult.co2Avoided} kg CO₂ saved vs. car</span>
          </div>
        </div>
      )}

    </div>
  );
};
