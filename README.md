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
- The storefront uses a full-opacity, scroll-controlled background film. Previous hotspot components remain in source but are no longer mounted.
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

## Recovered database on this computer

The repaired installation uses .local-db-restored/ on localhost port 3308. XAMPP currently occupies port 3307; its Frederick tables are unreadable (InnoDB error 1932), so they are left untouched. A pre-start backup is preserved in .local-db-backup-20261104/. The private .env enables LOCAL_DB_AUTOSTART=true, so npm run server starts this database when needed. XAMPP MySQL is not required for this installation. The local database continues running when the API stops. Keep .local-db-restored/ in your backups; it is excluded from Git. This setup uses the MariaDB executable in C:/xampp/mysql/bin and leaves the original XAMPP data directory unchanged. To return to a repaired XAMPP instance later, disable LOCAL_DB_AUTOSTART and update DB_PORT in .env.



## November 2026 storefront and PWA update

- Rebuilt the public storefront around the supplied car-reveal video, retaining crimson/navy branding, all 13 services, contact details, booking flow, and the staff portal.
- `public/drive-reveal.mp4` is a silent, frequent-keyframe version of the supplied clip, trimmed by 2.65 seconds to start as the car appears. The 5.25-second film stays at full opacity without a filter or dimming layer. The first 70% of a viewport of scroll drives 38% of the clip; the remaining scroll drives the camera orbit. Reverse scroll reverses the film. There is no playback/progress bar. Direct user-driven scroll seeking works with reduced-motion preferences too; decorative CSS transitions remain disabled in that mode.
- Production PWA: manifest, 192/512px icons, install control, offline shell and poster. Bookings and staff API responses are never cached or queued. Offline visitors can read the shop guide; submissions and staff access need a connection. New worker versions activate when older tabs close.
- `npm run build` builds the frontend and generates the versioned service worker. `npm start` starts the API and serves the built site at **http://127.0.0.1:3002/**. The staff portal is **http://127.0.0.1:3002/inventory**. After source edits, rebuild before using this URL.
- `npm run dev:all` starts both the backend and Vite for editing at **http://127.0.0.1:5173/**. Do not start a second backend if one is already running. Service workers register only in production builds.
- Installation works on localhost or an HTTPS deployment. For remote hosting, configure HTTPS and database credentials; this task did not deploy the project publicly.
- `npm test` verifies Philippine-time appointment validation, including late-afternoon times, Sundays, invalid calendar dates, and past times. API booking creation serializes requests for the same time to prevent concurrent duplicate slots.
- Verified locally in Chrome: desktop and 390px mobile layout, forward/reverse scrubbing, filters/search, booking selection, reduced-motion mode, offline reload, and no cached private API data. Chrome PWA installability returned no errors in a normal test profile. Full browser booking submission and staff sign-in/session restoration also passed. Backend verification covered recovered data (12 products, 3 bookings), authenticated inventory operations, appointment persistence, and concurrent conflict rejection; temporary test data was removed.


### Visual refinement — November 4

The storefront now uses translucent dark panels (48% background opacity on desktop, 42% on mobile), an outlined Frederick wordmark, condensed automotive typography, and an open reveal section. Video pixels remain unfiltered outside the small content surfaces. Service collections display four cards on desktop and two on mobile, with all 13 services reachable through pagination, filters, and search. Booking dialogs remain opaque for readable forms. The design takes visual direction from the user-supplied MotionSites Roadster 3D reference, using the user's own video and shop identity.

Validation: production build; forward/reverse seeking; immediate short-scroll reveal; no controller or duration UI; all service pages; filter/search and selected-service booking; 320/390/768px layouts; reduced motion; offline shell and current poster. Source changes are built and available at http://127.0.0.1:3002/.


### Scroll-video compatibility repair

The player now offers WebM/VP9 plus MP4/H.264. It retries seeking on loaded-data/can-play events and switches to 126 extracted WebP frames if codecs are unavailable or the decoder stalls. The fallback uses the same trimmed footage and scroll mapping, bounds decoded-image memory, and preserves the poster offline. No playback controls or progress strip are added.

Browser regression checks verified actual decoded pixels advancing and reversing in both normal and reduced-motion settings, plus forward/reverse animation with both video-format requests deliberately blocked. The active in-app viewer could not be inspected directly because its browser-control tool failed to start; compatibility was verified in local Chrome with the above failure modes simulated. Refresh an existing preview after rebuilding to load the new fingerprinted client code.


## Staff ID entry and QA update

Staff login now requires a database-backed ID check before password sign-in. Each active account has a unique `staff_id`; administrators can view team IDs under **Account requests**. The server binds a ten-minute HttpOnly entry proof to the selected staff account and rejects login without it. Newly approved employees receive an ID automatically. Customer booking stays public.

The supplied `a.mp4` is used for the staff video hero, with WebM and MP4 versions. Public dialogs blur the background and prevent background interaction; fonts and touch targets are larger. See `QA_CHECKPOINT.md` for tested flows and remaining QA scope.

phpMyAdmin opens the recovered database on port 3308; its optional invalid pma control-user configuration has been disabled. Start the project with `npm start` before opening phpMyAdmin if the recovered database is stopped. Original XAMPP database files were not dropped or replaced.
