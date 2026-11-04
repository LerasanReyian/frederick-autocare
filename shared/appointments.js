// Appointment wall times are always Asia/Manila, regardless of server timezone.
export function parseManilaAppointment(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return new Date(NaN)
  const date = new Date(`${value}:00+08:00`)
  if (!Number.isFinite(date.getTime())) return new Date(NaN)
  const roundTrip = new Date(date.getTime() + 8 * 3600000).toISOString().slice(0, 16)
  return roundTrip === value ? date : new Date(NaN)
}
export function appointmentError(value, now = new Date()) {
  const date = parseManilaAppointment(value)
  if (!Number.isFinite(date.getTime()) || date <= now) return 'Choose a valid future appointment time.'
  const wallTime = new Date(date.getTime() + 8 * 3600000)
  if (wallTime.getUTCDay() === 0 || wallTime.getUTCHours() < 8 || wallTime.getUTCHours() >= 17) {
    return 'Choose Monday to Saturday, between 8:00 AM and 5:00 PM (Philippine time).'
  }
  return ''
}
