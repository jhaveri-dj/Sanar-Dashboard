export const milestones = [
  {
    id: 1,
    name: 'Full Weight Bearing',
    icon: '✅',
    status: 'completed',
    completedDate: '2026-03-26',
    targetDate: '2026-03-28',
    description: 'Walking without crutches and bearing full weight on operated leg.',
    weeksPostSurgery: 2,
  },
  {
    id: 2,
    name: 'Walking Without Crutches',
    icon: '✅',
    status: 'completed',
    completedDate: '2026-04-09',
    targetDate: '2026-04-12',
    description: 'Normal gait pattern restored, no assistive device needed.',
    weeksPostSurgery: 4,
  },
  {
    id: 3,
    name: 'Stairs Independently',
    icon: '✅',
    status: 'completed',
    completedDate: '2026-04-30',
    targetDate: '2026-05-03',
    description: 'Ascending and descending stairs without handrail at normal speed.',
    weeksPostSurgery: 7,
  },
  {
    id: 4,
    name: 'Light Jogging',
    icon: '🔄',
    status: 'in-progress',
    completedDate: null,
    targetDate: '2026-07-03',
    description: 'Sustained 10-minute jog at comfortable pace with no pain.',
    weeksPostSurgery: 16,
    progress: 73,
    progressLabel: '73% — on track',
  },
  {
    id: 5,
    name: 'Return to Sport',
    icon: '🔒',
    status: 'locked',
    completedDate: null,
    targetDate: '2026-11-12',
    description: 'Full return to pre-injury sport with clearance from surgeon and PT.',
    weeksPostSurgery: 36,
    progress: 0,
  },
]

export const currentMilestone = milestones.find(m => m.status === 'in-progress')

// Last 14 days of exercise log (most recent first)
export const exerciseLog = [
  {
    date: '2026-06-05',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: false, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: false, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-06-04',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-06-03',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: false, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-06-02',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: false, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-06-01',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-31',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: false, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: false, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: false, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: false, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: false, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-30',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-29',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: false, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-28',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: false, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-27',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-26',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: false, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: false, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: false, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: false, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: false, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-25',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-24',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: true, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: false, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
  {
    date: '2026-05-23',
    exercises: [
      { name: 'Quad Sets', sets: 3, reps: 20, completed: true, duration: 8, difficulty: 'Easy' },
      { name: 'Straight Leg Raises', sets: 3, reps: 15, completed: false, duration: 6, difficulty: 'Easy' },
      { name: 'Mini Squats', sets: 3, reps: 15, completed: true, duration: 8, difficulty: 'Medium' },
      { name: 'Terminal Knee Extensions', sets: 3, reps: 20, completed: true, duration: 7, difficulty: 'Easy' },
      { name: 'Calf Raises', sets: 3, reps: 20, completed: true, duration: 5, difficulty: 'Easy' },
    ],
  },
]

// 8-week heatmap data for GitHub-style contribution graph
// Each week is an array of 7 days (Sun–Sat), value = 0 (missed), 1 (partial), 2 (complete)
export const heatmapData = [
  { week: 'May 5',  days: [0, 2, 2, 1, 2, 0, 2] },
  { week: 'May 12', days: [2, 2, 0, 2, 2, 1, 2] },
  { week: 'May 19', days: [0, 2, 2, 2, 0, 2, 2] },
  { week: 'May 26', days: [2, 0, 2, 2, 2, 0, 2] },
  { week: 'Jun 2',  days: [2, 2, 2, 1, 0, 2, 2] },
  { week: 'Jun 9',  days: [2, 2, 0, 2, 2, 2, 1] },
  { week: 'Jun 16', days: [0, 2, 2, 2, 2, 0, 2] },
  { week: 'Jun 23', days: [2, 2, 2, 0, 2, 2, 2] },
]

export const weeklyReadiness = [
  { week: 'Wk 5',  score: 54 },
  { week: 'Wk 6',  score: 61 },
  { week: 'Wk 7',  score: 68 },
  { week: 'Wk 8',  score: 72 },
  { week: 'Wk 9',  score: 67 },
  { week: 'Wk 10', score: 76 },
  { week: 'Wk 11', score: 80 },
  { week: 'Wk 12', score: 83 },
]

export const activityRings = {
  dailyMovement: { current: 82, target: 100, label: 'Daily ROM Goal', color: '#3B82F6' },
  muscleActivation: { current: 75, target: 100, label: 'Muscle Activation', color: '#10B981' },
  sessionCompletion: { current: 3, target: 4, label: 'Sessions This Week', color: '#F97316', percent: 75 },
}

export const todayStats = {
  currentRom: 118,
  bestRomToday: 118,
  activationScore: 75,
  streak: 8,
}

export const weeklyInsights = {
  romImprovement: 4,
  adherence: 85,
  vmoActivationIncrease: 8,
  weekLabel: 'Week 12',
  motivationalMessage:
    "You're in the Strengthening phase — the hardest part is behind you. Your consistency is paying off. Keep pushing to hit Light Jogging by Week 16.",
  nextMilestone: milestones.find(m => m.status === 'in-progress'),
}

// Last 4 weeks of ROM for patient insights chart
export const recentRomTrend = [
  { week: 'Wk 9',  rom: 101 },
  { week: 'Wk 10', rom: 107 },
  { week: 'Wk 11', rom: 112 },
  { week: 'Wk 12', rom: 118 },
]
