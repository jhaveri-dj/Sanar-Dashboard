// ─── Alex Chen — 12 weeks ───────────────────────────────────────────────────
const alexWeeklyData = [
  { week: 1,  label: 'Wk 1',  rom: { actual: 47,  expected: 50  }, emg: { vmo: 34, vl: 41, rf: 37, bf: 46, gastroc: 51 }, adherence: 72, sessions: 3, painScore: 7.2, symmetryIndex: 57 },
  { week: 2,  label: 'Wk 2',  rom: { actual: 52,  expected: 58  }, emg: { vmo: 36, vl: 43, rf: 39, bf: 47, gastroc: 53 }, adherence: 65, sessions: 3, painScore: 6.8, symmetryIndex: 59 },
  { week: 3,  label: 'Wk 3',  rom: { actual: 61,  expected: 66  }, emg: { vmo: 38, vl: 46, rf: 41, bf: 49, gastroc: 55 }, adherence: 80, sessions: 4, painScore: 6.1, symmetryIndex: 61 },
  { week: 4,  label: 'Wk 4',  rom: { actual: 68,  expected: 74  }, emg: { vmo: 41, vl: 49, rf: 44, bf: 52, gastroc: 58 }, adherence: 60, sessions: 3, painScore: 5.6, symmetryIndex: 63 },
  { week: 5,  label: 'Wk 5',  rom: { actual: 75,  expected: 82  }, emg: { vmo: 44, vl: 53, rf: 47, bf: 55, gastroc: 61 }, adherence: 85, sessions: 4, painScore: 5.0, symmetryIndex: 65 },
  { week: 6,  label: 'Wk 6',  rom: { actual: 83,  expected: 88  }, emg: { vmo: 47, vl: 57, rf: 50, bf: 58, gastroc: 64 }, adherence: 90, sessions: 5, painScore: 4.4, symmetryIndex: 68 },
  { week: 7,  label: 'Wk 7',  rom: { actual: 89,  expected: 94  }, emg: { vmo: 51, vl: 61, rf: 54, bf: 61, gastroc: 67 }, adherence: 95, sessions: 5, painScore: 3.9, symmetryIndex: 71 },
  { week: 8,  label: 'Wk 8',  rom: { actual: 96,  expected: 100 }, emg: { vmo: 55, vl: 65, rf: 57, bf: 64, gastroc: 70 }, adherence: 88, sessions: 4, painScore: 3.3, symmetryIndex: 74 },
  { week: 9,  label: 'Wk 9',  rom: { actual: 101, expected: 105 }, emg: { vmo: 58, vl: 68, rf: 60, bf: 67, gastroc: 73 }, adherence: 75, sessions: 4, painScore: 2.9, symmetryIndex: 76 },
  { week: 10, label: 'Wk 10', rom: { actual: 107, expected: 110 }, emg: { vmo: 62, vl: 72, rf: 63, bf: 70, gastroc: 76 }, adherence: 92, sessions: 5, painScore: 2.4, symmetryIndex: 79 },
  { week: 11, label: 'Wk 11', rom: { actual: 112, expected: 115 }, emg: { vmo: 66, vl: 75, rf: 66, bf: 72, gastroc: 78 }, adherence: 78, sessions: 4, painScore: 2.0, symmetryIndex: 81 },
  { week: 12, label: 'Wk 12', rom: { actual: 118, expected: 120 }, emg: { vmo: 72, vl: 78, rf: 70, bf: 75, gastroc: 80 }, adherence: 87, sessions: 4, painScore: 1.6, symmetryIndex: 84 },
]

const alexSessionLog = [
  { date: '2026-06-03', duration: 52, romAchieved: 118, avgActivation: 75, painScore: 1.6 },
  { date: '2026-06-01', duration: 48, romAchieved: 116, avgActivation: 73, painScore: 1.8 },
  { date: '2026-05-30', duration: 55, romAchieved: 115, avgActivation: 72, painScore: 1.7 },
  { date: '2026-05-28', duration: 50, romAchieved: 114, avgActivation: 71, painScore: 2.0 },
  { date: '2026-05-27', duration: 45, romAchieved: 112, avgActivation: 70, painScore: 2.1 },
  { date: '2026-05-25', duration: 53, romAchieved: 113, avgActivation: 69, painScore: 2.0 },
  { date: '2026-05-23', duration: 47, romAchieved: 111, avgActivation: 68, painScore: 2.2 },
  { date: '2026-05-21', duration: 50, romAchieved: 110, avgActivation: 67, painScore: 2.3 },
]

