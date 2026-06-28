import { patientDataMap } from '../data/clinicianData'
import { patients } from '../data/patients'

export const SURGEON_REPORT_TYPES = [
  { id: 'recovery-summary', title: 'Post-op recovery summary', description: 'ROM, symmetry, and strength trends for this patient.' },
  { id: 'rts-readiness', title: 'Return-to-sport readiness', description: 'LSI, strength index, and clearance criteria status.' },
  { id: 'emg-compensation', title: 'EMG compensation analysis', description: 'Muscle activation asymmetry and VMO-VL ratios.' },
]

export const CLINICIAN_REPORT_TYPES = [
  { id: 'weekly-summary', title: 'Weekly recovery summary', description: 'ROM, adherence, and symmetry trends.' },
  { id: 'rtm-billing', title: 'RTM billing report', description: 'Session logs for CPT 98980 / 98981 reimbursement.' },
  { id: 'emg-compensation', title: 'EMG compensation analysis', description: 'Muscle activation asymmetry flags.' },
  { id: 'rts-readiness', title: 'Return-to-sport readiness', description: 'LSI, strength index, and clearance status.' },
]

function buildPatientMetrics(patientId) {
  const patient = patients.find(p => p.id === patientId)
  const data = patientDataMap[patientId]
  const s = data?.currentWeekSummary
  const weeks = data?.weeklyData ?? []
  const romTrend = weeks.slice(-6).map(w => `${w.label}: ${w.rom.actual}°`).join(' · ')

  return { patient, summary: s, romTrend }
}

export function exportPatientReportPdf({ reportType, patientId, portalLabel = 'Clinical Report' }) {
  const report = [...SURGEON_REPORT_TYPES, ...CLINICIAN_REPORT_TYPES].find(r => r.id === reportType)
  const { patient, summary, romTrend } = buildPatientMetrics(patientId)
  if (!report || !patient || !summary) return

  const metricsHtml = `
    <ul style="font-size:14px;line-height:1.8;padding-left:20px;">
      <li>Current ROM: <strong>${summary.rom}°</strong></li>
      <li>Symmetry index: <strong>${summary.symmetryIndex}%</strong></li>
      <li>Joint strength index: <strong>${summary.jointStrengthIndex}%</strong></li>
      <li>Weekly adherence: <strong>${summary.adherence}%</strong></li>
      <li>Recovery week: <strong>${patient.weekInRecovery}</strong> · Phase: ${patient.currentPhase.name}</li>
    </ul>
    <p style="font-size:14px;"><strong>Recent ROM trend:</strong> ${romTrend || '—'}</p>
  `

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${report.title} — ${patient.name}</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; max-width: 720px; margin: 48px auto; color: #111827; line-height: 1.6; }
  h1 { font-size: 22px; margin: 0 0 8px; color: #4F52C4; }
  h2 { font-size: 16px; margin: 24px 0 8px; }
  .meta { font-size: 13px; color: #6B7280; margin-bottom: 24px; }
  .badge { display: inline-block; background: #EEF2FF; color: #4F52C4; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; margin-bottom: 20px; }
  p { font-size: 14px; }
  footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF; }
</style></head><body>
  <div class="badge">Sanaré Tech · ${portalLabel}</div>
  <h1>${report.title}</h1>
  <p class="meta">${patient.name} · Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  <p>${report.description}</p>
  <h2>Patient snapshot</h2>
  ${metricsHtml}
  <p style="font-size:13px;color:#6B7280;">Synthetic demo data for product demonstration only — not for clinical use.</p>
  <footer>Sanaré Dashboard · Demo prototype</footer>
</body></html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 300)
}
