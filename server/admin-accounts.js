import { randomUUID } from 'node:crypto'
import { newStaffId } from './staff-access.js'

export function installAdminAccounts(app, { pool, authenticated, requireRole, hashPassword }) {
  app.post('/api/auth/admins', authenticated, requireRole('admin'), async (request, response) => {
    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : ''
    const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
    const password = typeof request.body?.password === 'string' ? request.body.password : ''
    if (!name || name.length > 120 || email.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.trim().length < 12 || password.length > 200) {
      return response.status(400).json({ error: 'Enter a name, valid email, and password of 12–200 characters.' })
    }
    const [existing] = await pool.execute('SELECT id FROM inventory_users WHERE email=?', [email])
    if (existing.length) return response.status(409).json({ error: 'An account with that email already exists.' })
    const [pending] = await pool.execute("SELECT id FROM inventory_account_requests WHERE email=? AND status='pending'", [email])
    if (pending.length) return response.status(409).json({ error: 'That email has a pending employee request. Review the request or use another email.' })

    const passwordHash = hashPassword(password)
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const staffId = newStaffId('admin')
      try {
        // Role is fixed here; no client-supplied role or password hash is trusted.
        await pool.execute("INSERT INTO inventory_users (id,name,email,password_hash,role,staff_id) VALUES (?,?,?,?,'admin',?)", [randomUUID(), name, email, passwordHash, staffId])
        return response.status(201).json({ user: { name, email, role: 'admin', staffId } })
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') throw error
        // Handle concurrent creation by email; retry the very unlikely ID collision.
        const [duplicate] = await pool.execute('SELECT id FROM inventory_users WHERE email=?', [email])
        if (duplicate.length) return response.status(409).json({ error: 'An account with that email already exists.' })
      }
    }
    return response.status(503).json({ error: 'We could not assign a staff ID. Please try again.' })
  })
}