const alexSummary = {
  rom: 118, romPrevWeek: 112,
  avgEmg: 75, avgEmgPrevWeek: 71,
  adherence: 87, adherencePrevWeek: 78,
  symmetryIndex: 84, symmetryPrevWeek: 81,
  prescribedSessions: 5, completedSessions: 4,
  bestRom: 118, painAvg: 1.6,
  riskScore: 11,
  clinicianFlag: 'VMO lagging VL by 6% — monitor',
}

// Alex: clean — no clinical action thresholds breached
const alexAlerts = []

// ─── Marcus Webb — 6 weeks ───────────────────────────────────────────────────
const marcusWeeklyData = [
  { week: 1, label: 'Wk 1', rom: { actual: 43, expected: 50  }, emg: { vmo: 33, vl: 40, rf: 36, bf: 44, gastroc: 49 }, adherence: 68, sessions: 3, painScore: 7.8, symmetryIndex: 56 },
  { week: 2, label: 'Wk 2', rom: { actual: 55, expected: 58  }, emg: { vmo: 35, vl: 43, rf: 38, bf: 46, gastroc: 52 }, adherence: 80, sessions: 4, painScore: 7.1, symmetryIndex: 58 },
  { week: 3, label: 'Wk 3', rom: { actual: 63, expected: 66  }, emg: { vmo: 37, vl: 47, rf: 40, bf: 48, gastroc: 54 }, adherence: 72, sessions: 3, painScore: 6.4, symmetryIndex: 60 },
  { week: 4, label: 'Wk 4', rom: { actual: 70, expected: 74  }, emg: { vmo: 37, vl: 52, rf: 42, bf: 51, gastroc: 57 }, adherence: 48, sessions: 2, painScore: 5.9, symmetryIndex: 61 },
  { week: 5, label: 'Wk 5', rom: { actual: 77, expected: 82  }, emg: { vmo: 38, vl: 56, rf: 45, bf: 54, gastroc: 60 }, adherence: 55, sessions: 3, painScore: 5.2, symmetryIndex: 62 },
  { week: 6, label: 'Wk 6', rom: { actual: 89, expected: 95  }, emg: { vmo: 38, vl: 62, rf: 48, bf: 57, gastroc: 63 }, adherence: 52, sessions: 3, painScore: 3.2, symmetryIndex: 64 },
]

const marcusSessionLog = [
  { date: '2026-06-01', duration: 35, romAchieved: 89, avgActivation: 50, painScore: 3.2 },
  { date: '2026-05-29', duration: 40, romAchieved: 87, avgActivation: 49, painScore: 3.4 },
  { date: '2026-05-27', duration: 38, romAchieved: 85, avgActivation: 48, painScore: 3.6 },
  { date: '2026-05-22', duration: 45, romAchieved: 82, avgActivation: 47, painScore: 4.0 },
]

const marcusSummary = {
  rom: 89,  romPrevWeek: 77,
  avgEmg: 54, avgEmgPrevWeek: 51,
  adherence: 52, adherencePrevWeek: 55,
  symmetryIndex: 64, symmetryPrevWeek: 62,
  prescribedSessions: 5, completedSessions: 3,
  bestRom: 89, painAvg: 3.2,
  riskScore: 68,
  clinicianFlag: 'VMO-VL asymmetry 24% + dropout risk',
}

// Marcus: 3 clinical action alerts
const marcusAlerts = [
  {
    id: 'mw-1',
    patientId: 'marcus-webb-002',
    patientName: 'Marcus Webb',
    severity: 'red',
    title: 'Symmetry Index Below Clinical Threshold',
    message: 'Symmetry index is 64% — below the 70% threshold that requires clinical assessment before Phase 3 progression.',
    timestamp: '2026-06-05T08:00:00',
    recommendedAction: 'Schedule in-person gait analysis. Delay Phase 3 progression until symmetry reaches 70%. Consider contralateral strength testing.',
    category: 'Symmetry',
  },
  {
    id: 'mw-2',
    patientId: 'marcus-webb-002',
    patientName: 'Marcus Webb',
    severity: 'red',
    title: 'Dropout Risk — No Session in 4 Days',
    message: 'Last recorded session was June 1st. No activity for 4 days. Weekly adherence at 52%.',
    timestamp: '2026-06-05T08:30:00',
    recommendedAction: 'Initiate RTM outreach (CPT 98980). Review barriers to adherence. Offer adjusted home program or telehealth check-in.',
    category: 'Dropout',
  },
  {
    id: 'mw-3',
    patientId: 'marcus-webb-002',
    patientName: 'Marcus Webb',
    severity: 'red',
    title: 'EMG Asymmetry — VMO vs VL Gap 24%',
    message: 'VMO activation (38%) is 24% below VL (62%), exceeding the 20% clinical threshold. Compensation pattern likely.',
    timestamp: '2026-06-03T09:00:00',
    recommendedAction: 'Add VMO-isolation: SLR with internal rotation, VMO isometric press. Avoid load progression until asymmetry resolves.',
    category: 'EMG',
  },
]

