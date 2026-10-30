export type Language = 'en' | 'hi';

export type UserRole = 'citizen' | 'officer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  ward: string;
  city: string;
  phone?: string;
  email?: string;
  citizenId: string;
  designation?: string;
  joinedDate?: string;
}

export type TransportMode = 'walking' | 'cycling' | 'bus' | 'public_transport' | 'personal_vehicle';

export type ReportCategory = 'accessibility' | 'road_footpath' | 'streetlight' | 'sanitation_waste' | 'water_drainage';

export type ReportStatus = 
  | 'Submitted' 
  | 'Accepted' 
  | 'Under Review' 
  | 'Verified' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Rejected';

export interface UserImpact {
  userId: string;
  totalPoints: number;
  impactScore: number;
  totalCO2Avoided: number; // in kg
  sustainableTrips: number;
  resolvedReports: number;
  resolvedAccessibilityReports: number;
  communityContributions: number;
  updatedAt: string;
}

export interface SustainableTrip {
  id: string;
  userId: string;
  transportMode: TransportMode;
  distanceKm: number;
  baselineMode: 'personal_vehicle';
  estimatedCO2Avoided: number; // in kg
  pointsAwarded: number;
  verificationStatus: 'Confirmed' | 'Pending';
  fromLocation?: string;
  toLocation?: string;
  notes?: string;
  createdAt: string;
}

export interface CivicContribution {
  id: string;
  userId: string;
  reportId: string;
  title: string;
  description: string;
  category: ReportCategory;
  isAccessibilityIssue: boolean;
  location: string;
  imageUrl?: string;
  status: ReportStatus;
  pointsAwarded: number;
  submittedAt: string;
  acceptedAt?: string;
  resolvedAt?: string;
  communityImpactSummary?: string;
  verifiedBy?: string;
  assignedDepartment?: string;
  priority?: 'Standard' | 'High' | 'Urgent Accessibility';
  officialRemarks?: string;
}

export type ActivityType = 
  | 'SUSTAINABLE_TRIP' 
  | 'CIVIC_RESOLUTION' 
  | 'ACCESSIBILITY_RESOLUTION' 
  | 'COMMUNITY_VERIFICATION' 
  | 'DEMO_BONUS'
  | 'REVERSAL';

export interface SaathiTransaction {
  id: string;
  userId: string;
  activityType: ActivityType;
  referenceId: string;
  points: number;
  reason: string;
  verificationStatus: 'VERIFIED' | 'RESOLVED' | 'AUDITED' | 'REVERSED';
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  requirement: string;
  requirementHi: string;
  icon: string;
  category: 'civic' | 'environment' | 'accessibility' | 'community' | 'guardian';
  targetCount: number;
  currentCountType: 'resolvedReports' | 'sustainableTrips' | 'resolvedAccessibilityReports' | 'totalPoints' | 'impactScore';
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  unlockedAt: string;
  isNew?: boolean;
}

export interface CommunityImpact {
  date: string;
  category: string;
  totalTrips: number;
  totalResolvedIssues: number;
  totalAccessibilityResolved: number;
  totalCO2Avoided: number;
  totalContributions: number;
  totalPoints: number;
}

export interface EmissionFactor {
  mode: TransportMode;
  name: string;
  nameHi: string;
  factorKgPerKm: number;
  icon: string;
}

export interface RewardConfig {
  baselineCarKgPerKm: number;
  tripBasePoints: number;
  activeMobilityPerKmBonus: number;
  maxTripDistanceKm: number;
  reportSubmissionPoints: number;
  resolvedCivicPoints: number;
  resolvedAccessibilityPoints: number;
  impactScoreMultipliers: {
    resolvedCivic: number;
    resolvedAccessibility: number;
    sustainableTrip: number;
    co2Kg: number;
  };
}
