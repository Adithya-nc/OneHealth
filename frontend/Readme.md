# 🏥 oneHealth — Comprehensive Project Guide & Lifetime Health Passport

> **Built for the Hachverse Hackathon 2026**  
> A futuristic, dual-portal digital healthcare platform serving as a **Lifetime Health Passport** for patients and a **Clinical Management Dashboard** for doctors.

---

## 🚀 1. Vision & Core Concept

**oneHealth** is a unified digital health passport and emergency healthcare assistant. It consolidates a patient's medical records — diagnoses, prescriptions, reports, vaccinations, medications — into a single secure digital identity while delivering intelligent AI guidance, emergency support, and personalized health insights. The platform bridges the fragmented healthcare data ecosystem, acting as a smarter evolution of the Ayushman Card concept.

### The System Architecture Features:
* **Patient Portal**: Comprehensive health management, record timeline, daily pill tracking, AI symptom triage, and medical passport sharing.
* **Doctor Portal**: Real-time practice analytics, consultation manager, patient queue tracking, AI alerts hub, and aggregate patient feedback analysis.

---

## 🎨 2. Design & Interaction System

The application utilizes a state-of-the-art **futuristic design system** built to impress:
- **Light/Dark Themes**: Fully responsive, system-aware dynamic theme toggle using CSS variables and Zustand state persistence.
- **3D Motion & Parallax**: Stat cards and Quick Action cards tilt dynamically on hover (`rotateX`, `rotateY`, `scale`, `translateZ`) using **Framer Motion** for a premium glassmorphic feel.
- **Glowing Visualizations**: SVG charts and progress rings render custom gradient shadows and Gaussian blur filters (`feGaussianBlur`) to elevate standard dashboard UI.
- **Micro-interactions**: Subtle staggered slide-ins, scale-in indicators, and hover-triggered glows that make the interface feel alive.

---

## 🏠 3. Patient Dashboard — Detailed Features

The Patient Dashboard acts as the personal command center for health tracking. It is loaded with interactive widgets and real-time trackers:

### 1. Interactive 3D Health Score Ring
* **Visuals**: A large circular progress SVG indicator with a dynamic gradient stroke that wraps around the score.
* **Animations**: The score numbers roll up using an animated `CountUp` mechanism on load, and the progress ring sweeps smoothly from 0 to the patient's calculated score.
* **Logic**: Calculates and changes labels (e.g., *Poor*, *Fair*, *Good*, *Excellent*) and colors (Red, Yellow, Green, Indigo) dynamically based on the current score, which is calculated from uploaded records and overall compliance.

### 2. Live 3D Stat Cards Row
* **Cards**: Displays counts for **Reports Uploaded**, **Prescriptions**, **Consultations**, and **Vaccinations**.
* **Interactions**: Each card reacts to cursor movement with a 3D tilt and scale effect. Clicking a card routes the user to the corresponding sub-section of the passport or medication list.
* **Animated Numbers**: Utilizes smooth counter-animations to load value counts dynamically.

### 3. Quick Actions Grid (3D Hover-Tilt)
* A high-visibility navigation grid designed for fast access:
  * **Check Symptoms**: Navigates to the AI-powered symptom analyzer.
  * **Upload Report**: Opens a modal or page containing a drag-and-drop file uploader.
  * **Emergency Card**: Quickly displays critical life-saving metrics like blood type, allergies, and emergency contacts.
  * **Medications**: Opens the calendar medication schedule.

### 4. Health Trends AreaChart
* **Function**: Plots physiological indicators over time.
* **Modes**: An inline navigation tab toggles between **Weight (kg)**, **Blood Sugar (mg/dL)**, and **Cholesterol (mg/dL)**.
* **Visuals**: Features Recharts Area lines with semi-transparent linear gradients under the curves and custom glowing active-dots.
* **Custom Tooltips**: Interactive popup showing exact dates and units, with styling that adapts to light/dark themes.

### 5. AI Insights Panel
* **Context**: Displays health warnings and recommendations analyzed from the patient's latest clinical records.
* **Severity Tags**: Employs colored labels like warning alerts (e.g., *Haemoglobin slightly low* in amber) and success alerts (e.g., *Blood pressure trending down* in emerald).

### 6. Today's Medications Check
* A compact daily checklist showing taken and pending medications with scheduled times.
* Supports color-coded badges to indicate status (*Taken* in green, *Pending* in amber) to boost compliance.

### 7. Interactive 10-Star Feedback System
* **Mechanics**: Allows patients to rate their recent doctor consultation out of 10 stars.
* **Effects**: Interactive hover scaling on stars, full gold drop-shadow glow effects, and slide-down textarea for written feedback once a rating is clicked.
* **Completion**: Submitting shows a spring-animated checkmark confirmation.

### 8. Recent Activity Feed
* Chronological listing of recent health changes (e.g., new PDF reports added, prescriptions updated) complete with record type badges.

### 9. Onboarding Tooltip Overlay
* Dynamic guide overlay showing tooltips pointing to key locations: Timeline entries, report uploads, and emergency access features. Renders for new users during their first dashboard session.

---

