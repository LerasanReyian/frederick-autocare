import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, ShieldCheck, X } from 'lucide-react'
import useDialogFocus from '../hooks/useDialogFocus.js'
export function StaffAccessForm({ onVerified }) {
  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function verify(event) {
    event.preventDefault()
    setError('')
    if (!staffId.trim()) { setError('Enter your assigned staff ID.'); return }
    setBusy(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/auth/entry`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffId }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to verify this staff ID.')
      onVerified()
    } catch (failure) { setError(!navigator.onLine ? 'You are offline. Reconnect to verify your staff ID.' : failure.message || 'Staff verification is unavailable. Please try again.') }
    finally { setBusy(false) }
  }
  return <>
    <div className="staff-step"><ShieldCheck size={18} /> STEP 1 OF 2 · STAFF ID</div>
    <h2 id="staff-access-title">Your team.<br /><span>Your workspace.</span></h2>
    <p className="staff-intro">Enter your assigned Admin or Employee ID to continue to the staff sign-in page.</p>
    <form className="staff-id-form" onSubmit={verify} noValidate>
      <label htmlFor="staff-id">Staff ID</label>
      <input id="staff-id" name="staffId" value={staffId} onChange={event => setStaffId(event.target.value.toUpperCase())} autoComplete="off" spellCheck="false" maxLength={24} placeholder="FA-A-XXXXXXXX or FA-E-XXXXXXXX" aria-invalid={Boolean(error)} aria-describedby={error ? 'staff-id-error' : 'staff-id-help'} required />
      <p id="staff-id-help">Use the ID issued by your shop administrator.</p>
      {error && <p id="staff-id-error" className="staff-error" role="alert">{error}</p>}
      <button className="staff-submit" type="submit" disabled={busy}>{busy ? 'Checking your ID…' : 'Continue to sign in'} <ArrowRight size={17} /></button>
    </form>
    <p className="staff-footnote"><ShieldCheck size={16} /> Your password is still required on the next step.</p>
  </>
}
StaffAccessForm.propTypes = { onVerified: PropTypes.func.isRequired }
export default function StaffAccessModal({ onClose }) {
  const panel = useRef(null)
  useDialogFocus(panel, onClose)
  return <div className="staff-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="staff-access-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="staff-access-title" tabIndex={-1}>
      <button className="staff-modal-close" onClick={onClose} type="button" aria-label="Close staff ID check"><X size={20} /></button>
      <StaffAccessForm onVerified={() => window.location.assign('/inventory')} />
      <a className="staff-request-link" href="/inventory?request=1">New employee? Request an account</a>
    </section>
  </div>
}
StaffAccessModal.propTypes = { onClose: PropTypes.func.isRequired }
