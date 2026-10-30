# CitySaathi — Inclusive Smart City Assistant
> **Voice-First • Bilingual • Accessibility-Focused • Trackable Impact & Reward System**  
> **Team WYVANTA**: Pooja Garg (Team Leader), Sakshi Mundhe, Riya Kumari, Ratnabh Gupta

---

## 1. Feature Objective: Impact & Reward System

CitySaathi turns ordinary citizen actions into measurable, transparent, and verifiable community impact. It implements the closed-loop civic journey:

$$\text{INFORMATION} \longrightarrow \text{ACTION} \longrightarrow \text{IMPACT} \longrightarrow \text{RECOGNITION}$$

Citizens earn **Saathi Points** for verified civic contributions and sustainable choices, track their transparent **Personal Impact Score**, unlock tiered **Saathi Badges**, and observe the collective transformation of their ward and city in **Our City's Impact**.

---

## 2. Mathematical & Reward Rules

### A. Estimated $\text{CO}_2$ Emissions Avoided
$$\text{CO}_2\text{ Avoided (kg)} = \max\Big(0, \big(\text{Baseline Private Vehicle Factor} - \text{Selected Transit Factor}\big) \times \text{Distance (km)}\Big)$$

* **Baseline Private Car/Petrol Bike Factor**: $0.192\text{ kg CO}_2\text{/km}$
* **Walking**: $0.000\text{ kg CO}_2\text{/km}$ ($100\%$ emissions saved)
* **Cycling**: $0.000\text{ kg CO}_2\text{/km}$ ($100\%$ emissions saved)
* **Electric/CNG City Bus**: $0.040\text{ kg CO}_2\text{/km}$ ($\sim 79\%$ emissions saved)
* **Metro / Suburban Rail**: $0.030\text{ kg CO}_2\text{/km}$ ($\sim 84\%$ emissions saved)
* **Personal Vehicle**: $0.192\text{ kg CO}_2\text{/km}$ ($0\text{ kg}$ saved, $0$ points awarded)

### B. Saathi Points Earning Rules
1. **Completed Sustainable Trip**:
   * Base Reward: **10 Saathi Points**
   * Active Mobility Bonus: **+2 Points/km** for walking or cycling (capped at 20 bonus points)
2. **Civic Issue Reporting**:
   * Initial Report Submission: **0 Points** (prevents automated spam and false reporting)
   * Verified & Resolved Standard Civic Grievance (pothole, broken streetlight, garbage): **25 Points**
   * Verified & Resolved Accessibility Barrier (blocked wheelchair ramp, broken tactile paving, inaccessible toilet): **40 Points**
3. **Idempotency & Anti-Duplication**:
   * Resolution rewards are awarded exactly once per unique `Ticket ID`. Subsequent calls or status toggles are rejected at the ledger level.
   * Every transaction is cryptographically logged in an auditable ledger with reference IDs and timestamps.

### C. Personal Impact Score Formulation
$$\text{Impact Score} = (\text{Resolved Civic Issues} \times 20) + (\text{Resolved Accessibility Issues} \times 35) + (\text{Sustainable Trips} \times 15) + (\text{round}(\text{CO}_2\text{ Avoided in kg}) \times 2)$$

* Distinct from Saathi Points (spendable recognition tokens) and $\text{CO}_2$ metrics.
* Measures lasting physical improvements and clean transit habits.

---

## 3. Saathi Badges & Achievements

1. **Civic Reporter** (नागरिक रिपोर्टर): Earned after the first verified civic report is resolved (`resolvedReports >= 1`).
2. **Green Commuter** (हरित यात्री): Earned after completing 5 qualifying sustainable transit trips (`sustainableTrips >= 5`).
3. **Accessibility Champion** (सुगमता चैंपियन): Earned after contributing to 3 verified, resolved accessibility issues (`resolvedAccessibilityReports >= 3`).
4. **Community Hero** (समुदाय नायक): Earned after reaching 100 cumulative Saathi Points (`totalPoints >= 100`).
5. **City Guardian** (नगर संरक्षक): Master milestone earned upon reaching an Impact Score of 250 with at least 20 kg $\text{CO}_2$ avoided.

---

## 4. Tech Stack & Directory Structure

* **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Canvas Confetti
* **Backend**: Python 3.13 + FastAPI + Pydantic v2 + SQLite/In-Memory Auditable Ledger + Uvicorn
* **Internationalization**: Fully Bilingual (English & Hindi) across all views and AI responses
* **Design Palette**: Deep Green (`#093729`), Emerald Green (`#10B981`), Light Mint (`#ECFDF5`), and Pure White