## 🩺 4. Doctor Dashboard — Detailed Features

The Doctor Dashboard serves as the central control board for clinical operations, designed to present large volumes of telemetry clearly:

### 1. Executive 3D Stat Board
* Renders critical indicators to keep track of clinic operations:
  * **Total Patients Managed**: Count of patients assigned to the practitioner.
  * **Today's Consults**: Live count of scheduled appointments for the day.
  * **Pending Follow-ups**: Patient records requiring review.
  * **Health Score Avg**: Average health rating of the doctor's patient pool.
* Each board utilizes 3D tilt motion and colored shadow glows to look sleek and modern.

### 2. AI Health Alerts Hub
* Monitors connected patient feeds and highlights clinical anomalies immediately:
  * **Critical Alerts**: Marked in red with clinical context (e.g., *David Warner: Abnormal ECG detected*).
  * **Warning Alerts**: Marked in amber (e.g., *Susan Clarke: Missed 3 consecutive medication doses*).
  * **Info Alerts**: Highlight normal trends (e.g., *James Smith: BP back to normal range*).

### 3. Health Reports Trend Chart
* A custom area chart displaying the volume of patient health records analyzed by the AI systems on a weekly basis, showing the scale of data processed.

### 4. Patient Feedback Analysis Widget
* **Score Card**: Shows the doctor's average rating on a **10-star scale** (e.g., `9.8 / 10`) next to a glowing gold star icon.
* **Review Stream**: Displays recent reviews from patients including star counts out of ten and their italicized comments (e.g., *"Very patient and explained everything clearly"*).

### 5. Dynamic Appointment Queue Table
* **Structure**: Tracks the patient queue for the day in a structured table displaying Patient Name, Appointment Time, Consult Type, Status, and Action.
* **Status Badges**: Color-coded chips representing queue state:
  * `Waiting` (Amber)
  * `Confirmed` (Emerald)
  * `Delayed` (Red)
* **Start Consultation**: A hover-triggered *Start Consult* action button that fades in smoothly.

---

## 💾 5. Database Schema & Data Architecture

The Firestore structure organizes relational metadata under NoSQL collections with strict document validation rules:

### Collection: `users`
```javascript
// Document ID: Firebase auth UID
{
  uid: "string",
  email: "string",
  name: "string",
  phone: "string",
  role: "patient" | "doctor" | "admin",
  created_at: Timestamp,
  updated_at: Timestamp,
  profile: {
    dob: "YYYY-MM-DD",
    gender: "male" | "female" | "other",
    blood_group: "A+" | "B+" | "O+" | "O-" | "AB+" | "AB-" | "A-" | "B-",
    height_cm: 175,
    weight_kg: 70,
    photo_url: "string",
    allergies: ["Penicillin", "Peanuts"],
    chronic_diseases: ["Diabetes Type 2", "Hypertension"],
    medical_notes: "string",
    emergency_contacts: [
      { name: "Jane Doe", relationship: "Spouse", phone: "+919876543210" }
    ]
  },
  doctor_profile: {
    registration_number: "string",
    specialisation: "string",
    hospital: "string",
    verified: true | false
  }
}
```

### Collection: `health_records`
```javascript
// Document ID: Auto-generated UUID
{
  id: "string",
  patient_uid: "string",
  uploaded_by: "string",
  type: "report" | "prescription" | "diagnosis" | "vaccination" | "symptom_check" | "followup",
  date: Timestamp,
  title: "string",
  file_url: "string (Firebase Storage URL)",
  metadata: {
    doctor_name: "string",
    hospital: "string",
    doctor_uid: "string",
    notes: "string"
  },
  ai_analysis: {
    extracted_values: [
      { parameter: "Haemoglobin", value: "11.2", unit: "g/dL", reference_range: "12-16", status: "low" }
    ],
    summary: "Mild anemia flagged; otherwise within acceptable guidelines.",
    suggested_actions: ["Dietary iron intake", "CBC review in 3 months"]
  }
}
```

### Collection: `medications`
```javascript
// Document ID: Auto-generated UUID
{
  id: "string",
  patient_uid: "string",
  prescribed_by: "string",
  name: "string",
  dosage: "string",
  frequency: "once" | "twice" | "thrice" | "weekly" | "as_needed",
  timing: ["08:00 AM", "08:00 PM"],
  start_date: Timestamp,
  end_date: Timestamp,
  instructions: "string",
  status: "active" | "completed" | "stopped",
  adherence_log: [
    { date: "2026-06-02", taken: true, taken_at: Timestamp }
  ]
}
```

### Collection: `doctor_consents`
```javascript
// Document ID: Auto-generated UUID
{
  id: "string",
  patient_uid: "string",
  doctor_uid: "string",
  access_level: "full" | "view_only",
  status: "active" | "revoked",
  granted_at: Timestamp,
  data_scope: {
    view_reports: true,
    add_diagnoses: true,
    add_prescriptions: true,
    view_medications: true
  }
}
```

---

## 🤖 6. AI & Prompt Engineering (Gemini API Integration)

The backend interacts with the Gemini API to analyze patient inputs and diagnostic parameters.

