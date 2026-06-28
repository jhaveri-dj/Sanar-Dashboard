// ─── Alex Chen — 12 weeks ───────────────────────────────────────────────────
const alexWeeklyData = [
  { week: 1,  label: 'Wk 1',  rom: { actual: 110, expected: 112 }, emg: { vmo: 34, vl: 41, rf: 37, bf: 46, gastroc: 51 }, adherence: 72, sessions: 3, painScore: 7.2, symmetryIndex: 57, jsi: 40 },
  { week: 2,  label: 'Wk 2',  rom: { actual: 112, expected: 114 }, emg: { vmo: 36, vl: 43, rf: 39, bf: 47, gastroc: 53 }, adherence: 65, sessions: 3, painScore: 6.8, symmetryIndex: 59, jsi: 43 },
  { week: 3,  label: 'Wk 3',  rom: { actual: 114, expected: 116 }, emg: { vmo: 38, vl: 46, rf: 41, bf: 49, gastroc: 55 }, adherence: 80, sessions: 4, painScore: 6.1, symmetryIndex: 61, jsi: 46 },
  { week: 4,  label: 'Wk 4',  rom: { actual: 113, expected: 118 }, emg: { vmo: 41, vl: 49, rf: 44, bf: 52, gastroc: 58 }, adherence: 60, sessions: 3, painScore: 5.6, symmetryIndex: 63, jsi: 49 },
  { week: 5,  label: 'Wk 5',  rom: { actual: 120, expected: 121 }, emg: { vmo: 44, vl: 53, rf: 47, bf: 55, gastroc: 61 }, adherence: 85, sessions: 4, painScore: 5.0, symmetryIndex: 65, jsi: 52 },
  { week: 6,  label: 'Wk 6',  rom: { actual: 119, expected: 123 }, emg: { vmo: 47, vl: 57, rf: 50, bf: 58, gastroc: 64 }, adherence: 90, sessions: 5, painScore: 4.4, symmetryIndex: 68, jsi: 55 },
  { week: 7,  label: 'Wk 7',  rom: { actual: 125, expected: 126 }, emg: { vmo: 51, vl: 61, rf: 54, bf: 61, gastroc: 67 }, adherence: 95, sessions: 5, painScore: 3.9, symmetryIndex: 71, jsi: 58 },
  { week: 8,  label: 'Wk 8',  rom: { actual: 124, expected: 128 }, emg: { vmo: 55, vl: 65, rf: 57, bf: 64, gastroc: 70 }, adherence: 88, sessions: 4, painScore: 3.3, symmetryIndex: 74, jsi: 62 },
  { week: 9,  label: 'Wk 9',  rom: { actual: 130, expected: 131 }, emg: { vmo: 58, vl: 68, rf: 60, bf: 67, gastroc: 73 }, adherence: 75, sessions: 4, painScore: 2.9, symmetryIndex: 76, jsi: 65 },
  { week: 10, label: 'Wk 10', rom: { actual: 129, expected: 133 }, emg: { vmo: 62, vl: 72, rf: 63, bf: 70, gastroc: 76 }, adherence: 92, sessions: 5, painScore: 2.4, symmetryIndex: 79, jsi: 67 },
  { week: 11, label: 'Wk 11', rom: { actual: 135, expected: 136 }, emg: { vmo: 66, vl: 75, rf: 66, bf: 72, gastroc: 78 }, adherence: 78, sessions: 4, painScore: 2.0, symmetryIndex: 81, jsi: 69 },
  { week: 12, label: 'Wk 12', rom: { actual: 138, expected: 140 }, emg: { vmo: 72, vl: 78, rf: 70, bf: 75, gastroc: 80 }, adherence: 87, sessions: 4, painScore: 1.6, symmetryIndex: 84, jsi: 71 },
]

