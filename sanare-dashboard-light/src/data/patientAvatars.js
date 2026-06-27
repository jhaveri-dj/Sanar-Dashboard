/** Shared patient photo URLs — use instead of initials circles in clinician UI. */
export const PATIENT_AVATARS = {
  'alex-chen-001':    'https://i.pravatar.cc/96?img=11',
  'marcus-webb-002':  'https://i.pravatar.cc/96?img=52',
  'priya-sharma-003': 'https://i.pravatar.cc/96?img=45',
}

export function getPatientAvatar(patientId, size = 96) {
  const base = PATIENT_AVATARS[patientId] || 'https://i.pravatar.cc/96?img=1'
  return base.replace('/96?', `/${size}?`)
}