### Symptom Analysis Prompt
```text
SYSTEM:
You are a medical AI assistant for the oneHealth platform. Analyze symptoms and provide guidance.
Format response in this exact JSON schema:
{
  "severity": "low" | "medium" | "high",
  "severity_explanation": "string",
  "possible_conditions": [
    { "name": "string", "explanation": "string", "confidence": "low"|"medium"|"high" }
  ],
  "recommendations": ["string"],
  "otc_suggestions": [
    { "medicine": "string", "dosage_note": "string" }
  ],
  "warning_signs": ["string"],
  "seek_emergency": true | false,
  "disclaimer": "string"
}

USER:
Patient symptoms: Dry cough, shortness of breath.
Duration: 3 days.
Context: Age 45, Gender: Male, Allergies: none, Chronic conditions: Asthma, Medications: Salbutamol.
```

### Medical Report Extractor Prompt
```text
SYSTEM:
Extract clinical values from the medical report text. Respond only in this JSON format:
{
  "report_type": "string",
  "extracted_values": [
    { "parameter": "string", "value": "string", "unit": "string", "reference_range": "string", "status": "normal"|"high"|"low" }
  ],
  "overall_summary": "string",
  "abnormal_findings": ["string"],
  "suggested_actions": ["string"]
}

USER:
[Extracted raw OCR text from medical report PDF/Image]
Patient context: Age 32, Female.
```

---

## 🎨 7. UI/UX Style Token System

The visuals are managed through centralized Tailwind variables located in [globals.css](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/styles/globals.css):

```css
:root {
  --color-primary: #1A56DB;       /* Trust Blue */
  --color-success: #0E9F6E;       /* Safe Green */
  --color-warning: #D97706;       /* Alert Amber */
  --color-danger: #E02424;        /* Critical Red */
  
  /* Light Theme variables */
  --color-background: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-surface-2: #F3F4F6;
  --color-border: #E5E7EB;
  --color-text-primary: #111827;
  --color-text-secondary: #4B5563;
  --color-text-muted: #9CA3AF;
}

[data-theme="dark"] {
  /* Dark Theme overrides */
  --color-background: #0B0F19;
  --color-surface: #111827;
  --color-surface-2: #1F2937;
  --color-border: #374151;
  --color-text-primary: #F9FAFB;
  --color-text-secondary: #9CA3AF;
  --color-text-muted: #6B7280;
}
```

---

## 📁 8. Comprehensive Workspace File Map

The frontend codebase is organized logically into isolated modules for pages, layout frames, state stores, and shared UI primitives:

* **Bootstrap & Root Wrapper**:
  * [App.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/App.jsx) — Application router, layout wrappers, global routing controls.
  * [main.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/main.jsx) — Application rendering entry point.
* **Feature Pages & Modules**:
  * [Landing.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/Landing.jsx) — Public role selector & features marketing page.
  * [Auth.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/Auth.jsx) — Multi-portal secure authentication screens.
  * [OTP.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/OTP.jsx) — One-time code verification interface.
  * [Onboarding.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/Onboarding.jsx) — Entrance wrapper for multi-step onboarding profiling.
  * [Passport.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/Passport.jsx) — Lifetime medical history timeline with filter controls.
  * [Emergency.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/Emergency.jsx) — High-contrast medical alert file for first responder scanning.
* **Component Directories**:
  * [Dashboard.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/components/dashboard/Dashboard.jsx) — Patient Dashboard implementation (Health Score Ring, Recharts area trends, 10-Star reviews, AI warnings, pill lists).
  * [SymptomInput.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/components/symptom/SymptomInput.jsx) — AI Symptom Triage input layout.
  * [doctor/Dashboard.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/pages/doctor/Dashboard.jsx) — Doctor Clinical Management Dashboard page.
* **Shared UI System Primitives**:
  * [Input.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/components/ui/Input.jsx) — Custom input controls mapping system fonts and text color tokens.
  * [Button.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/components/ui/Button.jsx) — Interactive action button primitives.
  * [Badge.jsx](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/components/ui/Badge.jsx) — Status indicator chips.
* **Global Stores (Zustand Slices)**:
  * [authStore.js](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/store/authStore.js) — Access tokens and role assertions.
  * [userStore.js](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/store/userStore.js) — Profile schemas and health scores.
  * [recordsStore.js](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/store/recordsStore.js) — Timelines, charts, and file uploads.
  * [uiStore.js](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/store/uiStore.js) — Interface states, sidebar collapses, theme bindings.
* **Global Styles**:
  * [globals.css](file:///c:/Users/ncadi/OneDrive/Desktop/project/hachverse/onehealth/frontend/src/styles/globals.css) — Custom color matrices, animations, and Tailwind directives.

---

## 🚀 10. Getting Started & Local Development Run

To initiate the project environment locally:

1. Open a terminal in the root directory:
   ```bash
   cd onehealth/frontend
   ```
2. Install the library dependencies:
   ```bash
   npm install
   ```
3. Boot the local development Vite server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:5173` in a web browser. Use the header toggle to alternate between dark and light themes, and navigate using the left sidebar menu (on desktop) or bottom bar (on mobile).