const alexSessionLog = [
  { date: '2026-06-24', duration: 50, romAchieved: 138, avgActivation: 75, painScore: 1.6 },
  { date: '2026-06-23', duration: 46, romAchieved: 136, avgActivation: 74, painScore: 1.7 },
  { date: '2026-06-22', duration: 48, romAchieved: 137, avgActivation: 74, painScore: 1.7 },
  { date: '2026-06-21', duration: 44, romAchieved: 134, avgActivation: 73, painScore: 1.8 },
  { date: '2026-06-20', duration: 52, romAchieved: 135, avgActivation: 74, painScore: 1.7 },
  { date: '2026-06-19', duration: 47, romAchieved: 133, avgActivation: 72, painScore: 1.9 },
  { date: '2026-06-18', duration: 49, romAchieved: 135, avgActivation: 73, painScore: 1.8 },
  { date: '2026-06-17', duration: 45, romAchieved: 131, avgActivation: 71, painScore: 2.0 },
  { date: '2026-06-16', duration: 51, romAchieved: 132, avgActivation: 72, painScore: 1.8 },
  { date: '2026-06-15', duration: 48, romAchieved: 130, avgActivation: 70, painScore: 2.1 },
  { date: '2026-06-14', duration: 50, romAchieved: 129, avgActivation: 69, painScore: 2.2 },
  { date: '2026-06-13', duration: 46, romAchieved: 131, avgActivation: 70, painScore: 2.0 },
  { date: '2026-06-12', duration: 49, romAchieved: 128, avgActivation: 68, painScore: 2.3 },
  { date: '2026-06-11', duration: 47, romAchieved: 130, avgActivation: 69, painScore: 2.1 },
]

const alexSummary = {
  rom: 138, romPrevWeek: 135,
  avgEmg: 75, avgEmgPrevWeek: 71,
  adherence: 87, adherencePrevWeek: 78,
  symmetryIndex: 84, symmetryPrevWeek: 81,
  jointStrengthIndex: 71, jointStrengthPrevWeek: 67,
  prescribedSessions: 5, completedSessions: 4,
  bestRom: 138, painAvg: 1.6,
  riskScore: 11,
  clinicianFlag: 'VMO lagging VL by 6% — monitor',
}

// ─── Marcus Webb — 6 weeks (ACL + meniscus repair) ───────────────────────────
const marcusWeeklyData = [
  { week: 1, label: 'Wk 1', rom: { actual: 90, expected: 92  }, emg: { vmo: 33, vl: 40, rf: 36, bf: 44, gastroc: 49 }, adherence: 68, sessions: 3, painScore: 7.8, symmetryIndex: 56, jsi: 38 },
  { week: 2, label: 'Wk 2', rom: { actual: 92, expected: 93  }, emg: { vmo: 35, vl: 43, rf: 38, bf: 46, gastroc: 52 }, adherence: 80, sessions: 4, painScore: 7.1, symmetryIndex: 58, jsi: 40 },
  { week: 3, label: 'Wk 3', rom: { actual: 91, expected: 94  }, emg: { vmo: 37, vl: 47, rf: 40, bf: 48, gastroc: 54 }, adherence: 72, sessions: 3, painScore: 6.4, symmetryIndex: 60, jsi: 42 },
  { week: 4, label: 'Wk 4', rom: { actual: 94, expected: 95  }, emg: { vmo: 37, vl: 52, rf: 42, bf: 51, gastroc: 57 }, adherence: 48, sessions: 2, painScore: 5.9, symmetryIndex: 61, jsi: 44 },
  { week: 5, label: 'Wk 5', rom: { actual: 93, expected: 96  }, emg: { vmo: 38, vl: 56, rf: 45, bf: 54, gastroc: 60 }, adherence: 55, sessions: 3, painScore: 5.2, symmetryIndex: 62, jsi: 46 },
  { week: 6, label: 'Wk 6', rom: { actual: 97, expected: 98  }, emg: { vmo: 38, vl: 62, rf: 48, bf: 57, gastroc: 63 }, adherence: 52, sessions: 3, painScore: 3.2, symmetryIndex: 64, jsi: 48 },
]

const marcusSessionLog = [
  { date: '2026-06-01', duration: 35, romAchieved: 97, avgActivation: 50, painScore: 3.2 },
  { date: '2026-05-30', duration: 38, romAchieved: 95, avgActivation: 49, painScore: 3.3 },
  { date: '2026-05-29', duration: 40, romAchieved: 96, avgActivation: 49, painScore: 3.4 },
  { date: '2026-05-28', duration: 42, romAchieved: 94, avgActivation: 48, painScore: 3.5 },
  { date: '2026-05-27', duration: 38, romAchieved: 93, avgActivation: 48, painScore: 3.6 },
  { date: '2026-05-26', duration: 36, romAchieved: 92, avgActivation: 47, painScore: 3.7 },
  { date: '2026-05-25', duration: 40, romAchieved: 91, avgActivation: 47, painScore: 3.8 },
  { date: '2026-05-24', duration: 35, romAchieved: 92, avgActivation: 46, painScore: 3.8 },
  { date: '2026-05-23', duration: 38, romAchieved: 90, avgActivation: 46, painScore: 3.9 },
  { date: '2026-05-22', duration: 45, romAchieved: 91, avgActivation: 47, painScore: 4.0 },
  { date: '2026-05-21', duration: 40, romAchieved: 89, avgActivation: 45, painScore: 4.1 },
  { date: '2026-05-20', duration: 38, romAchieved: 90, avgActivation: 45, painScore: 4.2 },
  { date: '2026-05-19', duration: 42, romAchieved: 88, avgActivation: 44, painScore: 4.3 },
  { date: '2026-05-18', duration: 36, romAchieved: 89, avgActivation: 44, painScore: 4.4 },
]