// ─── Priya Sharma — weeks 11–22 (12-point chart window) ─────────────────────
const priyaWeeklyData = [
  { week: 11, label: 'Wk 11', rom: { actual: 113, expected: 115 }, emg: { vmo: 66, vl: 74, rf: 66, bf: 70, gastroc: 76 }, adherence: 90, sessions: 5, painScore: 1.0, symmetryIndex: 80 },
  { week: 12, label: 'Wk 12', rom: { actual: 118, expected: 120 }, emg: { vmo: 70, vl: 76, rf: 69, bf: 73, gastroc: 79 }, adherence: 95, sessions: 5, painScore: 0.8, symmetryIndex: 83 },
  { week: 13, label: 'Wk 13', rom: { actual: 120, expected: 122 }, emg: { vmo: 72, vl: 78, rf: 71, bf: 75, gastroc: 81 }, adherence: 92, sessions: 5, painScore: 0.7, symmetryIndex: 85 },
  { week: 14, label: 'Wk 14', rom: { actual: 122, expected: 124 }, emg: { vmo: 74, vl: 80, rf: 73, bf: 77, gastroc: 83 }, adherence: 96, sessions: 5, painScore: 0.6, symmetryIndex: 87 },
  { week: 15, label: 'Wk 15', rom: { actual: 124, expected: 125 }, emg: { vmo: 76, vl: 81, rf: 74, bf: 78, gastroc: 84 }, adherence: 90, sessions: 5, painScore: 0.6, symmetryIndex: 88 },
  { week: 16, label: 'Wk 16', rom: { actual: 125, expected: 126 }, emg: { vmo: 77, vl: 82, rf: 75, bf: 79, gastroc: 85 }, adherence: 94, sessions: 5, painScore: 0.5, symmetryIndex: 89 },
  { week: 17, label: 'Wk 17', rom: { actual: 126, expected: 127 }, emg: { vmo: 78, vl: 82, rf: 76, bf: 79, gastroc: 85 }, adherence: 96, sessions: 5, painScore: 0.5, symmetryIndex: 89 },
  { week: 18, label: 'Wk 18', rom: { actual: 127, expected: 128 }, emg: { vmo: 78, vl: 82, rf: 76, bf: 79, gastroc: 86 }, adherence: 95, sessions: 5, painScore: 0.4, symmetryIndex: 90 },
  { week: 19, label: 'Wk 19', rom: { actual: 127, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 86 }, adherence: 98, sessions: 5, painScore: 0.4, symmetryIndex: 90 },
  { week: 20, label: 'Wk 20', rom: { actual: 128, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 86 }, adherence: 95, sessions: 5, painScore: 0.4, symmetryIndex: 91 },
  { week: 21, label: 'Wk 21', rom: { actual: 128, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 77, bf: 78, gastroc: 86 }, adherence: 96, sessions: 5, painScore: 0.4, symmetryIndex: 91 },
  { week: 22, label: 'Wk 22', rom: { actual: 128, expected: 125 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 85 }, adherence: 96, sessions: 5, painScore: 0.4, symmetryIndex: 91 },
]

const priyaSessionLog = [
  { date: '2026-06-04', duration: 65, romAchieved: 128, avgActivation: 80, painScore: 0.4 },
  { date: '2026-06-02', duration: 60, romAchieved: 128, avgActivation: 80, painScore: 0.5 },
  { date: '2026-05-30', duration: 62, romAchieved: 128, avgActivation: 79, painScore: 0.4 },
  { date: '2026-05-28', duration: 58, romAchieved: 127, avgActivation: 79, painScore: 0.5 },
  { date: '2026-05-26', duration: 60, romAchieved: 127, avgActivation: 79, painScore: 0.5 },
  { date: '2026-05-24', duration: 65, romAchieved: 126, avgActivation: 78, painScore: 0.6 },
  { date: '2026-05-22', duration: 58, romAchieved: 125, avgActivation: 77, painScore: 0.6 },
  { date: '2026-05-20', duration: 60, romAchieved: 125, avgActivation: 77, painScore: 0.7 },
]

