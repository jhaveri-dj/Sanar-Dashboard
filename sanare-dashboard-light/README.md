# Sanaré Tech — Clinical Dashboard (Demo)

A product demonstration dashboard built for Sanaré Tech, a MedTech startup developing the Sanaré Sleeve — a wearable ACL rehabilitation monitoring device.

**This is a demo prototype. All patient data is entirely synthetic.**

## The Problem
ACL recovery takes 9–12 months. Patients are seen by their physiotherapist for 1 hour per week — leaving 167 hours where clinicians have no visibility into how a patient is actually recovering at home. Poor adherence, compensation patterns, and early warning signs go undetected until the next appointment.

## The Product
The Sanaré Sleeve embeds dual sensors into a compression sleeve worn during home rehabilitation. This dashboard is the clinical intelligence layer — turning continuous home monitoring data into actionable insights for clinicians and a motivating recovery experience for patients.

## Two Portals, Two Jobs-to-be-Done

**Clinician Portal**
Designed for physiotherapists and orthopedic surgeons. Information-dense, data-forward. The clinician's job: identify which patients need attention this week and why.
- Patient roster with risk scoring across 3 patients at varying recovery stages
- ROM trend vs expected recovery curve
- EMG muscle activation by group (VMO, VL, RF, BF, Gastroc) across 12 weeks
- Anatomy heatmap — color-coded muscle activation zones (red/yellow/green)
- Alerts filtered to true clinical triggers only: symmetry drops, compensation patterns, dropout risk
- Recovery trajectory timeline from surgery to projected return-to-sport

**Patient Portal (light)**
Designed for patients recovering at home. Warm, simple, motivating. The patient's job: complete today's exercises and see their progress.
- Apple Health-style activity rings for daily movement, activation, and session goals
- Milestone timeline: Full weight bearing → Walking → Stairs → Jogging → Return to Sport
- Daily exercise log with completion tracking
- Secure messaging with physiotherapist (supports RTM billing under CPT 98980/98981)
- Simplified single-action home screen to maximize adherence

## Key Product Decisions

**Why two separate portals?** Clinicians and patients have fundamentally different information needs from the same underlying data. Showing a patient their raw EMG data creates anxiety. Showing a clinician only milestone progress loses clinical signal. The portal split is a product decision, not just a UX one.

**Why simplified patient home screen?** Research shows home exercise adherence in rehabilitation drops below 50% within weeks of discharge. Every additional click or decision point is a drop-off risk. The patient home screen has one primary action.

**Why messaging?** CPT codes 98980 and 98981 (Remote Therapeutic Monitoring) require interactive communication between patient and care team. The messaging feature is both a patient engagement tool and a reimbursement enabler for clinic partners.

**Why these specific alerts?** Early builds flagged adherence drops and ROM plateaus as alerts. These are trends — not action triggers. The final alert logic surfaces only events that change clinical decision-making today: symmetry index below threshold, EMG compensation patterns, patient dropout risk, and pain score spikes.

## Tech Stack
- React + Vite
- Tailwind CSS
- Recharts
- React Router v6
- Synthetic mock data (no backend)

## Running Locally
```
npm install
npm run dev
```

## Deploy to Netlify

This project is configured for Netlify out of the box.

1. Push the `sanare-dashboard-light` folder to a Git repository.
2. In [Netlify](https://app.netlify.com), choose **Add new site → Import an existing project**.
3. Set **Base directory** to `sanare-dashboard-light` (if the repo root is the parent folder).
4. Build settings (also in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Deploy. Client-side routing is handled via SPA redirects in `netlify.toml` and `public/_redirects`.

After deploy, open the site and use the login page to enter any of the three demo portals.

## About Sanaré Tech
Sanaré Tech is developing the Sanaré Sleeve for post-operative ACL rehabilitation monitoring. This dashboard represents the clinical data interface — sensor architecture, signal processing algorithms, and proprietary ML components are not represented in this codebase.
