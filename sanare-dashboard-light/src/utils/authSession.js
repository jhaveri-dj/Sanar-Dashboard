export const SESSION_KEY = 'sanare_user'

export function hasSession() {
  try {
    return !!localStorage.getItem(SESSION_KEY)
  } catch {
    return false
  }
}

export function readSessionUser() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

/** Full sign-out: clear storage and hard-navigate so bfcache cannot restore auth. */
export function signOut() {
  clearSession()
  window.location.replace('/login')
}
