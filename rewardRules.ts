import { EmissionFactor, RewardConfig, Badge } from '../types';

export const REWARD_CONFIG: RewardConfig = {
  baselineCarKgPerKm: 0.192, // Average Indian urban car/petrol two-wheeler equivalent
  tripBasePoints: 10,        // Standard points for completed qualifying trip
  activeMobilityPerKmBonus: 2, // Extra points per km walked/cycled (max 20)
  maxTripDistanceKm: 100,
  reportSubmissionPoints: 0, // In compliance with requirement: Valid report accepted = 0 pts
  resolvedCivicPoints: 25,   // Verified and resolved civic issue
  resolvedAccessibilityPoints: 40, // Verified accessibility issue resolved
  impactScoreMultipliers: {
    resolvedCivic: 20,
    resolvedAccessibility: 35,
    sustainableTrip: 15,
    co2Kg: 2,
  },
};

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  walking: {
    mode: 'walking',
    name: 'Walking (Foot)',
    nameHi: 'पैदल यात्रा',
    factorKgPerKm: 0.0,
    icon: 'Footprints',
  },
  cycling: {
    mode: 'cycling',
    name: 'Bicycle / E-cycle',
    nameHi: 'साइकिल / ई-साइकिल',
    factorKgPerKm: 0.0,
    icon: 'Bike',
  },
  bus: {
    mode: 'bus',
    name: 'Electric/CNG City Bus',
    nameHi: 'सिटी बस (इलेक्ट्रिक / सीएनजी)',
    factorKgPerKm: 0.040,
    icon: 'Bus',
  },
  public_transport: {
    mode: 'public_transport',
    name: 'Metro / Suburban Rail',
    nameHi: 'मेट्रो / लोकल ट्रेन',
    factorKgPerKm: 0.030,
    icon: 'Train',
  },
  personal_vehicle: {
    mode: 'personal_vehicle',
    name: 'Personal Car / Petrol Bike (Baseline)',
    nameHi: 'निजी वाहन / कार (बेसलाइन)',
    factorKgPerKm: 0.192,
    icon: 'Car',
  },
};

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'civic-reporter',
    name: 'Civic Reporter',
    nameHi: 'नागरिक रिपोर्टर',
    description: 'Earned after your first eligible civic report is successfully verified and resolved.',
    descriptionHi: 'आपकी पहली नागरिक रिपोर्ट के सत्यापन और समाधान के बाद प्राप्त।',
    requirement: '1 verified civic report resolved',
    requirementHi: '1 सत्यापित नागरिक शिकायत का समाधान',
    icon: 'ShieldAlert',
    category: 'civic',
    targetCount: 1,
    currentCountType: 'resolvedReports',
  },
  {
    id: 'green-commuter',
    name: 'Green Commuter',
    nameHi: 'हरित यात्री',
    description: 'Earned after completing 5 qualifying sustainable transit trips (bus, metro, cycling, or walking).',
    descriptionHi: '5 प्रमाणित टिकाऊ सार्वजनिक या गैर-प्रदूषणकारी यात्राएं पूरी करने पर।',
    requirement: '5 qualifying sustainable trips',
    requirementHi: '5 प्रमाणित टिकाऊ यात्राएं',
    icon: 'Leaf',
    category: 'environment',
    targetCount: 5,
    currentCountType: 'sustainableTrips',
  },
  {
    id: 'accessibility-champion',
    name: 'Accessibility Champion',
    nameHi: 'सुगमता चैंपियन',
    description: 'Earned after contributing to 3 verified and resolved accessibility barrier reports.',
    descriptionHi: 'दिव्यांगों और बुजुर्गों के लिए 3 सुगमता बाधाओं के समाधान में योगदान।',
    requirement: '3 verified accessibility issues resolved',
    requirementHi: '3 सुगमता शिकायतों का समाधान',
    icon: 'Accessibility',
    category: 'accessibility',
    targetCount: 3,
    currentCountType: 'resolvedAccessibilityReports',
  },
  {
    id: 'community-hero',
    name: 'Community Hero',
    nameHi: 'समुदाय नायक',
    description: 'Earned after earning 100 Saathi Points through verified civic and green contributions.',
    descriptionHi: 'सत्यापित नागरिक और हरित योगदानों के माध्यम से 100 साथी पॉइंट्स अर्जित करने पर।',
    requirement: 'Reach 100 total Saathi Points',
    requirementHi: 'कुल 100 साथी पॉइंट्स अर्जित करें',
    icon: 'Award',
    category: 'community',
    targetCount: 100,
    currentCountType: 'totalPoints',
  },
  {
    id: 'city-guardian',
    name: 'City Guardian',
    nameHi: 'नगर संरक्षक',
    description: 'Master civic milestone: Reached an Impact Score of 250 with substantial community change.',
    descriptionHi: 'सर्वोच्च नागरिक उपलब्धि: शहर को बेहतर बनाने में 250 प्रभाव स्कोर प्राप्त किया।',
    requirement: 'Reach 250 Impact Score',
    requirementHi: '250 प्रभाव स्कोर हासिल करें',
    icon: 'Crown',
    category: 'guardian',
    targetCount: 250,
    currentCountType: 'impactScore',
  },
];