const marcusSummary = {
  rom: 97,  romPrevWeek: 93,
  avgEmg: 54, avgEmgPrevWeek: 51,
  adherence: 52, adherencePrevWeek: 55,
  symmetryIndex: 64, symmetryPrevWeek: 62,
  jointStrengthIndex: 48, jointStrengthPrevWeek: 46,
  prescribedSessions: 5, completedSessions: 3,
  bestRom: 97, painAvg: 3.2,
  riskScore: 68,
  clinicianFlag: 'VMO-VL asymmetry 24% + dropout risk',
}

// ─── Priya Sharma — weeks 11–22 (12-point chart window) ─────────────────────
const priyaWeeklyData = [
  { week: 11, label: 'Wk 11', rom: { actual: 113, expected: 115 }, emg: { vmo: 66, vl: 74, rf: 66, bf: 70, gastroc: 76 }, adherence: 90, sessions: 5, painScore: 1.0, symmetryIndex: 80, jsi: 68 },
  { week: 12, label: 'Wk 12', rom: { actual: 118, expected: 120 }, emg: { vmo: 70, vl: 76, rf: 69, bf: 73, gastroc: 79 }, adherence: 95, sessions: 5, painScore: 0.8, symmetryIndex: 83, jsi: 70 },
  { week: 13, label: 'Wk 13', rom: { actual: 120, expected: 122 }, emg: { vmo: 72, vl: 78, rf: 71, bf: 75, gastroc: 81 }, adherence: 92, sessions: 5, painScore: 0.7, symmetryIndex: 85, jsi: 72 },
  { week: 14, label: 'Wk 14', rom: { actual: 122, expected: 124 }, emg: { vmo: 74, vl: 80, rf: 73, bf: 77, gastroc: 83 }, adherence: 96, sessions: 5, painScore: 0.6, symmetryIndex: 87, jsi: 74 },
  { week: 15, label: 'Wk 15', rom: { actual: 124, expected: 125 }, emg: { vmo: 76, vl: 81, rf: 74, bf: 78, gastroc: 84 }, adherence: 90, sessions: 5, painScore: 0.6, symmetryIndex: 88, jsi: 76 },
  { week: 16, label: 'Wk 16', rom: { actual: 125, expected: 126 }, emg: { vmo: 77, vl: 82, rf: 75, bf: 79, gastroc: 85 }, adherence: 94, sessions: 5, painScore: 0.5, symmetryIndex: 89, jsi: 78 },
  { week: 17, label: 'Wk 17', rom: { actual: 126, expected: 127 }, emg: { vmo: 78, vl: 82, rf: 76, bf: 79, gastroc: 85 }, adherence: 96, sessions: 5, painScore: 0.5, symmetryIndex: 89, jsi: 80 },
  { week: 18, label: 'Wk 18', rom: { actual: 127, expected: 128 }, emg: { vmo: 78, vl: 82, rf: 76, bf: 79, gastroc: 86 }, adherence: 95, sessions: 5, painScore: 0.4, symmetryIndex: 90, jsi: 82 },
  { week: 19, label: 'Wk 19', rom: { actual: 126, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 86 }, adherence: 98, sessions: 5, painScore: 0.4, symmetryIndex: 90, jsi: 84 },
  { week: 20, label: 'Wk 20', rom: { actual: 129, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 86 }, adherence: 95, sessions: 5, painScore: 0.4, symmetryIndex: 91, jsi: 86 },
  { week: 21, label: 'Wk 21', rom: { actual: 128, expected: 128 }, emg: { vmo: 79, vl: 82, rf: 77, bf: 78, gastroc: 86 }, adherence: 96, sessions: 5, painScore: 0.4, symmetryIndex: 91, jsi: 87 },
  { week: 22, label: 'Wk 22', rom: { actual: 130, expected: 125 }, emg: { vmo: 79, vl: 82, rf: 76, bf: 78, gastroc: 85 }, adherence: 96, sessions: 5, painScore: 0.4, symmetryIndex: 91, jsi: 88 },
]

