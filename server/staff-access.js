import { randomBytes } from 'node:crypto'
export function newStaffId(role) { return `FA-${role === 'admin' ? 'A' : 'E'}-${randomBytes(4).toString('hex').toUpperCase()}` }
const entryCookie = 'frederick_staff_entry'
export function cookieValue(request, name) {
  const part = (request.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))
  try { return part ? decodeURIComponent(part.slice(name.length + 1)) : '' } catch { return '' }
}
export function entryCookieHeader(token, request, age = 600) {
  return `${entryCookie}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${request.secure ? '; Secure' : ''}`
}
export function installStaffAccess(app, pool) {
  const failures = new Map()
  async function findEntry(request) {
    const token = cookieValue(request, entryCookie)
    if (!/^[a-f0-9]{64}$/.test(token)) return null
    const [rows] = await pool.execute(`SELECT e.user_id AS id FROM inventory_entry_checks e JOIN inventory_users u ON u.id=e.user_id WHERE e.id=? AND e.expires_at>CURRENT_TIMESTAMP(6) AND u.active=1`, [token])
    return rows[0] || null
  }
  app.get('/api/auth/entry', async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    const entry = await findEntry(request)
    response.status(entry ? 200 : 401).json({ verified: Boolean(entry) })
  })
  app.post('/api/auth/entry', async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    const now = Date.now()
    for (const [key, value] of failures) if (value.until <= now) failures.delete(key)
    const key = request.ip
    const previous = failures.get(key)
    if (previous?.count >= 8) {
      response.setHeader('Retry-After', Math.max(1, Math.ceil((previous.until - now) / 1000)))
      return response.status(429).json({ error: 'Too many attempts. Please wait one minute and try again.' })
    }
    const staffId = typeof request.body?.staffId === 'string' ? request.body.staffId.trim().toUpperCase() : ''
    const [users] = await pool.execute('SELECT id FROM inventory_users WHERE staff_id=? AND active=1', [staffId.slice(0, 32)])
    if (!/^FA-[AE]-[A-F0-9]{8}$/.test(staffId) || !users.length) {
      failures.set(key, { count: (previous?.count || 0) + 1, until: previous?.until || now + 60000 })
      return response.status(403).json({ error: 'That staff ID could not be verified. Check your ID or contact the shop administrator.' })
    }
    failures.delete(key)
    await pool.execute('DELETE FROM inventory_entry_checks WHERE expires_at <= CURRENT_TIMESTAMP(6) OR id=?', [cookieValue(request, entryCookie)])
    const token = randomBytes(32).toString('hex')
    await pool.execute('INSERT INTO inventory_entry_checks (id,user_id,expires_at) VALUES (?,?,DATE_ADD(CURRENT_TIMESTAMP(6), INTERVAL 10 MINUTE))', [token, users[0].id])
    response.setHeader('Set-Cookie', entryCookieHeader(token, request))
    response.json({ verified: true })
  })
  app.delete('/api/auth/entry', async (request, response) => {
    await pool.execute('DELETE FROM inventory_entry_checks WHERE id=?', [cookieValue(request, entryCookie)])
    response.setHeader('Set-Cookie', entryCookieHeader('', request, 0))
    response.json({ verified: false })
  })
  return async function requireStaffEntry(request, response, next) {
    const entry = await findEntry(request)
    if (!entry) return response.status(403).json({ error: 'Verify your staff ID before signing in.', code: 'STAFF_ID_REQUIRED' })
    request.staffUserId = entry.id
    next()
  }
}
