import test from 'node:test'
import assert from 'node:assert/strict'
import { appointmentError, parseManilaAppointment } from '../shared/appointments.js'
const now = new Date('2026-11-04T00:00:00Z')
test('Manila working hours include the last hour before closing', () => {
  for (const time of ['08:00', '16:00', '16:30', '16:59']) assert.equal(appointmentError(`2026-11-05T${time}`, now), '')
  for (const time of ['07:59', '17:00']) assert.match(appointmentError(`2026-11-05T${time}`, now), /Monday/)
})
test('Sunday is determined in Manila, independent of host timezone', () => {
  assert.match(appointmentError('2026-11-08T08:00', now), /Monday/)
  assert.equal(appointmentError('2026-11-09T08:00', now), '')
  assert.equal(parseManilaAppointment('2026-11-09T08:00').toISOString(), '2026-11-09T00:00:00.000Z')
})
test('Rejects rolled dates, malformed input and past appointments', () => {
  for (const value of ['2027-02-30T09:00','2026-13-01T09:00','2026-11-05T24:00','bad','',null,'2026-11-03T09:00']) assert.ok(appointmentError(value, now))
})
