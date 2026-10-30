import { 
  UserImpact, 
  SustainableTrip, 
  CivicContribution, 
  SaathiTransaction, 
  UserBadge, 
  CommunityImpact,
  TransportMode,
  ReportStatus,
  UserProfile
} from '../types';
import { REWARD_CONFIG, EMISSION_FACTORS, BADGE_DEFINITIONS } from '../data/rewardRules';
import { 
  INITIAL_USER_IMPACT, 
  INITIAL_SUSTAINABLE_TRIPS, 
  INITIAL_CIVIC_REPORTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_USER_BADGES, 
  INITIAL_COMMUNITY_IMPACT,
  DEMO_PROFILES
} from '../data/initialData';
import confetti from 'canvas-confetti';

const STORAGE_KEYS = {
  IMPACT: 'citysaathi_user_impact',
  TRIPS: 'citysaathi_trips',
  REPORTS: 'citysaathi_reports',
  TRANSACTIONS: 'citysaathi_transactions',
  BADGES: 'citysaathi_user_badges',
  COMMUNITY: 'citysaathi_community_impact',
  USER_PROFILE: 'citysaathi_active_user',
};

class ImpactService {
  public getActiveUser(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEMO_PROFILES.citizen));
      return DEMO_PROFILES.citizen;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_PROFILES.citizen;
    }
  }

  public setActiveUser(role: 'citizen' | 'officer'): UserProfile {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.citizen;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return profile;
  }

  private getUserImpactFromStorage(): UserImpact {
    const raw = localStorage.getItem(STORAGE_KEYS.IMPACT);
    if (!raw) return { ...INITIAL_USER_IMPACT };
    try {
      return JSON.parse(raw);
    } catch {
      return { ...INITIAL_USER_IMPACT };
    }
  }

  private saveUserImpact(impact: UserImpact): void {
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(impact));
  }

  public getTrips(): SustainableTrip[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_SUSTAINABLE_TRIPS));
      return [...INITIAL_SUSTAINABLE_TRIPS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_SUSTAINABLE_TRIPS];
    }
  }

  public getReports(): CivicContribution[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_CIVIC_REPORTS));
      return [...INITIAL_CIVIC_REPORTS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_CIVIC_REPORTS];
    }
  }

  public getTransactions(): SaathiTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return [...INITIAL_TRANSACTIONS];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_TRANSACTIONS];
    }
  }

  public getUserBadges(): UserBadge[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_USER_BADGES));
      return [...INITIAL_USER_BADGES];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [...INITIAL_USER_BADGES];
    }
  }

  public getCommunityImpact(): CommunityImpact {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(INITIAL_COMMUNITY_IMPACT));
      return { ...INITIAL_COMMUNITY_IMPACT };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { ...INITIAL_COMMUNITY_IMPACT };
    }
  }

  public getUserImpact(): UserImpact {
    return this.getUserImpactFromStorage();
  }

  public calculateImpactScore(
    resolvedReports: number,
    resolvedAccessibility: number,
    sustainableTrips: number,
    co2Avoided: number
  ): number {
    const m = REWARD_CONFIG.impactScoreMultipliers;
    const score = 
      (resolvedReports * m.resolvedCivic) +
      (resolvedAccessibility * m.resolvedAccessibility) +
      (sustainableTrips * m.sustainableTrip) +
      (Math.round(co2Avoided) * m.co2Kg);
    return Math.max(0, Math.round(score));
  }

  public recordSustainableTrip(
    transportMode: TransportMode,
    distanceKm: number,
    fromLocation: string = 'Current Location',
    toLocation: string = 'Destination'
  ): { trip: SustainableTrip; newlyUnlockedBadges: string[] } {
    if (distanceKm <= 0) {
      throw new Error('Distance must be greater than 0 km.');
    }

    const baselineFactor = REWARD_CONFIG.baselineCarKgPerKm;
    const modeConfig = EMISSION_FACTORS[transportMode] || EMISSION_FACTORS.bus;
    const modeFactor = modeConfig.factorKgPerKm;

    const savingsPerKm = Math.max(0, baselineFactor - modeFactor);
    const estimatedCO2Avoided = Number((savingsPerKm * distanceKm).toFixed(2));

    let pointsAwarded = 0;
    if (transportMode !== 'personal_vehicle') {
      pointsAwarded = REWARD_CONFIG.tripBasePoints;
      if (transportMode === 'walking' || transportMode === 'cycling') {
        const bonus = Math.min(20, Math.round(distanceKm * REWARD_CONFIG.activeMobilityPerKmBonus));
        pointsAwarded += bonus;
      }
    }

    const tripId = `TRIP-${Date.now().toString().slice(-6)}`;
    const newTrip: SustainableTrip = {
      id: tripId,
      userId: this.getActiveUser().id,
      transportMode,
      distanceKm: Number(distanceKm.toFixed(1)),
      baselineMode: 'personal_vehicle',
      estimatedCO2Avoided,
      pointsAwarded,
      verificationStatus: 'Confirmed',
      fromLocation,
      toLocation,
      createdAt: new Date().toISOString(),
    };

    const trips = [newTrip, ...this.getTrips()];
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));

    if (pointsAwarded > 0) {
      const txn: SaathiTransaction = {
        id: `TXN-TRIP-${Date.now().toString().slice(-6)}`,
        userId: newTrip.userId,
        activityType: 'SUSTAINABLE_TRIP',
        referenceId: tripId,
        points: pointsAwarded,
        reason: `Completed ${distanceKm} km ${modeConfig.name} trip (${estimatedCO2Avoided} kg CO₂ saved)`,
        verificationStatus: 'VERIFIED',
        createdAt: new Date().toISOString(),
      };
      const txns = [txn, ...this.getTransactions()];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));
    }

    const current = this.getUserImpactFromStorage();
    const newSustainableTrips = current.sustainableTrips + (pointsAwarded > 0 ? 1 : 0);
    const newCO2Avoided = Number((current.totalCO2Avoided + estimatedCO2Avoided).toFixed(2));
    const newTotalPoints = current.totalPoints + pointsAwarded;
    const newImpactScore = this.calculateImpactScore(
      current.resolvedReports,
      current.resolvedAccessibilityReports,
      newSustainableTrips,
      newCO2Avoided
    );

    const updatedImpact: UserImpact = {
      ...current,
      sustainableTrips: newSustainableTrips,
      totalCO2Avoided: newCO2Avoided,
      totalPoints: newTotalPoints,
      impactScore: newImpactScore,
      updatedAt: new Date().toISOString(),
    };
    this.saveUserImpact(updatedImpact);

    const comm = this.getCommunityImpact();
    comm.totalTrips += 1;
    comm.totalCO2Avoided = Number((comm.totalCO2Avoided + estimatedCO2Avoided).toFixed(2));
    comm.totalPoints += pointsAwarded;
    comm.totalContributions += 1;
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(comm));

    const newlyUnlockedBadges = this.evaluateBadges(updatedImpact);
    return { trip: newTrip, newlyUnlockedBadges };
  }

  /**
   * Submit a new civic complaint with automated official acceptance receipt!
   */
  public submitReport(
    title: string,
    description: string,
    category: CivicContribution['category'],
    location: string,
    isAccessibilityIssue: boolean,
    imageUrl?: string,
    priority: CivicContribution['priority'] = 'High'
  ): CivicContribution {
    const existingCount = this.getReports().length;
    const trackingTicketId = `CS-2026-${(9300 + existingCount).toString()}`;
    
    // Determine designated department
    let assignedDepartment = 'Ward 14 Grievance Redressal Cell';
    if (isAccessibilityIssue || category === 'accessibility') {
      assignedDepartment = 'Ward 14 Barrier-Free Urban Mobility Cell (Special Taskforce)';
    } else if (category === 'streetlight') {
      assignedDepartment = 'Ward 14 Street Lighting & Electrical Division';
    } else if (category === 'road_footpath') {
      assignedDepartment = 'PWD Road Infrastructure & Sidewalk Repair Wing';
    } else if (category === 'water_drainage') {
      assignedDepartment = 'Delhi Jal Board & Stormwater Drainage Dept';
    }

    const newReport: CivicContribution = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      userId: this.getActiveUser().id,
      reportId: trackingTicketId,
      title,
      description,
      category,
      isAccessibilityIssue,
      location,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
      status: 'Accepted', // Complaint is immediately Accepted and Acknowledged!
      pointsAwarded: 0,   // In compliance: 0 points on submission/acceptance
      priority: isAccessibilityIssue ? 'Urgent Accessibility' : priority,
      assignedDepartment,
      submittedAt: new Date().toISOString(),
      acceptedAt: new Date(Date.now() + 1000 * 60).toISOString(),
      communityImpactSummary: `Complaint officially accepted by ${assignedDepartment}. Inspection order generated.`,
      officialRemarks: `Acknowledgement issued to citizen ${this.getActiveUser().name}. Target SLA: 48h.`,
    };

    const reports = [newReport, ...this.getReports()];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    const comm = this.getCommunityImpact();
    comm.totalContributions += 1;
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(comm));

    return newReport;
  }

  /**
   * Update report status across the 5 lifecycle stages:
   * Submitted -> Accepted -> Verified -> In Progress -> Resolved (awards points)
   */
  public updateReportStatus(
    reportId: string, 
    newStatus: ReportStatus,
    adminNotes?: string
  ): { report: CivicContribution; newlyUnlockedBadges: string[]; pointsEarned: number } {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.reportId === reportId || r.id === reportId);
    if (index === -1) {
      throw new Error(`Report ${reportId} not found.`);
    }

    const current = reports[index];
    const previousStatus = current.status;
    let pointsEarned = 0;
    let newlyUnlockedBadges: string[] = [];

    if (newStatus === 'Accepted' && !current.acceptedAt) {
      current.acceptedAt = new Date().toISOString();
      current.communityImpactSummary = adminNotes || `Complaint acknowledged and accepted by Ward 14 Engineering Unit.`;
    }

    if (newStatus === 'Verified') {
      current.verifiedBy = current.verifiedBy || 'Ward Field Inspector';
      current.communityImpactSummary = adminNotes || `On-site field inspection completed. Repair requisition approved.`;
    }

    if (newStatus === 'In Progress') {
      current.communityImpactSummary = adminNotes || `Maintenance crew and materials deployed on site.`;
    }

    if (newStatus === 'Resolved' && previousStatus !== 'Resolved') {
      if (current.pointsAwarded > 0) {
        console.warn('Report has already received resolution points. Duplicate prevented.');
      } else {
        pointsEarned = current.isAccessibilityIssue 
          ? REWARD_CONFIG.resolvedAccessibilityPoints 
          : REWARD_CONFIG.resolvedCivicPoints;

        current.pointsAwarded = pointsEarned;
        current.resolvedAt = new Date().toISOString();
        current.verifiedBy = current.verifiedBy || 'Ward 14 Executive Engineer Er. S. Verma';
        current.communityImpactSummary = adminNotes || (current.isAccessibilityIssue 
          ? 'Step-free access & barrier removal verified compliant with CPWD norms.' 
          : 'Civic repair completed, inspected, and verified on-site.');
        current.officialRemarks = `Resolution verified. ${pointsEarned} Saathi Points awarded to citizen.`;

        const txn: SaathiTransaction = {
          id: `TXN-RES-${Date.now().toString().slice(-6)}`,
          userId: current.userId,
          activityType: current.isAccessibilityIssue ? 'ACCESSIBILITY_RESOLUTION' : 'CIVIC_RESOLUTION',
          referenceId: current.reportId,
          points: pointsEarned,
          reason: `Resolved: ${current.title} (${current.isAccessibilityIssue ? 'Accessibility Barrier' : 'Civic Repair'})`,
          verificationStatus: 'RESOLVED',
          createdAt: new Date().toISOString(),
        };
        const txns = [txn, ...this.getTransactions()];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));

        const userImpact = this.getUserImpactFromStorage();
        const newResolvedReports = userImpact.resolvedReports + 1;
        const newResolvedAccess = userImpact.resolvedAccessibilityReports + (current.isAccessibilityIssue ? 1 : 0);
        const newTotalPoints = userImpact.totalPoints + pointsEarned;
        const newImpactScore = this.calculateImpactScore(
          newResolvedReports,
          newResolvedAccess,
          userImpact.sustainableTrips,
          userImpact.totalCO2Avoided
        );

        const updatedImpact: UserImpact = {
          ...userImpact,
          resolvedReports: newResolvedReports,
          resolvedAccessibilityReports: newResolvedAccess,
          totalPoints: newTotalPoints,
          impactScore: newImpactScore,
          updatedAt: new Date().toISOString(),
        };
        this.saveUserImpact(updatedImpact);

        const comm = this.getCommunityImpact();
        comm.totalResolvedIssues += 1;
        if (current.isAccessibilityIssue) {
          comm.totalAccessibilityResolved += 1;
        }
        comm.totalPoints += pointsEarned;
        localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(comm));

        newlyUnlockedBadges = this.evaluateBadges(updatedImpact);
      }
    } else if (newStatus === 'Rejected' && previousStatus === 'Resolved' && current.pointsAwarded > 0) {
      const reversalPoints = -current.pointsAwarded;
      const txn: SaathiTransaction = {
        id: `TXN-REV-${Date.now().toString().slice(-6)}`,
        userId: current.userId,
        activityType: 'REVERSAL',
        referenceId: current.reportId,
        points: reversalPoints,
        reason: `Reversal on rejected verification: ${current.reportId}`,
        verificationStatus: 'REVERSED',
        createdAt: new Date().toISOString(),
      };
      const txns = [txn, ...this.getTransactions()];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns));

      current.pointsAwarded = 0;
      current.resolvedAt = undefined;

      const userImpact = this.getUserImpactFromStorage();
      const updatedImpact: UserImpact = {
        ...userImpact,
        resolvedReports: Math.max(0, userImpact.resolvedReports - 1),
        resolvedAccessibilityReports: Math.max(0, userImpact.resolvedAccessibilityReports - (current.isAccessibilityIssue ? 1 : 0)),
        totalPoints: Math.max(0, userImpact.totalPoints + reversalPoints),
        updatedAt: new Date().toISOString(),
      };
      updatedImpact.impactScore = this.calculateImpactScore(
        updatedImpact.resolvedReports,
        updatedImpact.resolvedAccessibilityReports,
        updatedImpact.sustainableTrips,
        updatedImpact.totalCO2Avoided
      );
      this.saveUserImpact(updatedImpact);
    }

    current.status = newStatus;
    reports[index] = current;
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    return { report: current, newlyUnlockedBadges, pointsEarned };
  }

  public evaluateBadges(impact: UserImpact): string[] {
    const userBadges = this.getUserBadges();
    const unlockedIds = new Set(userBadges.map(b => b.badgeId));
    const newlyUnlocked: string[] = [];

    for (const badge of BADGE_DEFINITIONS) {
      if (unlockedIds.has(badge.id)) continue;

      let eligible = false;
      switch (badge.id) {
        case 'civic-reporter':
          eligible = impact.resolvedReports >= 1;
          break;
        case 'green-commuter':
          eligible = impact.sustainableTrips >= 5;
          break;
        case 'accessibility-champion':
          eligible = impact.resolvedAccessibilityReports >= 3;
          break;
        case 'community-hero':
          eligible = impact.totalPoints >= 100;
          break;
        case 'city-guardian':
          eligible = impact.impactScore >= 250 && impact.totalCO2Avoided >= 20;
          break;
      }

      if (eligible) {
        userBadges.push({
          userId: impact.userId,
          badgeId: badge.id,
          unlockedAt: new Date().toISOString(),
          isNew: true,
        });
        newlyUnlocked.push(badge.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(userBadges));
      this.triggerConfettiCelebration();
    }

    return newlyUnlocked;
  }

  public triggerConfettiCelebration(): void {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#34D399', '#F59E0B', '#3B82F6'],
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  }

  public resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.IMPACT, JSON.stringify(INITIAL_USER_IMPACT));
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_SUSTAINABLE_TRIPS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_CIVIC_REPORTS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(INITIAL_USER_BADGES));
    localStorage.setItem(STORAGE_KEYS.COMMUNITY, JSON.stringify(INITIAL_COMMUNITY_IMPACT));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEMO_PROFILES.citizen));
  }
}

export const impactService = new ImpactService();
