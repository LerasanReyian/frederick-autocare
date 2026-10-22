# Frederick Car Accessories

A responsive storefront and MySQL-backed inventory dashboard for Frederick Car Accessories in Davao City.

> “We make your car look and feel better!”

## Getting started

### Requirements

- Node.js 20.19+ and npm
- XAMPP with its MySQL/MariaDB module

### Configure XAMPP/MariaDB

This project connects to XAMPP's MariaDB server through the Express API. XAMPP
does not need to serve the React app. Only one database server can use a port
at a time, so stop the separate Windows `MySQL80` service before starting
XAMPP MySQL.

Start XAMPP's MySQL/MariaDB module and keep the connection settings in the
project's private `.env` file. Use [.env.example](./.env.example) as the
template; do not commit `.env` or share its values. The database schema and
sample inventory are in [database/schema.sql](./database/schema.sql).

To verify that the configured API can reach the database:

```powershell
Invoke-WebRequest http://127.0.0.1:3002/api/health
```

The response should contain `"status":"ok"` and `"database":"connected"`. The
`DB_PORT` in `.env` must match the MySQL port shown by XAMPP.

### Run the app

Start the API and Vite in separate PowerShell terminals from the project root:

```powershell
cd C:\Users\User\gihub-lerasan\sia\frederick-autocare
npm run server
```

```powershell
cd C:\Users\User\gihub-lerasan\sia\frederick-autocare
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).
Vite proxies `/api` requests to the local Express API on port `3002`.
For a separate frontend/API origin, set `VITE_API_BASE_URL` when building the frontend and set `CORS_ORIGIN` on the API to the exact frontend origin. Do not put database credentials in any `VITE_*` variable.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express inventory API |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Features

- Responsive public storefront with service search and category filters.
- Interactive car video scrubber with service hotspots and calibration controls.
- Multi-step service booking form with client-side validation, Davao timezone handling, review, confirmation, and database persistence.
- Staff inventory dashboard at `/inventory`, backed by XAMPP/MariaDB; includes role-based Admin and Employee access, product management, stock updates, filters, bulk actions, and CSV export.
- Booking requests enforce Monday-Saturday, 8:00 AM-5:00 PM availability, prevent duplicate pending/confirmed appointment times, validate approved services, and support staff refresh, status updates, and predefined responses.
- Appointment times are interpreted and displayed in the shop's Davao/Asia-Manila timezone.
- Admins can approve or reject employee access requests, while Employees can view bookings, update booking statuses, restock inventory, and export inventory reports.

## Routes

- `/` — Public storefront.
- `/inventory` — Inventory dashboard.

## Inventory API

The Express API exposes these endpoints under `/api`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check API/MySQL connectivity |
| `POST` | `/auth/login` | Sign in; the server determines the account role |
| `POST` | `/auth/register` | Submit an employee account request |
| `GET` | `/auth/me` | Restore the current staff session |
| `POST` | `/auth/logout` | End the current staff session |
| `GET` | `/auth/requests` | List pending requests for Admins |
| `POST` | `/auth/requests/:id/approve` | Approve an employee request |
| `POST` | `/auth/requests/:id/reject` | Reject an employee request |
| `POST` | `/bookings` | Submit a public booking request |
| `GET` | `/bookings` | List booking requests for Admins and Employees |
| `PUT` | `/bookings/:id/status` | Update a booking status with a predefined response |
| `GET` | `/products` | List inventory |
| `POST` | `/products` | Create a product |
| `PUT` | `/products/:id` | Update a product |
| `POST` | `/products/:id/restock` | Add stock (the UI uses 25 units) |
| `DELETE` | `/products/:id` | Delete one product |
| `POST` | `/products/bulk-delete` | Delete selected products |

## Inventory accounts

The API creates the initial local Admin and Employee accounts on first startup
if they do not already exist. Configure their values in `.env` before starting
the server. New users do not choose an account type during login. They submit
an employee account request from the **Request access** page, and an Admin
must approve it before the account is inserted into the active user table.

| Role | Default email | Default password | Permissions |
| --- | --- | --- | --- |
| Admin | `admin@frederickauto.local` | `admin123` | View, add, edit, restock, and delete products |
| Employee | `employee@frederickauto.local` | `employee123` | View, add, restock, export inventory, and manage bookings |

Change `ADMIN_PASSWORD` and `EMPLOYEE_PASSWORD` in `.env` before using the
portal beyond local testing. Passwords are stored as scrypt hashes, and the
browser receives an HTTP-only session cookie. The API protects every inventory
endpoint; the role-based UI restrictions are backed by server-side checks.

## Authentication and API access

This application does **not** currently use an API key. Inventory access uses
email/password login and an HTTP-only session cookie:

- `POST /api/auth/login` creates the session.
- `GET /api/auth/me` verifies the signed-in account.
- `POST /api/auth/logout` clears the session.

The browser sends the cookie automatically with inventory requests. Because it
is HTTP-only, frontend JavaScript cannot read its value; this is intentional
and safer than exposing a token to scripts.

To inspect the current authenticated request locally:

1. Sign in at `/inventory`.
2. Open browser Developer Tools and select **Network**.
3. Reload the inventory page.
4. Select the request to `/api/auth/me` or `/api/products`.
5. Check **Request Headers > Cookie** to confirm a session was sent.
6. Check the response from `/api/auth/me` for the current account and role.

Do not copy or share the cookie value. It authenticates the current browser
session. If an external service later requires an API key, store it in a
server-only environment variable and never expose it in `VITE_*` variables,
frontend source code, screenshots, or chat.

## Project structure

```text
frederick-autocare/
├── public/
│   ├── car-360.mp4
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── BookingModal.jsx
│   │   ├── CarVideoScrubber.jsx
│   │   ├── CarVisualizer.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── InventoryPortal.tsx
│   │   ├── ServiceCard.jsx
│   │   └── ServiceCatalog.jsx
│   ├── data/
│   │   └── servicesData.js
│   ├── hooks/
│   │   └── useBookingState.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── database/
│   └── schema.sql
├── server/
│   ├── db.js
│   └── index.js
├── .gitignore
├── .env.example
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