const priyaSummary = {
  rom: 128, romPrevWeek: 128,
  avgEmg: 80, avgEmgPrevWeek: 80,
  adherence: 96, adherencePrevWeek: 96,
  symmetryIndex: 91, symmetryPrevWeek: 91,
  prescribedSessions: 5, completedSessions: 5,
  bestRom: 128, painAvg: 0.4,
  riskScore: 5,
  clinicianFlag: 'No active flags — cleared for running program',
}

const priyaAlerts = []

// ─── Unified data map ────────────────────────────────────────────────────────
export const patientDataMap = {
  'alex-chen-001':   { weeklyData: alexWeeklyData,   sessionLog: alexSessionLog,   currentWeekSummary: alexSummary,   alerts: alexAlerts   },
  'marcus-webb-002': { weeklyData: marcusWeeklyData, sessionLog: marcusSessionLog, currentWeekSummary: marcusSummary, alerts: marcusAlerts },
  'priya-sharma-003':{ weeklyData: priyaWeeklyData,  sessionLog: priyaSessionLog,  currentWeekSummary: priyaSummary,  alerts: priyaAlerts  },
}

// All alerts across all patients (for Alerts inbox)
export const allAlerts = [...alexAlerts, ...marcusAlerts, ...priyaAlerts]

// ─── Backward-compat exports (RehabPlan.jsx uses rehabPhases) ────────────────
export const weeklyData         = alexWeeklyData
export const sessionLog         = alexSessionLog
export const currentWeekSummary = alexSummary
export const alerts             = alexAlerts

export const rehabPhases = [
  {
    number: 1,
    name: 'Acute / Protection',
    weekRange: 'Weeks 1–3',
    status: 'completed',
    goals: ['Control swelling', 'Restore full extension', 'Quad activation', 'Full weight bearing'],
  },
  {
    number: 2,
    name: 'Early Mobility',
    weekRange: 'Weeks 4–9',
    status: 'completed',
    goals: ['ROM 0–120°', 'Normal gait pattern', 'Closed chain exercises', 'Proprioception basics'],
  },
  {
    number: 3,
    name: 'Strengthening',
    weekRange: 'Weeks 10–16',
    status: 'current',
    goals: ['Quad/hamstring strength ≥70% MVIC', 'Single-leg squat', 'Lateral movements', 'Balance training'],
    exercises: [
      { name: 'Leg Press (single leg)', sets: 3, reps: '12–15', frequency: '3×/week', difficulty: 'Medium' },
      { name: 'Romanian Deadlift',      sets: 3, reps: '10–12', frequency: '3×/week', difficulty: 'Medium' },
      { name: 'Step-ups (8" box)',       sets: 3, reps: '15',    frequency: '3×/week', difficulty: 'Easy'   },
      { name: 'Terminal Knee Extensions',sets: 3, reps: '20',   frequency: 'Daily',    difficulty: 'Easy'   },
      { name: 'Single-leg Balance (Bosu)',sets: 3, reps: '30s', frequency: '3×/week', difficulty: 'Medium' },
      { name: 'Lateral Band Walks',      sets: 3, reps: '15 each', frequency: '3×/week', difficulty: 'Easy' },
      { name: 'Nordic Hamstring Curls',  sets: 3, reps: '8',    frequency: '2×/week', difficulty: 'Hard'   },
    ],
  },
  {
    number: 4,
    name: 'Neuromuscular / Power',
    weekRange: 'Weeks 17–24',
    status: 'upcoming',
    goals: ['Plyometric introduction', 'Running program', 'Sport-specific movements', 'Symmetry >90%'],
  },
  {
    number: 5,
    name: 'Return to Sport',
    weekRange: 'Weeks 25–52',
    status: 'upcoming',
    goals: ['Full sport participation', 'Psychological readiness', 'ACL Re-injury prevention program'],
  },
]

