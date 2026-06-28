import { EXERCISES_BY_PHASE } from './clinicianData'

export const DEFAULT_VIDEOS = {
  'Leg Press (single leg)': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
  'Terminal Knee Extensions': 'https://www.youtube.com/watch?v=ADid8jssmFI',
  'Romanian Deadlift': 'https://www.youtube.com/watch?v=2SHskkLwo4M',
  'Heel Slides': 'https://www.youtube.com/watch?v=5M9OrUKNaEc',
  'Step-ups (8" box)': 'https://www.youtube.com/watch?v=5M9OrUKNaEc',
  'Single-leg Balance (Bosu)': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
  'Lateral Band Walks': 'https://www.youtube.com/watch?v=ADid8jssmFI',
  'Nordic Hamstring Curls': 'https://www.youtube.com/watch?v=2SHskkLwo4M',
  'Straight Leg Raises': 'https://www.youtube.com/watch?v=ADid8jssmFI',
  'Quad Sets (isometric)': 'https://www.youtube.com/watch?v=5M9OrUKNaEc',
  'Stationary Bike (low resistance)': 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
}

export function withDefaults(exercises = []) {
  return exercises.map((ex, i) => ({
    id: `ex-${i}-${ex.name}`,
    name: ex.name,
    sets: ex.sets,
    reps: ex.reps,
    duration: ex.duration || ex.reps,
    frequency: ex.frequency,
    difficulty: ex.difficulty,
    videoUrl: ex.videoUrl || DEFAULT_VIDEOS[ex.name] || '',
  }))
}

export function buildPhasePlans(rehabPhases) {
  return Object.fromEntries(
    rehabPhases.map(ph => [
      ph.number,
      {
        title: `Phase ${ph.number}: ${ph.name} Protocol`,
        exercises: withDefaults(ph.exercises || EXERCISES_BY_PHASE[ph.number] || []),
      },
    ])
  )
}

export function getCurrentPhasePlan(patientId, rehabPhaseMap) {
  const rehabPhases = rehabPhaseMap[patientId] || rehabPhaseMap['alex-chen-001']
  const current = rehabPhases.find(ph => ph.status === 'current')
  const phasePlans = buildPhasePlans(rehabPhases)
  return {
    rehabPhases,
    currentPhase: current,
    plan: current ? phasePlans[current.number] : null,
    phasePlans,
  }
}