`dist/` is generated by `npm run build`, and `node_modules/` contains installed dependencies; neither is listed above.

## Database and security notes

- Inventory products are read from and written to the shared MySQL `inventory_products` table through the Express API. The SQL setup inserts the initial 12 catalog products once; running the script again does not overwrite existing product data.
- Existing inventory stored by older versions in this browser's local storage is not imported automatically. Review or export any legacy data before switching to MySQL.
- Video hotspot calibration remains saved in the current browser and is not shared between devices.
- Staff authentication uses database-backed accounts, scrypt password hashes, server-side sessions, HTTP-only cookies, and backend role authorization. The API binds to `127.0.0.1` by default; use HTTPS, a dedicated database user, and production secrets before exposing it beyond local development.
- Configure the database user with only the permissions the API needs. Store secrets in `.env` or your hosting provider's secret manager, never in frontend environment variables or source control.
- The public website catalog is not synchronized with inventory stock. Inventory availability in MySQL does not automatically update storefront services.
- Booking requests are submitted to the Express API and stored in MariaDB. Staff must review and update the booking status; the system does not automatically send customer SMS or email notifications.

## QA status

The latest local QA pass verified the critical public, staff, database, and
responsive workflows:

- Booking review, submission, persistence, business-hour validation, duplicate
  appointment prevention, service validation, and Asia/Manila display.
- Admin and Employee login, logout, account requests, Admin approval, session
  restoration, and role restrictions.
- Product creation, editing, deletion, restocking, duplicate SKU protection,
  filtered CSV export, selected CSV export, CSV escaping, and mobile export
  visibility.
- Booking listing, refresh, status updates, confirmation prompts,
  predefined responses, mobile layout, and form labels.
- ESLint, production build, Node syntax checks, live MariaDB integration, and
  cleanup of temporary QA records.

Formal cross-browser testing, screen-reader testing, production deployment
testing, concurrent staff edits, appointment-duration scheduling, and
automated customer email/SMS notifications remain outside this local QA pass.

## Shop contact

- **Address:** Door 5 #99 Cabaguio Avenue, Brgy. Gov Paciano Bangoy, Davao City
- **Proprietor:** Frederick Adorable
- **Phone:** 0966 307 2418 / 0927 796 1795
- **Email:** frederickcaraccessories@gmail.com