const priyaSessionLog = [
  { date: '2026-06-04', duration: 65, romAchieved: 130, avgActivation: 80, painScore: 0.4 },
  { date: '2026-06-03', duration: 62, romAchieved: 128, avgActivation: 79, painScore: 0.5 },
  { date: '2026-06-02', duration: 60, romAchieved: 129, avgActivation: 80, painScore: 0.5 },
  { date: '2026-06-01', duration: 58, romAchieved: 127, avgActivation: 79, painScore: 0.5 },
  { date: '2026-05-31', duration: 61, romAchieved: 126, avgActivation: 78, painScore: 0.6 },
  { date: '2026-05-30', duration: 62, romAchieved: 128, avgActivation: 79, painScore: 0.4 },
  { date: '2026-05-29', duration: 59, romAchieved: 125, avgActivation: 78, painScore: 0.6 },
  { date: '2026-05-28', duration: 58, romAchieved: 127, avgActivation: 79, painScore: 0.5 },
  { date: '2026-05-27', duration: 60, romAchieved: 124, avgActivation: 77, painScore: 0.7 },
  { date: '2026-05-26', duration: 60, romAchieved: 126, avgActivation: 79, painScore: 0.5 },
  { date: '2026-05-25', duration: 63, romAchieved: 125, avgActivation: 78, painScore: 0.6 },
  { date: '2026-05-24', duration: 65, romAchieved: 123, avgActivation: 77, painScore: 0.7 },
  { date: '2026-05-23', duration: 58, romAchieved: 126, avgActivation: 78, painScore: 0.6 },
  { date: '2026-05-22', duration: 58, romAchieved: 124, avgActivation: 77, painScore: 0.6 },
]

const priyaSummary = {
  rom: 130, romPrevWeek: 128,
  avgEmg: 80, avgEmgPrevWeek: 80,
  adherence: 96, adherencePrevWeek: 96,
  symmetryIndex: 91, symmetryPrevWeek: 91,
  jointStrengthIndex: 88, jointStrengthPrevWeek: 87,
  prescribedSessions: 5, completedSessions: 5,
  bestRom: 130, painAvg: 0.4,
  riskScore: 5,
  clinicianFlag: 'No active flags — cleared for running program',
}

// ─── Unified data map ────────────────────────────────────────────────────────
export const patientDataMap = {
  'alex-chen-001':   { weeklyData: alexWeeklyData,   sessionLog: alexSessionLog,   currentWeekSummary: alexSummary   },
  'marcus-webb-002': { weeklyData: marcusWeeklyData, sessionLog: marcusSessionLog, currentWeekSummary: marcusSummary },
  'priya-sharma-003':{ weeklyData: priyaWeeklyData,  sessionLog: priyaSessionLog,  currentWeekSummary: priyaSummary  },
}

export const allAlerts = []

// ─── Backward-compat exports (RehabPlan.jsx uses rehabPhases) ────────────────
export const weeklyData         = alexWeeklyData
export const sessionLog         = alexSessionLog
export const currentWeekSummary = alexSummary
export const alerts             = []

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
  1: [
    { name: 'Ankle Pumps',              sets: 3, reps: '20',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Quad Sets (isometric)',    sets: 3, reps: '20',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Heel Slides',              sets: 3, reps: '15',    frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Patellar Mobilization',    sets: 2, reps: '2 min', frequency: 'Daily',    difficulty: 'Easy'   },
    { name: 'Crutch Walking (NWB)',     sets: 1, reps: '10 min', frequency: 'Daily',   difficulty: 'Easy'   },
  ],
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
  5: [
    { name: 'Sport-specific Drills',            sets: 3, reps: '15 min',  frequency: '4×/week', difficulty: 'Hard'   },
    { name: 'Cutting & Pivoting Progression',   sets: 3, reps: '10 each', frequency: '3×/week', difficulty: 'Hard'   },
    { name: 'Single-leg Hop Testing',           sets: 3, reps: '8',       frequency: '2×/week', difficulty: 'Medium' },
    { name: 'ACL Prevention Warm-up',           sets: 1, reps: '20 min',  frequency: 'Daily',   difficulty: 'Easy'   },
    { name: 'Return-to-Sport Clearance Test',   sets: 1, reps: '45 min',  frequency: '1×/week', difficulty: 'Hard'   },
  ],
}

export { EXERCISES_BY_PHASE }

function buildRehabPhases(currentPhaseNumber) {
  return PHASE_DEFS.map(def => ({
    ...def,
    status: def.number < currentPhaseNumber ? 'completed' : def.number === currentPhaseNumber ? 'current' : 'upcoming',
    ...(EXERCISES_BY_PHASE[def.number] ? { exercises: EXERCISES_BY_PHASE[def.number] } : {}),
  }))
}

