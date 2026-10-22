import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ArrowRight, CalendarCheck, Check, Mail, MapPin, Phone, X } from 'lucide-react'
import servicesData from '../data/servicesData.js'

function getManilaDateTimeInputValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).reduce((values, part) => ({ ...values, [part.type]: part.value }), {})
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

function parseManilaAppointment(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
    ? new Date(`${value}:00+08:00`)
    : new Date(Number.NaN)
}

function BookingModal({ isOpen, onClose, service, onServiceChange }) {
  const [step, setStep] = useState('form')
  const [bookingDetails, setBookingDetails] = useState(null)
  const [submissionError, setSubmissionError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [minimumAppointment] = useState(() => getManilaDateTimeInputValue())

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previouslyFocused = document.activeElement
    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nextErrors = {}
    const appointment = String(formData.get('appointment') || '')
    const appointmentDate = parseManilaAppointment(appointment)
    const appointmentParts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(appointment)
    const appointmentHour = appointmentParts ? Number(appointmentParts[4]) : Number.NaN
    if (!String(formData.get('name') || '').trim()) nextErrors.name = 'Enter your full name.'
    if (!/^09\d{2} ?\d{3} ?\d{4}$/.test(String(formData.get('phone') || '').trim())) nextErrors.phone = 'Use a Philippine mobile number like 0917 123 4567.'
    if (!String(formData.get('vehicle') || '').trim()) nextErrors.vehicle = 'Enter your vehicle make and model.'
    if (!service) nextErrors.service = 'Select a service.'
    if (Number.isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) nextErrors.appointment = 'Choose a future appointment time.'
    else if (appointmentDate.getUTCDay() === 0 || appointmentHour < 8 || appointmentHour >= 17) nextErrors.appointment = 'Choose Monday to Saturday, between 8:00 AM and 5:00 PM.'
    if (String(formData.get('notes') || '').length > 1000) nextErrors.notes = 'Keep notes within 1,000 characters.'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setBookingDetails({
      name: formData.get('name'),
      phone: formData.get('phone'),
      vehicle: formData.get('vehicle'),
      service,
      appointment,
      notes: formData.get('notes'),
    })
    setStep('review')
  }

  async function handleConfirmRequest() {
    setIsSubmitting(true)
    setSubmissionError('')
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails),
      })
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('The booking service returned an invalid response. Please restart the current backend server and try again.')
      }
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to submit your booking request.')
      setStep('success')
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to submit your booking request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function formatAppointment(value) {
    return new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Manila',
    }).format(parseManilaAppointment(value))
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={modalRef}
        className="booking-modal booking-modal-step"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="Close booking form">
          <X size={20} />
        </button>

        {step === 'success' && bookingDetails ? (
          <div className="booking-success" role="status">
            <span className="success-mark"><CalendarCheck size={27} /></span>
            <div className="modal-kicker"><span className="eyebrow-dot" /> Request submitted</div>
            <h2 id="booking-title">You&apos;re one step<br /><span>closer to your upgrade.</span></h2>
            <p className="modal-intro">
              Thanks, {bookingDetails.name}. Your request is now waiting for the shop to confirm your appointment.
            </p>
            <dl className="booking-summary">
              <div><dt>Vehicle</dt><dd>{bookingDetails.vehicle}</dd></div>
              <div><dt>Service</dt><dd>{bookingDetails.service}</dd></div>
              <div><dt>Requested time</dt><dd>{formatAppointment(bookingDetails.appointment)}</dd></div>
              <div><dt>Contact number</dt><dd>{bookingDetails.phone}</dd></div>
              {bookingDetails.notes && <div><dt>Notes</dt><dd>{bookingDetails.notes}</dd></div>}
            </dl>
            <div className="booking-contact-note">
              <MapPin size={17} />
              <p>
                Please call the shop to confirm your visit at Door 5 #99 Cabaguio Avenue,
                Brgy. Gov Paciano Bangoy, Davao City.
              </p>
            </div>
            <div className="success-actions">
              <a className="button button-primary" href="tel:+639663072418">
                <Phone size={16} /> Call 0966 307 2418
              </a>
              <a
                className="button success-back"
                href={`mailto:frederickcaraccessories@gmail.com?subject=${encodeURIComponent(`Service request: ${bookingDetails.service}`)}&body=${encodeURIComponent([
                  `Hello Frederick Car Accessories,`,
                  ``,
                  `I would like to request an appointment.`,
                  `Name: ${bookingDetails.name}`,
                  `Contact: ${bookingDetails.phone}`,
                  `Vehicle: ${bookingDetails.vehicle}`,
                  `Service: ${bookingDetails.service}`,
                  `Requested time: ${formatAppointment(bookingDetails.appointment)}`,
                  bookingDetails.notes ? `Notes: ${bookingDetails.notes}` : '',
                ].filter(Boolean).join('\n'))}`}
              >
                <Mail size={16} /> Email request
              </a>
              <button className="button success-back" type="button" onClick={onClose}>Done</button>
            </div>
            <p className="modal-note">Your requested time is not confirmed until the shop contacts you.</p>
          </div>
        ) : step === 'review' && bookingDetails ? (
          <div className="booking-success" role="region" aria-labelledby="booking-title">
            <span className="success-mark"><Check size={27} /></span>
            <div className="modal-kicker"><span className="eyebrow-dot" /> Step 2 of 2 · Review details</div>
            <h2 id="booking-title">Check your<br /><span>appointment request.</span></h2>
            <p className="modal-intro">Make sure these details are right before you contact the shop to confirm.</p>
            <dl className="booking-summary">
              <div><dt>Customer</dt><dd>{bookingDetails.name}</dd></div>
              <div><dt>Vehicle</dt><dd>{bookingDetails.vehicle}</dd></div>
              <div><dt>Service</dt><dd>{bookingDetails.service}</dd></div>
              <div><dt>Requested time</dt><dd>{formatAppointment(bookingDetails.appointment)}</dd></div>
              <div><dt>Contact number</dt><dd>{bookingDetails.phone}</dd></div>
              {bookingDetails.notes && <div><dt>Notes</dt><dd>{bookingDetails.notes}</dd></div>}
            </dl>
            <div className="booking-contact-note">
              <MapPin size={17} />
              <p>Appointment times must be confirmed directly with the shop in Davao City.</p>
            </div>
            <div className="success-actions">
              <button className="button success-back" type="button" onClick={() => setStep('form')}>
                Edit details
              </button>
              <button className="button button-primary" type="button" disabled={isSubmitting} onClick={handleConfirmRequest}>
                {isSubmitting ? 'Submitting...' : 'Submit request'} <ArrowRight size={15} />
              </button>
            </div>
            {submissionError && <p className="modal-note modal-error" role="alert">{submissionError}</p>}
          </div>
        ) : (
          <>
            <div className="modal-kicker"><span className="eyebrow-dot" /> Step 1 of 2 · Your details</div>
            <h2 id="booking-title">Plan your next<br /><span>shop visit.</span></h2>
            <p className="modal-intro">
              Tell us about your car and preferred time. We&apos;ll help confirm the details.
            </p>
            <form className="booking-form" onSubmit={handleSubmit} noValidate>
              <label>
                Customer full name
                <input name="name" type="text" autoComplete="name" placeholder="e.g. Juan Dela Cruz" defaultValue={bookingDetails?.name ?? ''} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'booking-name-error' : undefined} required />
                {fieldErrors.name && <span id="booking-name-error" className="field-error">{fieldErrors.name}</span>}
              </label>
              <label>
                Contact mobile number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="09XX XXX XXXX"
                  pattern="09[0-9]{2} ?[0-9]{3} ?[0-9]{4}"
                  title="Use a Philippine mobile number like 0917 123 4567"
                  defaultValue={bookingDetails?.phone ?? ''}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={fieldErrors.phone ? 'booking-phone-error' : undefined}
                  required
                />
                {fieldErrors.phone && <span id="booking-phone-error" className="field-error">{fieldErrors.phone}</span>}
              </label>
              <label>
                Vehicle unit make &amp; model
                <input name="vehicle" type="text" placeholder="e.g. Toyota Vios 2022" defaultValue={bookingDetails?.vehicle ?? ''} aria-invalid={Boolean(fieldErrors.vehicle)} aria-describedby={fieldErrors.vehicle ? 'booking-vehicle-error' : undefined} required />
                {fieldErrors.vehicle && <span id="booking-vehicle-error" className="field-error">{fieldErrors.vehicle}</span>}
              </label>
              <label>
                Preferred service
                <select
                  value={service}
                  onChange={(event) => onServiceChange(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.service)}
                  aria-describedby={fieldErrors.service ? 'booking-service-error' : undefined}
                  required
                >
                  <option value="" disabled>Select a service</option>
                  {servicesData.map((item) => (
                    <option key={item.id} value={item.title}>{item.title}</option>
                  ))}
                </select>
                {fieldErrors.service && <span id="booking-service-error" className="field-error">{fieldErrors.service}</span>}
              </label>
              <label>
                Target appointment date &amp; time
                <input
                  name="appointment"
                  type="datetime-local"
                  min={minimumAppointment}
                  defaultValue={bookingDetails?.appointment ?? ''}
                  aria-invalid={Boolean(fieldErrors.appointment)}
                  aria-describedby={fieldErrors.appointment ? 'booking-appointment-error' : undefined}
                  required
                />
                <span className="field-hint">Mon-Sat, 8:00 AM-5:00 PM. Requested times require shop confirmation.</span>
                {fieldErrors.appointment && <span id="booking-appointment-error" className="field-error">{fieldErrors.appointment}</span>}
              </label>
              <label>
                Special notes or vehicle concerns <span className="optional-label">Optional</span>
                <textarea name="notes" rows="3" maxLength="1000" placeholder="Tell us about any details that can help us prepare." defaultValue={bookingDetails?.notes ?? ''} aria-invalid={Boolean(fieldErrors.notes)} aria-describedby={fieldErrors.notes ? 'booking-notes-error' : undefined} />
                {fieldErrors.notes && <span id="booking-notes-error" className="field-error">{fieldErrors.notes}</span>}
              </label>
              <button className="button button-primary modal-submit" type="submit">
                Review request <ArrowRight size={17} />
              </button>
            </form>
            <p className="modal-disclaimer">
              <Check size={14} /> We&apos;ll confirm your appointment directly with you.
            </p>
          </>
        )}
      </section>
    </div>
  )
}

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  service: PropTypes.string.isRequired,
  onServiceChange: PropTypes.func.isRequired,
}

export default BookingModal