// ─── Per-patient rehab phase maps ────────────────────────────────────────────
const PHASE_DEFS = [
  { number: 1, name: 'Acute / Protection',   weekRange: 'Weeks 1–3',   goals: ['Control swelling', 'Restore full extension', 'Quad activation', 'Full weight bearing'] },
  { number: 2, name: 'Early Mobility',        weekRange: 'Weeks 4–9',   goals: ['ROM 0–120°', 'Normal gait pattern', 'Closed chain exercises', 'Proprioception basics'] },
  { number: 3, name: 'Strengthening',         weekRange: 'Weeks 10–16', goals: ['Quad/hamstring strength ≥70% MVIC', 'Single-leg squat', 'Lateral movements', 'Balance training'] },
  { number: 4, name: 'Neuromuscular / Power', weekRange: 'Weeks 17–24', goals: ['Plyometric introduction', 'Running program', 'Sport-specific movements', 'Symmetry >90%'] },
  { number: 5, name: 'Return to Sport',       weekRange: 'Weeks 25–52', goals: ['Full sport participation', 'Psychological readiness', 'ACL Re-injury prevention program'] },
]

const EXERCISES_BY_PHASE = {
  2: [
    { name: 'Heel Slides',                      sets: 3, reps: '15',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Quad Sets (isometric)',             sets: 3, reps: '20',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Straight Leg Raises',              sets: 3, reps: '15',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Stationary Bike (low resistance)', sets: 1, reps: '20 min', frequency: '5×/week', difficulty: 'Easy'   },
    { name: 'Calf Raises (bilateral)',          sets: 3, reps: '20',    frequency: '3×/week', difficulty: 'Easy'   },
    { name: 'Short Arc Quads',                  sets: 3, reps: '15',    frequency: '3×/week', difficulty: 'Easy'   },
  ],
  3: [
    { name: 'Leg Press (single leg)',            sets: 3, reps: '12–15',   frequency: '3×/week', difficulty: 'Medium' },
    { name: 'Romanian Deadlift',                 sets: 3, reps: '10–12',   frequency: '3×/week', difficulty: 'Medium' },
    { name: 'Step-ups (8" box)',                 sets: 3, reps: '15',       frequency: '3×/week', difficulty: 'Easy'   },
    { name: 'Terminal Knee Extensions',          sets: 3, reps: '20',       frequency: 'Daily',   difficulty: 'Easy'   },
    { name: 'Single-leg Balance (Bosu)',         sets: 3, reps: '30s',      frequency: '3×/week', difficulty: 'Medium' },
    { name: 'Lateral Band Walks',               sets: 3, reps: '15 each',  frequency: '3×/week', difficulty: 'Easy'   },
    { name: 'Nordic Hamstring Curls',           sets: 3, reps: '8',        frequency: '2×/week', difficulty: 'Hard'   },
  ],
  4: [
    { name: 'Box Jumps (bilateral)',             sets: 3, reps: '8',       frequency: '3×/week', difficulty: 'Hard'   },
    { name: 'Single-leg Hop (lateral)',          sets: 3, reps: '10 each', frequency: '3×/week', difficulty: 'Hard'   },
    { name: 'Running Intervals',                sets: 1, reps: '30 min',  frequency: '4×/week', difficulty: 'Medium' },
    { name: 'Agility Ladder Drills',            sets: 3, reps: '2 passes', frequency: '3×/week', difficulty: 'Medium' },
    { name: 'Reverse Lunges (weighted)',        sets: 3, reps: '12',      frequency: '3×/week', difficulty: 'Medium' },
    { name: 'Nordic Hamstring Curls',           sets: 3, reps: '10',      frequency: '2×/week', difficulty: 'Hard'   },
    { name: 'Lateral Shuffle Drills',           sets: 3, reps: '30s',     frequency: '3×/week', difficulty: 'Medium' },
  ],
}

function buildRehabPhases(currentPhaseNumber) {
  return PHASE_DEFS.map(def => ({
    ...def,
    status: def.number < currentPhaseNumber ? 'completed' : def.number === currentPhaseNumber ? 'current' : 'upcoming',
    ...(def.number === currentPhaseNumber ? { exercises: EXERCISES_BY_PHASE[currentPhaseNumber] } : {}),
  }))
}

export const rehabPhaseMap = {
  'alex-chen-001':    buildRehabPhases(3),
  'marcus-webb-002':  buildRehabPhases(2),
  'priya-sharma-003': buildRehabPhases(4),
}