```
citysaathi/
├── backend/
│   └── main.py                     # FastAPI REST API with models, rules, and endpoints
├── src/
│   ├── types/
│   │   └── index.ts                # TypeScript data interfaces
│   ├── data/
│   │   ├── initialData.ts          # Seed data for citizen Pooja Garg (Ward 14)
│   │   ├── rewardRules.ts          # Emission factors, points, and badge definitions
│   │   └── translations.ts         # English & Hindi bilingual dictionary
│   ├── services/
│   │   └── impactService.ts        # Business logic, calculations, audit logging, confetti
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx          # Brand header, language toggle, points pill, quick actions
│   │   │   ├── StatCard.tsx        # Accessible reusable statistics card
│   │   │   ├── BadgeModal.tsx      # Celebratory unlock modal with confetti
│   │   │   ├── ImpactCalculationModal.tsx # "How is my impact calculated?" guide
│   │   │   └── DemoAdminDrawer.tsx # Authorized municipal resolution simulator
│   │   ├── impact/
│   │   │   ├── MyImpactDashboard.tsx # Overview summary, charts, and activity timeline
│   │   │   ├── SustainableTravel.tsx # Modal selector, CO2 avoided calculator, trip confirmation
│   │   │   ├── CivicReportingRewards.tsx # Complaint lifecycle, resolution points, admin tool
│   │   │   ├── BadgesGrid.tsx      # Unlocked/locked badges with live progress bars
│   │   │   ├── OurCityImpact.tsx   # Aggregated community metrics with 7d/30d/all filters
│   │   │   ├── RewardRulesView.tsx # Transparent policy documentation
│   │   │   └── PointsHistoryTable.tsx # Auditable transaction ledger
│   │   └── modules/
│   │       ├── AskAIAssistant.tsx  # 01 AskAI: Voice/text bilingual assistant with impact advice
│   │       ├── NavigateAccessible.tsx # 02 Navigate: Accessible map with ramps and one-click trip logging
│   │       └── ReportAndTrack.tsx  # 03 Report & Track: Photo + GPS geotagged issue filing
│   ├── App.tsx                     # Main layout & sub-navigation controller
│   ├── index.css                   # Tailwind v4 styling and focus ring accessibilities
│   └── main.tsx                    # React DOM entry point
├── test_backend.py                 # Automated backend test suite
└── package.json                    # Dependencies and scripts
```

---

## 5. How to Run the Application

### A. Frontend (React + Vite)
```powershell
cd C:\Users\hp\.gemini\antigravity\scratch\citysaathi
npm run dev
```
Open your browser at `http://localhost:5173`.

To verify production bundle build:
```powershell
npm run build
```

### B. Backend (Python FastAPI)
```powershell
cd C:\Users\hp\.gemini\antigravity\scratch\citysaathi
python -m uvicorn backend.main:app --reload --port 8000
```
Open interactive Swagger API docs at `http://127.0.0.1:8000/docs`.

To run automated backend validation tests:
```powershell
python test_backend.py
```

---

## 6. Hackathon Judges Demonstration Script

Demonstrate this complete 8-step journey:

1. **Step 1 — Citizen Discovery**: Open the app. The citizen is logged in as **Pooja Garg** (Team WYVANTA, Ward 14) with **65 Saathi Points** and **124 Impact Score**. Toggle language to **हिंदी** and back to **English** to demonstrate bilingual support.
2. **Step 2 — AskAI Consultation**: Click **AskAI Assistant**. Type or click the chip *"What is my environmental impact?"*. The AI immediately inspects Pooja's verified stats ($19.6\text{ kg CO}_2$ saved) and offers a direct *"Record Trip"* shortcut.
3. **Step 3 — Accessible Route Navigation**: Switch to **Navigate Accessible**. Inspect the high-contrast accessible map showing ramps, elevators, and step-free transit corridors. Select *Central Metro Station (Gate 2)* and click **Record Completed Trip**. Notice the instant success notification.
4. **Step 4 — Custom Sustainable Transit Logging**: Go to **My Impact → Sustainable Travel Impact**. Select **Bicycle / E-bike**, set distance to **6.0 km**, and review the live calculation ($1.15\text{ kg CO}_2$ avoided, $+22\text{ Points}$). Click **Confirm & Record Completed Trip**. Notice the live points increment.
5. **Step 5 — Civic Grievance Filing**: Open **Report & Track**. Submit an accessibility report:
   * *Title*: `Broken Tactile Tiles near Bus Stop 14`
   * *Category*: `Accessibility Barrier`
   * Click **Submit Civic Report**. A unique ticket ID (e.g. `CS-2026-107`) is generated with status `Submitted` and **0 initial points** (preventing false reporting spam).
6. **Step 6 — Authorized Municipal Resolution**: Click **Admin Demo** in the top navigation. Select ticket `CS-2026-107`, select status **Resolved**, and click **Apply Status & Trigger Reward**.
7. **Step 7 — Real-Time Celebration & Badge Unlock**: Instantly, celebratory confetti triggers, **+40 Saathi Points** are awarded, the Personal Impact Score increases, and the **Saathi Badge Modal** pops up celebrating the newly unlocked badge!
8. **Step 8 — Community & Ledger Audit**: Open **Our City's Impact** to see Ward 14's collective $500\text{ kg}$ target meter advance. Then click **Points History** to inspect the tamper-resistant, immutable transaction audit trail.
9. **Reset Demo**: Click the **Reset Demo** icon anytime to seamlessly restart the presentation for the next judge!

---

## 7. Real Municipal Integration vs. Demo Mode

* **Implemented & Live**:
  * Complete calculation engine for $\text{CO}_2$ avoidance and active mobility bonuses.
  * Personal Impact Score formula and live metric updates.
  * Anti-duplicate resolution safeguards and transaction audit trail.
  * Bilingual UI (English/Hindi), accessible contrast styling, and responsive layout.
  * Fast backend REST API and SQLite/JSON state management.
* **Simulated in Demo Mode**:
  * Municipal administrative resolution via the built-in **Admin Demo Simulator** (in production, connected to urban grievance systems like CPGRAMS or municipal ERPs).
  * GPS map tiles use responsive vector canvas with verified accessibility pins (can connect directly to Google Maps Platform API key in `.env`).