export const rehabPhaseMap = {
  'alex-chen-001':    buildRehabPhases(3),
  'marcus-webb-002':  buildRehabPhases(2),
  'priya-sharma-003': buildRehabPhases(4),
}

export const clinicianRoster = [
  {
    id: 'alex-chen-001',
    avatar: 'https://i.pravatar.cc/32?img=11',
    name: 'Alex Chen',
    injury: 'ACL – Patellar',
    week: 12,
    rom: '138°',
    adherence: 87,
    symmetry: 84,
    strength: 71,
    rtm: 'On Track',
  },
  {
    id: 'marcus-webb-002',
    avatar: 'https://i.pravatar.cc/32?img=52',
    name: 'Marcus Webb',
    injury: 'ACL + Meniscus – Hamstring',
    week: 6,
    rom: '97°',
    adherence: 52,
    symmetry: 64,
    strength: 48,
    rtm: 'At Risk',
  },
  {
    id: 'priya-sharma-003',
    avatar: 'https://i.pravatar.cc/32?img=45',
    name: 'Priya Sharma',
    injury: 'ACL – Patellar',
    week: 22,
    rom: '130°',
    adherence: 96,
    symmetry: 91,
    strength: 88,
    rtm: 'Progressing Well',
  },
]

/** Flexion ROM scale — normal 130–140°, max 150°. Chart uses inverted Y (150 − flexion). */
export const ROM_FLEXION_MAX = 150
export const ROM_FLEXION_NORMAL_MIN = 130
export const ROM_FLEXION_NORMAL_MAX = 140
export const ROM_BASELINE_STANDARD = 110   // standard ACL reconstruction
export const ROM_BASELINE_MENISCUS = 90    // ACL + meniscus repair
export const ROM_FLEXION_GOAL_CHART = 0    // chart Y at 150° flexion goal

/** @deprecated use ROM_FLEXION_MAX */
export const ROM_EXTENSION = ROM_FLEXION_MAX

export function flexionToChart(flexionDeg) {
  return ROM_FLEXION_MAX - flexionDeg
}

export function chartToFlexion(chartVal) {
  return ROM_FLEXION_MAX - chartVal
}

export function getRomBaseline(patientId) {
  return patientId === 'marcus-webb-002' ? ROM_BASELINE_MENISCUS : ROM_BASELINE_STANDARD
}

export function romChartDomain(baselineFlexion) {
  return [ROM_FLEXION_GOAL_CHART, flexionToChart(baselineFlexion)]
}

/** Build last-14-day ROM + adherence series from session log (for daily chart view). */
export function buildDailyMetrics(sessionLog, endDate = '2026-06-26', weeklyData = []) {
  const end = new Date(endDate)
  const sortedSessions = [...sessionLog].sort((a, b) => a.date.localeCompare(b.date))
  const days = []

  function flexionForDate(iso) {
    const exact = sortedSessions.find(s => s.date === iso)
    if (exact) return exact.romAchieved

    const before = sortedSessions.filter(s => s.date <= iso).at(-1)
    const after = sortedSessions.find(s => s.date > iso)

    if (before && after) {
      const t0 = new Date(before.date).getTime()
      const t1 = new Date(after.date).getTime()
      const t = new Date(iso).getTime()
      const ratio = (t - t0) / (t1 - t0)
      return Math.round(before.romAchieved + ratio * (after.romAchieved - before.romAchieved))
    }
    if (before) return before.romAchieved
    if (after) return after.romAchieved
    if (weeklyData.length) return weeklyData.at(-1)?.rom?.actual ?? weeklyData[0].rom.actual
    return null
  }

  for (let i = 13; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)

    const flexion = flexionForDate(iso)
    const sessionToday = sortedSessions.some(s => s.date === iso)

    days.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateLabel: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      romActual: flexion != null ? flexionToChart(flexion) : null,
      flexionActual: flexion,
      romTarget: ROM_FLEXION_GOAL_CHART,
      adherence: sessionToday ? 100 : 0,
    })
  }
  return days
}

/** Y-axis ticks in chart coordinates; labels show flexion via chartToFlexion. */
export function romYAxisTicks(baselineFlexion = ROM_BASELINE_MENISCUS) {
  const ticks = []
  for (let f = baselineFlexion; f <= ROM_FLEXION_MAX; f += 10) {
    ticks.push(flexionToChart(f))
  }
  return ticks
}
