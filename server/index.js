import "dotenv/config";
import express from "express";
import { Buffer } from "node:buffer";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { appointmentError, parseManilaAppointment } from "../shared/appointments.js";
import pool from "./db.js";
import { installStaffAccess, newStaffId, cookieValue, entryCookieHeader } from "./staff-access.js";
import { initializeDatabase, databaseStartupMessage } from "./initialize-db.js";

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 3002);
const host = process.env.API_HOST || "0.0.0.0";
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((origin) => origin.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use((request, response, next) => {
  const origin = request.get("Origin");
  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Credentials", "true");
  }
  if (request.method === "OPTIONS") return response.status(204).end();
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use("/api", (_request, response, next) => { response.setHeader("Cache-Control", "no-store"); next(); });

const sessionCookie = "frederick_inventory_session";
const sessionHours = Number(process.env.SESSION_HOURS || 8);
const defaultAccounts = [
  { id: "00000000-0000-4000-8000-000000000101", name: "Frederick Admin", email: process.env.ADMIN_EMAIL || "admin@frederickauto.local", password: process.env.ADMIN_PASSWORD || "admin123", role: "admin" },
  { id: "00000000-0000-4000-8000-000000000102", name: "Frederick Employee", email: process.env.EMPLOYEE_EMAIL || "employee@frederickauto.local", password: process.env.EMPLOYEE_PASSWORD || "employee123", role: "employee" },
];
const bookingMessages = {
  pending: ["We are reviewing your request and will contact you shortly."],
  confirmed: ["Your appointment request has been approved. We look forward to seeing you.", "Your appointment is confirmed. Please contact us if you need to make changes."],
  cancelled: ["We are sorry, but we cannot accommodate this requested time. Please contact us so we can find another schedule.", "We apologize for the inconvenience. The shop is unavailable at this time; please choose another appointment time.", "We are unable to accept this request because of a scheduling conflict. We hope to serve you on another date."],
  completed: ["Thank you for choosing Frederick Car Accessories."],
};
const approvedServices = new Set([
  "Car accessories", "Headlight cleaning", "Floor matting", "HID headlight",
  "Parts repair", "Seat cover", "Car carpet", "Glass tint", "Dash cam",
  "Stereo", "Horn", "Car alarm", "Body repair",
]);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [, salt, expectedHex] = String(storedHash).split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(actual, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

async function ensureAuthSchema() {
  await initializeDatabase();

  for (const account of defaultAccounts) {
    const [rows] = await pool.execute("SELECT id FROM inventory_users WHERE email = ?", [account.email]);
    if (rows.length === 0) {
      await pool.execute(
        "INSERT INTO inventory_users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
        [account.id, account.name, account.email, hashPassword(account.password), account.role],
      );
    }
  }
  const [staff] = await pool.query("SELECT id,role FROM inventory_users WHERE staff_id IS NULL");
  for (const user of staff) await pool.execute("UPDATE inventory_users SET staff_id=? WHERE id=? AND staff_id IS NULL", [newStaffId(user.role), user.id]);
}

function getSessionId(request) {
  return cookieValue(request, sessionCookie);
}

const authenticated = asyncRoute(async (request, response, next) => {
  const sessionId = getSessionId(request);
  if (!sessionId) return response.status(401).json({ error: "Please sign in to access inventory." });
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.role, u.staff_id AS staffId
     FROM inventory_sessions s
     JOIN inventory_users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > CURRENT_TIMESTAMP(6) AND u.active = 1`,
    [sessionId],
  );
  if (rows.length === 0) return response.status(401).json({ error: "Your session has expired. Please sign in again." });
  request.user = rows[0];
  next();
});

function requireRole(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) return response.status(403).json({ error: "Your account does not have permission for this action." });
    next();
  };
}

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function validateProduct(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Request body must be a product object." };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const stock = Number(body.stock);
  const threshold = Number(body.threshold);
  const price = Number(body.price);

  if (!name || name.length > 160) return { error: "Product name is required and must be 160 characters or fewer." };
  if (!sku || sku.length > 64) return { error: "SKU is required and must be 64 characters or fewer." };
  if (!category || category.length > 80) return { error: "Category is required and must be 80 characters or fewer." };
  if (!Number.isInteger(stock) || stock < 0 || stock > 2147483647) return { error: "Stock must be a non-negative whole number." };
  if (!Number.isInteger(threshold) || threshold < 0 || threshold > 2147483647) return { error: "Low-stock threshold must be a non-negative whole number." };
  if (!Number.isFinite(price) || price < 0 || price > 999999999999.99) return { error: "Price must be a non-negative amount." };

  const color = typeof body.color === "string" && /^bg-[a-z]+-\d{2,3} text-[a-z]+-\d{2,3}$/.test(body.color)
    ? body.color
    : "bg-violet-100 text-violet-700";

  return {
    product: {
      name,
      sku,
      category,
      stock,
      threshold,
      price: Math.round(price * 100) / 100,
      color,
      symbol: Array.from(name)[0].toUpperCase(),
    },
  };
}

app.get("/api/health", asyncRoute(async (_request, response) => {
  await pool.query("SELECT 1");
  response.json({ status: "ok", database: "connected" });
}));

app.post("/api/bookings", asyncRoute(async (request, response) => {
  const customerName = typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const phone = typeof request.body?.phone === "string" ? request.body.phone.trim() : "";
  const vehicle = typeof request.body?.vehicle === "string" ? request.body.vehicle.trim() : "";
  const service = typeof request.body?.service === "string" ? request.body.service.trim() : "";
  const appointment = typeof request.body?.appointment === "string" ? request.body.appointment : "";
  const notes = typeof request.body?.notes === "string" ? request.body.notes.trim() : "";
  const scheduleError = appointmentError(appointment);
  if (scheduleError) return response.status(400).json({ error: scheduleError });
  const appointmentDate = parseManilaAppointment(appointment);
  if (!customerName || customerName.length > 120 || !/^09\d{2} ?\d{3} ?\d{4}$/.test(phone) || !vehicle || vehicle.length > 160 || !approvedServices.has(service) || notes.length > 1000) {
    return response.status(400).json({ error: "Enter valid customer, contact, vehicle, service, and future appointment details." });
  }
  const connection = await pool.getConnection();
  const lockName = `frederick-booking:${appointment}`;
  let locked = false;
  try {
    const [[lock]] = await connection.execute('SELECT GET_LOCK(?, 5) AS acquired', [lockName]);
    locked = lock.acquired === 1;
    if (!locked) return response.status(503).json({ error: 'Booking is busy. Please try again.' });
    const [conflicts] = await connection.execute("SELECT id FROM booking_requests WHERE appointment_at = ? AND status IN ('pending', 'confirmed') LIMIT 1", [appointmentDate]);
    if (conflicts.length > 0) return response.status(409).json({ error: "That appointment time is already requested. Please choose another time." });
    const id = randomUUID();
    await connection.execute(
      "INSERT INTO booking_requests (id, customer_name, phone, vehicle, service, appointment_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, customerName, phone, vehicle, service, appointmentDate, notes || null],
    );
    response.status(201).json({ id, status: "pending" });
  } finally {
    try { if (locked) await connection.execute('SELECT RELEASE_LOCK(?)', [lockName]); }
    finally { connection.release(); }
  }
}));

const requireStaffEntry = installStaffAccess(app, pool);

app.post("/api/auth/login", requireStaffEntry, asyncRoute(async (request, response) => {
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!email || !password) {
    return response.status(400).json({ error: "Enter your email and password." });
  }
  const [rows] = await pool.execute("SELECT id, name, email, password_hash, role, staff_id AS staffId FROM inventory_users WHERE email = ? AND active = 1", [email]);
  const user = rows[0];
  if (!user || user.id !== request.staffUserId || !verifyPassword(password, user.password_hash)) {
    return response.status(401).json({ error: "Invalid email or password." });
  }
  const sessionId = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + sessionHours * 60 * 60 * 1000);
  await pool.execute("INSERT INTO inventory_sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [sessionId, user.id, expiresAt]);
  await pool.execute("DELETE FROM inventory_entry_checks WHERE id=?", [cookieValue(request, 'frederick_staff_entry')]);
  response.setHeader("Set-Cookie", [`${sessionCookie}=${encodeURIComponent(sessionId)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(sessionHours * 3600)}${request.secure ? '; Secure' : ''}`, entryCookieHeader('', request, 0)]);
  response.json({ user: { name: user.name, email: user.email, role: user.role, staffId: user.staffId } });
}));

app.post("/api/auth/register", asyncRoute(async (request, response) => {
  const name = typeof request.body?.name === "string" ? request.body.name.trim() : "";
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200) {
    return response.status(400).json({ error: "Enter a valid name, email, and password of at least 8 characters." });
  }
  const [existingUser] = await pool.execute("SELECT id FROM inventory_users WHERE email = ?", [email]);
  if (existingUser.length > 0) return response.status(409).json({ error: "An account with this email already exists." });
  const [existingRequest] = await pool.execute("SELECT id, status FROM inventory_account_requests WHERE email = ?", [email]);
  if (existingRequest.length > 0) {
    return response.status(409).json({ error: existingRequest[0].status === "pending" ? "An account request is already awaiting Admin approval." : "This email already has a reviewed account request." });
  }
  await pool.execute(
    "INSERT INTO inventory_account_requests (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
    [randomUUID(), name, email, hashPassword(password)],
  );
  response.status(202).json({ message: "Account request submitted. An Admin must approve it before you can sign in." });
}));

app.get('/api/auth/staff', authenticated, requireRole('admin'), asyncRoute(async (_request, response) => {
  const [staff] = await pool.query("SELECT name,email,role,staff_id AS staffId FROM inventory_users WHERE active=1 ORDER BY role,name");
  response.setHeader('Cache-Control', 'no-store');
  response.json(staff);
}));

app.get("/api/auth/requests", authenticated, requireRole("admin"), asyncRoute(async (_request, response) => {
  const [rows] = await pool.query("SELECT id, name, email, requested_role AS role, status, created_at FROM inventory_account_requests WHERE status = 'pending' ORDER BY created_at ASC");
  response.json(rows);
}));

app.get("/api/bookings", authenticated, requireRole("admin", "employee"), asyncRoute(async (_request, response) => {
  const [rows] = await pool.query(
    "SELECT id, customer_name AS customerName, phone, vehicle, service, appointment_at AS appointment, notes, response_message AS responseMessage, status, created_at AS createdAt FROM booking_requests ORDER BY appointment_at ASC, created_at DESC",
  );
  response.json(rows);
}));

app.put("/api/bookings/:id/status", authenticated, requireRole("admin", "employee"), asyncRoute(async (request, response) => {
  const status = request.body?.status;
  const responseMessage = typeof request.body?.responseMessage === "string" ? request.body.responseMessage.trim() : "";
  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return response.status(400).json({ error: "Invalid booking status." });
  }
  if (responseMessage.length > 500 || !bookingMessages[status].includes(responseMessage)) {
    return response.status(400).json({ error: "Choose one of the predefined messages for this booking status." });
  }
  const [result] = await pool.execute(
    "UPDATE booking_requests SET status = ?, response_message = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP(6) WHERE id = ?",
    [status, responseMessage || null, request.user.id, request.params.id],
  );
  if (result.affectedRows === 0) return response.status(404).json({ error: "Booking request not found." });
  response.json({ updated: true });
}));

app.post("/api/auth/requests/:id/approve", authenticated, requireRole("admin"), asyncRoute(async (request, response) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [requests] = await connection.execute("SELECT * FROM inventory_account_requests WHERE id = ? AND status = 'pending' FOR UPDATE", [request.params.id]);
    if (requests.length === 0) return response.status(404).json({ error: "Pending account request not found." });
    const accountRequest = requests[0];
    await connection.execute("INSERT INTO inventory_users (id, name, email, password_hash, role, staff_id) VALUES (?, ?, ?, ?, 'employee', ?)", [accountRequest.id, accountRequest.name, accountRequest.email, accountRequest.password_hash, newStaffId("employee")]);
    await connection.execute("UPDATE inventory_account_requests SET status = 'approved', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP(6) WHERE id = ?", [request.user.id, accountRequest.id]);
    await connection.commit();
    response.json({ approved: true });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.post("/api/auth/requests/:id/reject", authenticated, requireRole("admin"), asyncRoute(async (request, response) => {
  const [result] = await pool.execute("UPDATE inventory_account_requests SET status = 'rejected', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP(6) WHERE id = ? AND status = 'pending'", [request.user.id, request.params.id]);
  if (result.affectedRows === 0) return response.status(404).json({ error: "Pending account request not found." });
  response.json({ rejected: true });
}));

app.get("/api/auth/me", authenticated, (request, response) => {
  response.json({ user: request.user });
});

app.post("/api/auth/logout", asyncRoute(async (request, response) => {
  const sessionId = getSessionId(request);
  if (sessionId) await pool.execute("DELETE FROM inventory_sessions WHERE id = ?", [sessionId]);
  response.setHeader("Set-Cookie", `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  response.json({ signedOut: true });
}));

app.get("/api/products", authenticated, asyncRoute(async (_request, response) => {
  const [rows] = await pool.query(
    "SELECT id, name, category, sku, stock, threshold, price, color, symbol FROM inventory_products ORDER BY created_at DESC, id ASC",
  );
  response.json(rows);
}));

app.post("/api/products", authenticated, requireRole("admin", "employee"), asyncRoute(async (request, response) => {
  const result = validateProduct(request.body);
  if (result.error) return response.status(400).json({ error: result.error });

  const product = { id: randomUUID(), ...result.product };
  await pool.execute(
    `INSERT INTO inventory_products (id, name, category, sku, stock, threshold, price, color, symbol)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [product.id, product.name, product.category, product.sku, product.stock, product.threshold, product.price, product.color, product.symbol],
  );
  response.status(201).json(product);
}));

app.put("/api/products/:id", authenticated, requireRole("admin"), asyncRoute(async (request, response) => {
  const result = validateProduct(request.body);
  if (result.error) return response.status(400).json({ error: result.error });
  const product = result.product;
  await pool.execute(
    `UPDATE inventory_products
     SET name = ?, category = ?, sku = ?, stock = ?, threshold = ?, price = ?, color = ?, symbol = ?
     WHERE id = ?`,
    [product.name, product.category, product.sku, product.stock, product.threshold, product.price, product.color, product.symbol, request.params.id],
  );
  const [rows] = await pool.execute(
    "SELECT id, name, category, sku, stock, threshold, price, color, symbol FROM inventory_products WHERE id = ?",
    [request.params.id],
  );
  if (rows.length === 0) return response.status(404).json({ error: "Product not found." });
  response.json(rows[0]);
}));

app.post("/api/products/:id/restock", authenticated, requireRole("admin", "employee"), asyncRoute(async (request, response) => {
  const quantity = request.body?.quantity === undefined ? 25 : Number(request.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000000) {
    return response.status(400).json({ error: "Restock quantity must be a whole number between 1 and 1,000,000." });
  }

  const [writeResult] = await pool.execute(
    "UPDATE inventory_products SET stock = stock + ? WHERE id = ? AND stock <= ?",
    [quantity, request.params.id, 2147483647 - quantity],
  );
  if (writeResult.affectedRows === 0) {
    const [rows] = await pool.execute("SELECT id FROM inventory_products WHERE id = ?", [request.params.id]);
    if (rows.length === 0) return response.status(404).json({ error: "Product not found." });
    return response.status(409).json({ error: "Restock would exceed the maximum stock quantity." });
  }
  const [rows] = await pool.execute(
    "SELECT id, name, category, sku, stock, threshold, price, color, symbol FROM inventory_products WHERE id = ?",
    [request.params.id],
  );
  response.json(rows[0]);
}));

app.delete("/api/products/:id", authenticated, requireRole("admin"), asyncRoute(async (request, response) => {
  const [writeResult] = await pool.execute("DELETE FROM inventory_products WHERE id = ?", [request.params.id]);
  if (writeResult.affectedRows === 0) return response.status(404).json({ error: "Product not found." });
  response.json({ deleted: 1 });
}));

app.post("/api/products/bulk-delete", authenticated, requireRole("admin"), asyncRoute(async (request, response) => {
  const ids = request.body?.ids;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500 || ids.some((id) => typeof id !== "string" || id.length > 36)) {
    return response.status(400).json({ error: "Provide between 1 and 500 valid product IDs." });
  }

  const uniqueIds = [...new Set(ids)];
  const placeholders = uniqueIds.map(() => "?").join(", ");
  const [writeResult] = await pool.execute(
    `DELETE FROM inventory_products WHERE id IN (${placeholders})`,
    uniqueIds,
  );
  response.json({ deleted: writeResult.affectedRows });
}));

app.use('/api', (_request, response) => response.status(404).json({ error: 'API route not found.' }));
// The built PWA and API share an origin, including staff-session cookies.
const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
app.use(express.static(distDirectory, {
  setHeaders(response, path) {
    if (path.endsWith('sw.js') || path.endsWith('index.html')) response.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get(['/', '/inventory'], (_request, response) => response.sendFile(`${distDirectory}/index.html`));

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error?.code === "ER_DUP_ENTRY") {
    const requestPath = _request.path;
    if (requestPath.startsWith("/products")) {
      return response.status(409).json({ error: "That SKU is already in use. Enter a unique SKU." });
    }
    if (requestPath.startsWith("/auth/requests")) {
      return response.status(409).json({ error: "An account request already exists for that email." });
    }
    return response.status(409).json({ error: "That record already exists. Review the details and try again." });
  }
  if (error?.type === "entity.parse.failed") {
    return response.status(400).json({ error: "Request body must contain valid JSON." });
  }

  console.error("Inventory API request failed.", error);
  response.status(500).json({ error: "The inventory service could not complete the request." });
});

export const ready = ensureAuthSchema();

let server;
if (!process.env.VERCEL) {
  ready.then(() => {
    server = app.listen(port, host, () => {
      console.log(`Frederick Auto inventory API listening at http://${host}:${port}.`);
    });
  }).catch(async (error) => {
    console.error(databaseStartupMessage(error));
    await pool.end();
    process.exitCode = 1;
  });
}

async function shutdown(signal) {
  console.log(`${signal} received; closing inventory API.`);
  if (!server) return pool.end();
  server.close(async (serverError) => {
    if (serverError) console.error("Unable to close the API server cleanly.", serverError);
    try {
      await pool.end();
      process.exit(serverError ? 1 : 0);
    } catch (error) {
      console.error("Unable to close MySQL connections cleanly.", error);
      process.exit(1);
    }
  });
}

if (!process.env.VERCEL) {
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

export default app;
