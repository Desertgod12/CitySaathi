"""
CitySaathi — Inclusive Smart City Platform
Backend REST API & Impact & Reward System
Tech Stack: Python 3.13 + FastAPI + Pydantic + SQLite
Smart City Mission • Urban Mobility & Civic Redressal
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid

app = FastAPI(
    title="CitySaathi API",
    description="Official Backend Service for Inclusive Smart City Assistant with Impact & Reward System",
    version="2.4.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- CONFIGURABLE RULES & MULTIPLIERS -----------------
CONFIG = {
    "baseline_car_co2_kg_km": 0.192,
    "trip_base_points": 10,
    "active_mobility_bonus_per_km": 2,
    "max_active_bonus": 20,
    "report_submission_points": 0,
    "resolved_civic_points": 25,
    "resolved_accessibility_points": 40,
    "multipliers": {
        "resolved_civic": 20,
        "resolved_accessibility": 35,
        "sustainable_trip": 15,
        "co2_kg": 2,
    }
}

EMISSION_FACTORS = {
    "walking": 0.0,
    "cycling": 0.0,
    "bus": 0.040,
    "public_transport": 0.030,
    "personal_vehicle": 0.192,
}

# ----------------- IN-MEMORY / AUDIT DATA STORES -----------------
user_impact_db = {
    "user_citizen_01": {
        "userId": "user_citizen_01",
        "userName": "Ananya Sharma",
        "totalPoints": 65,
        "impactScore": 124,
        "totalCO2Avoided": 19.6,
        "sustainableTrips": 2,
        "resolvedReports": 1,
        "resolvedAccessibilityReports": 1,
        "communityContributions": 4,
        "updatedAt": datetime.utcnow().isoformat()
    }
}

trips_db = [
    {
        "id": "TRIP-2026-001",
        "userId": "user_citizen_01",
        "transportMode": "public_transport",
        "distanceKm": 12.5,
        "baselineMode": "personal_vehicle",
        "estimatedCO2Avoided": 2.03,
        "pointsAwarded": 10,
        "verificationStatus": "Confirmed",
        "fromLocation": "Dwarka Sector 21 Terminal",
        "toLocation": "Central Secretariat Transit Hub",
        "createdAt": "2026-10-28T09:15:00Z"
    },
    {
        "id": "TRIP-2026-002",
        "userId": "user_citizen_01",
        "transportMode": "cycling",
        "distanceKm": 4.2,
        "baselineMode": "personal_vehicle",
        "estimatedCO2Avoided": 0.81,
        "pointsAwarded": 15,
        "verificationStatus": "Confirmed",
        "fromLocation": "Community Center, Sector 14",
        "toLocation": "Zonal Civil Dispensary",
        "createdAt": "2026-10-27T17:40:00Z"
    }
]

reports_db = [
    {
        "id": "REP-2026-101",
        "userId": "user_citizen_01",
        "reportId": "CS-2026-8841",
        "title": "Blocked Wheelchair Ramp at Central Metro Station (Gate 2)",
        "description": "Obstruction and debris on the step-free access ramp preventing wheelchair, stroller, and elderly access.",
        "category": "accessibility",
        "isAccessibilityIssue": True,
        "location": "Gate 2, Central Metro Station, Ward 14",
        "status": "Resolved",
        "pointsAwarded": 40,
        "submittedAt": "2026-10-24T11:20:00Z",
        "resolvedAt": "2026-10-26T16:45:00Z",
        "communityImpactSummary": "Obstruction cleared; tactile guiding path restored with yellow non-slip pavers. Over 350 commuters benefit daily.",
        "verifiedBy": "Er. S. Verma (Executive Engineer)"
    },
    {
        "id": "REP-2026-102",
        "userId": "user_citizen_01",
        "reportId": "CS-2026-9042",
        "title": "Non-Functional Streetlight Luminaire on Pedestrian Sidewalk",
        "description": "Pole #14-B has been dark for four consecutive evenings, creating an unsafe pedestrian stretch along 5th Cross Road.",
        "category": "streetlight",
        "isAccessibilityIssue": False,
        "location": "5th Cross Road, near Ward 14 Dispensary",
        "status": "Accepted",
        "pointsAwarded": 0,
        "submittedAt": "2026-10-28T19:10:00Z",
        "communityImpactSummary": "Complaint acknowledged and accepted. Electrical maintenance work order #EL-14-889 issued."
    }
]

transactions_db = [
    {
        "id": "TXN-9011-8841",
        "userId": "user_citizen_01",
        "activityType": "ACCESSIBILITY_RESOLUTION",
        "referenceId": "CS-2026-8841",
        "points": 40,
        "reason": "Verified resolution of wheelchair ramp obstruction at Central Metro",
        "verificationStatus": "RESOLVED",
        "createdAt": "2026-10-26T16:45:00Z"
    },
    {
        "id": "TXN-9011-0002",
        "userId": "user_citizen_01",
        "activityType": "SUSTAINABLE_TRIP",
        "referenceId": "TRIP-2026-002",
        "points": 15,
        "reason": "Completed 4.2 km active cycling commute with zero emissions",
        "verificationStatus": "VERIFIED",
        "createdAt": "2026-10-27T17:40:00Z"
    },
    {
        "id": "TXN-9011-0001",
        "userId": "user_citizen_01",
        "activityType": "SUSTAINABLE_TRIP",
        "referenceId": "TRIP-2026-001",
        "points": 10,
        "reason": "Completed 12.5 km public rapid metro transit trip (2.03 kg CO2 prevented)",
        "verificationStatus": "VERIFIED",
        "createdAt": "2026-10-28T09:15:00Z"
    }
]

community_impact_db = {
    "date": datetime.utcnow().strftime("%Y-%m-%d"),
    "category": "all",
    "totalTrips": 1480,
    "totalResolvedIssues": 312,
    "totalAccessibilityResolved": 142,
    "totalCO2Avoided": 489.4,
    "totalContributions": 2190,
    "totalPoints": 34850
}

# ----------------- PYDANTIC SCHEMAS -----------------
class TripCreateRequest(BaseModel):
    transportMode: Literal['walking', 'cycling', 'bus', 'public_transport', 'personal_vehicle']
    distanceKm: float = Field(..., gt=0, le=200)
    fromLocation: Optional[str] = "Starting Location"
    toLocation: Optional[str] = "Destination"

class ReportCreateRequest(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=5)
    category: Literal['accessibility', 'road_footpath', 'streetlight', 'sanitation_waste', 'water_drainage']
    isAccessibilityIssue: bool = False
    location: str
    imageUrl: Optional[str] = None

class ReportStatusUpdateRequest(BaseModel):
    status: Literal['Submitted', 'Accepted', 'Under Review', 'Verified', 'In Progress', 'Resolved', 'Rejected']
    adminNotes: Optional[str] = None

def recalc_impact_score(user):
    m = CONFIG["multipliers"]
    score = (
        (user["resolvedReports"] * m["resolved_civic"]) +
        (user["resolvedAccessibilityReports"] * m["resolved_accessibility"]) +
        (user["sustainableTrips"] * m["sustainable_trip"]) +
        (round(user["totalCO2Avoided"]) * m["co2_kg"])
    )
    return max(0, round(score))

# ----------------- API ENDPOINTS -----------------
@app.get("/")
def root():
    return {
        "platform": "CitySaathi API",
        "organization": "Smart City Mission • Urban Development",
        "status": "Online",
        "version": "2.4.0",
        "endpoints": ["/api/impact/personal", "/api/impact/trips", "/api/impact/reports", "/api/impact/community"]
    }

@app.get("/api/impact/personal")
def get_personal_impact(user_id: str = "user_citizen_01"):
    if user_id not in user_impact_db:
        # Create default if new
        user_impact_db[user_id] = {
            "userId": user_id,
            "userName": "Citizen Contributor",
            "totalPoints": 0,
            "impactScore": 0,
            "totalCO2Avoided": 0.0,
            "sustainableTrips": 0,
            "resolvedReports": 0,
            "resolvedAccessibilityReports": 0,
            "communityContributions": 0,
            "updatedAt": datetime.utcnow().isoformat()
        }
    return user_impact_db[user_id]

@app.get("/api/impact/rules")
def get_reward_rules():
    return {
        "config": CONFIG,
        "emission_factors": EMISSION_FACTORS,
        "formula_explanation": {
            "co2_avoided": "CO2 Avoided = (0.192 - selected_mode_factor) * distanceKm",
            "impact_score": "Score = (Resolved Civic * 20) + (Resolved Access * 35) + (Trips * 15) + (CO2 kg * 2)",
            "points": "Trip: 10 base (+ 2/km walking/cycle). Civic Resolved: 25 pts. Accessibility Resolved: 40 pts."
        }
    }

@app.get("/api/impact/trips")
def get_trips(user_id: str = "user_citizen_01"):
    return [t for t in trips_db if t["userId"] == user_id]

@app.post("/api/impact/trips")
def record_trip(trip_data: TripCreateRequest, user_id: str = "user_citizen_01"):
    user = user_impact_db.setdefault(user_id, {
        "userId": user_id,
        "userName": "Citizen Contributor",
        "totalPoints": 0,
        "impactScore": 0,
        "totalCO2Avoided": 0.0,
        "sustainableTrips": 0,
        "resolvedReports": 0,
        "resolvedAccessibilityReports": 0,
        "communityContributions": 0,
        "updatedAt": datetime.utcnow().isoformat()
    })

    baseline = CONFIG["baseline_car_co2_kg_km"]
    factor = EMISSION_FACTORS.get(trip_data.transportMode, 0.040)
    savings_per_km = max(0.0, baseline - factor)
    co2_avoided = round(savings_per_km * trip_data.distanceKm, 2)

    points = 0
    if trip_data.transportMode != "personal_vehicle":
        points = CONFIG["trip_base_points"]
        if trip_data.transportMode in ["walking", "cycling"]:
            bonus = min(CONFIG["max_active_bonus"], round(trip_data.distanceKm * CONFIG["active_mobility_bonus_per_km"]))
            points += bonus

    trip_id = f"TRIP-{str(uuid.uuid4())[:8].upper()}"
    new_trip = {
        "id": trip_id,
        "userId": user_id,
        "transportMode": trip_data.transportMode,
        "distanceKm": trip_data.distanceKm,
        "baselineMode": "personal_vehicle",
        "estimatedCO2Avoided": co2_avoided,
        "pointsAwarded": points,
        "verificationStatus": "Confirmed",
        "fromLocation": trip_data.fromLocation,
        "toLocation": trip_data.toLocation,
        "createdAt": datetime.utcnow().isoformat()
    }
    trips_db.insert(0, new_trip)

    if points > 0:
        txn = {
            "id": f"TXN-TRIP-{str(uuid.uuid4())[:8].upper()}",
            "userId": user_id,
            "activityType": "SUSTAINABLE_TRIP",
            "referenceId": trip_id,
            "points": points,
            "reason": f"Completed {trip_data.distanceKm} km {trip_data.transportMode} commute ({co2_avoided} kg CO2 prevented)",
            "verificationStatus": "VERIFIED",
            "createdAt": datetime.utcnow().isoformat()
        }
        transactions_db.insert(0, txn)

    user["sustainableTrips"] += 1 if points > 0 else 0
    user["totalCO2Avoided"] = round(user["totalCO2Avoided"] + co2_avoided, 2)
    user["totalPoints"] += points
    user["impactScore"] = recalc_impact_score(user)
    user["updatedAt"] = datetime.utcnow().isoformat()

    community_impact_db["totalTrips"] += 1
    community_impact_db["totalCO2Avoided"] = round(community_impact_db["totalCO2Avoided"] + co2_avoided, 2)
    community_impact_db["totalPoints"] += points
    community_impact_db["totalContributions"] += 1

    return {"status": "success", "trip": new_trip, "userImpact": user}

@app.get("/api/impact/reports")
def get_reports(user_id: str = "user_citizen_01"):
    return [r for r in reports_db if r["userId"] == user_id]

@app.post("/api/impact/reports")
def submit_report(data: ReportCreateRequest, user_id: str = "user_citizen_01"):
    report_id = f"CS-2026-{len(reports_db) + 9305}"
    new_report = {
        "id": f"REP-{str(uuid.uuid4())[:8].upper()}",
        "userId": user_id,
        "reportId": report_id,
        "title": data.title,
        "description": data.description,
        "category": data.category,
        "isAccessibilityIssue": data.isAccessibilityIssue,
        "location": data.location,
        "status": "Accepted",  # Complaint accepted into municipal queue!
        "pointsAwarded": 0,
        "submittedAt": datetime.utcnow().isoformat(),
        "acceptedAt": datetime.utcnow().isoformat(),
        "communityImpactSummary": "Grievance accepted and assigned to Ward Engineering Cell."
    }
    reports_db.insert(0, new_report)
    community_impact_db["totalContributions"] += 1
    return new_report

@app.post("/api/impact/reports/{report_id}/status")
def update_report_status(report_id: str, payload: ReportStatusUpdateRequest):
    report = next((r for r in reports_db if r["reportId"] == report_id or r["id"] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")

    old_status = report["status"]
    new_status = payload.status
    points_awarded = 0

    if new_status == "Resolved" and old_status != "Resolved":
        if report["pointsAwarded"] > 0:
            pass
        else:
            points_awarded = CONFIG["resolved_accessibility_points"] if report["isAccessibilityIssue"] else CONFIG["resolved_civic_points"]
            report["pointsAwarded"] = points_awarded
            report["resolvedAt"] = datetime.utcnow().isoformat()
            report["verifiedBy"] = "Er. S. Verma (Ward Executive Engineer)"
            report["communityImpactSummary"] = payload.adminNotes or "Verified and resolved by municipal engineering division."

            txn = {
                "id": f"TXN-RES-{str(uuid.uuid4())[:8].upper()}",
                "userId": report["userId"],
                "activityType": "ACCESSIBILITY_RESOLUTION" if report["isAccessibilityIssue"] else "CIVIC_RESOLUTION",
                "referenceId": report["reportId"],
                "points": points_awarded,
                "reason": f"Resolved: {report['title']}",
                "verificationStatus": "RESOLVED",
                "createdAt": datetime.utcnow().isoformat()
            }
            transactions_db.insert(0, txn)

            user = user_impact_db.get(report["userId"])
            if user:
                user["resolvedReports"] += 1
                if report["isAccessibilityIssue"]:
                    user["resolvedAccessibilityReports"] += 1
                user["totalPoints"] += points_awarded
                user["impactScore"] = recalc_impact_score(user)
                user["updatedAt"] = datetime.utcnow().isoformat()

            community_impact_db["totalResolvedIssues"] += 1
            if report["isAccessibilityIssue"]:
                community_impact_db["totalAccessibilityResolved"] += 1
            community_impact_db["totalPoints"] += points_awarded

    report["status"] = new_status
    return {"status": "success", "report": report, "pointsAwarded": points_awarded}

@app.get("/api/impact/transactions")
def get_transactions(user_id: str = "user_citizen_01"):
    return [t for t in transactions_db if t["userId"] == user_id]

@app.get("/api/impact/community")
def get_community_impact(filter_range: str = Query("30d", enum=["7d", "30d", "all"])):
    return {
        "filter": filter_range,
        "metrics": community_impact_db,
        "ward": "Ward 14 Zonal Division",
        "city": "Smart City Mission"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
