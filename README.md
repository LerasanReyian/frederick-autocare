# Frederick Car Accessories

### Scroll-video smoothing — November 5, 2026

The landing film now follows scroll input with frame-rate-independent 85ms
easing and one video seek in flight at a time. It catches up to the latest
position, reverses on upward scroll, and stops seeking when settled. Reduced
motion uses direct positioning. The image fallback blends neighboring frames
and retains its bounded image cache and network-recovery behavior.

The current MP4 was re-encoded with a keyframe every three frames and no
B-frames to reduce random/reverse-seek decoding work. It is offered before the
existing WebM; duration, dimensions, footage and full background opacity are
preserved. MP4 size is approximately 3.36 MB (previously 2.34 MB).

Validation: lint, all three existing tests and production/PWA build passed.
Local Chrome checked desktop 1440×1000 and phone 390×844, normal/reduced motion,
forward/reverse rendered pixels, rapid direction changes, settled position,
idle seeks, and forced video-network failure with image fallback. No page
errors were recorded. Local scripts/report: `.qa/scroll-smooth-check.mjs` and
`.qa/scroll-smooth-report.json` (ignored). Changes were built locally; no remote
deployment was performed. Close existing site tabs and reopen to allow a
waiting PWA worker to activate.

Responsive storefront and staff inventory dashboard for a local car-accessories
shop.

## Overview

The application lets customers browse automotive services and submit appointment
requests. It also provides a staff-only inventory and booking dashboard with
separate Admin and Employee permissions.

The frontend is a React/Vite single-page application. The API is an
Express-compatible server running through a small NestJS adapter. The local
development database is MariaDB supplied by XAMPP.

## Contents

- [Screenshots and demo](#screenshots-and-demo)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [API overview](#api-overview)
- [Testing](#testing)
- [Project status and roadmap](#project-status-and-roadmap)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Team](#team)
- [Credits and acknowledgments](#credits-and-acknowledgments)
- [License](#license)

## Screenshots and demo

Screenshots are not currently stored in the repository.

To add them later, place these files in `docs/screenshots/`:

- `home.png` — public storefront
- `services.png` — service catalog
- `booking.png` — booking form
- `staff-login.png` — staff entry screen
- `inventory.png` — inventory dashboard

## Features

### Public storefront

| Feature | Status |
| --- | --- |
| Service catalog with category filters and search | Available |
| Scroll-controlled car film with MP4, WebM, poster, and WebP fallback | Available |
| Service detail and booking flow | Available |
| Appointment validation for Monday-Saturday, 08:00-17:00 Manila time | Available |
| Duplicate pending/confirmed appointment prevention | Available |
| Contact, shop information, and directions links | Available |
| Installable PWA shell | Available |
| Automatic customer email or SMS notifications | Planned |

### Staff portal

| Feature | Status |
| --- | --- |
| Staff ID verification before password sign-in | Available |
| Admin and Employee role authorization | Available |
| HTTP-only session cookies | Available |
| Product search, filtering, creation, editing, and deletion | Available |
| Product restocking and CSV export | Available |
| Booking review and status updates | Available |
| Employee account requests and Admin approval/rejection | Available |
| Automatic appointment-duration scheduling | Planned |

## Tech stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Runtime | Node.js | 20.19+ required by project docs | API, scripts, and tooling |
| Frontend | React | 19.2.8 | Storefront and staff portal UI |
| Frontend tooling | Vite | 8.3.0 | Development server and production build |
| API runtime | Express | 5.3.0 | HTTP routes and middleware |
| API adapter | NestJS | 11.2.8 | Runtime wrapper for the existing API |
| Database | MariaDB through XAMPP | 10.4.32 verified locally | Persistent bookings and inventory |
| Database driver | mysql2 | 3.24.6 | Promise-based MySQL/MariaDB pool |
| Styling | Tailwind CSS | 4.3.3 | Utility styling through the Vite plugin |
| Icons and graphics | lucide-react | 1.57.0 | UI icons |
| 3D/media dependencies | Three.js and React Three Fiber | 0.186.1 / 9.8.1 | Frontend visual dependencies |

Versions come from [package.json](package.json), except the Node.js
requirement in the existing project setup and the MariaDB version verified in
the local XAMPP instance.

## Architecture

The Vite development server serves the React application and proxies `/api`
requests to the local API. The API uses `mysql2/promise` to access MariaDB.
Production builds are served by the API server from `dist/`.

```text
Browser
  ├── Vite dev server :5173 ──┐
  │                           ├── /api ──> Express API :3002
  └── API-served production ──┘             │
                                           └── MariaDB/XAMPP :3307
```

| Module | Location | Responsibility |
| --- | --- | --- |
| Storefront entry | [src/App.jsx](src/App.jsx) | Public sections, dialogs, and staff entry |
| Service catalog | [src/components/ServiceCatalog.jsx](src/components/ServiceCatalog.jsx) | Searchable and filterable services |
| Booking form | [src/components/BookingModal.jsx](src/components/BookingModal.jsx) | Client-side booking submission |
| Inventory portal | [src/components/InventoryPortal.tsx](src/components/InventoryPortal.tsx) | Staff dashboard and inventory workflows |
| API routes | [server/index.js](server/index.js) | Health, booking, auth, inventory, and booking-status routes |
| Staff gate | [server/staff-access.js](server/staff-access.js) | Staff ID verification and entry proof |
| Database pool | [server/db.js](server/db.js) | MariaDB connection configuration |
| Database initializer | [server/initialize-db.js](server/initialize-db.js) | Creates missing database objects at API startup |
| Vercel adapter | [api/index.js](api/index.js) | Loads the API through NestJS for Vercel functions |
| PWA build | [scripts/build-pwa.js](scripts/build-pwa.js) | Generates the service worker and precache list |

## Project structure

```text
frederick-autocare/
├── api/                         # Vercel function entrypoint
│   └── index.js
├── database/                    # Canonical database schema and sample products
│   └── schema.sql
├── docs/                        # Maintainer and setup documentation
│   └── database.md
├── public/                      # Static media, manifest, and favicon
├── scripts/                     # Development and PWA build scripts
│   ├── build-pwa.js
│   ├── dev.js
│   └── service-worker.template.js
├── server/                     # Express-compatible API and database access
│   ├── db.js
│   ├── index.js
│   ├── initialize-db.js
│   ├── nest-app.module.js
│   ├── staff-access.js
│   └── start.js
├── shared/                     # Shared appointment validation
├── src/                        # React application
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── App.jsx
│   └── main.jsx
├── tests/                      # Node test runner tests
├── .env.example                # Local configuration template
├── eslint.config.js            # ESLint configuration
├── index.html                  # Vite HTML entry
├── package.json                # Scripts and dependencies
├── vercel.json                 # Vercel build and SPA routing configuration
└── vite.config.js              # Vite plugins and API proxy
```

Generated `dist/`, dependency folders, local database files, and QA browser
profiles are intentionally omitted.

## Getting started

### Prerequisites

- Node.js 20.19 or newer
- npm
- XAMPP with its MySQL/MariaDB module
- Windows local development uses the XAMPP client at
  `C:\xampp\mysql\bin\mysql.exe`

The verified local database is MariaDB 10.4.32 on port `3307`. See the detailed
[database setup guide](docs/database.md) for import, backup, and recovery steps.

### Installation and setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create the private environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Start MySQL in the XAMPP Control Panel. Stop another Windows MySQL service
   if it is already using the configured port.

4. Import the schema and sample inventory:

   ```powershell
   C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3307 -u root -p < database\schema.sql
   ```

5. Review `.env`, then start the application using one of the commands below.

On macOS/Linux, use `cp .env.example .env` and a compatible `mysql` client.
The repository does not define a platform-specific XAMPP command for those
systems.

### Run the application

For development, start the API and Vite in separate terminals:

```powershell
npm run server
```

```powershell
npm run dev
```

Open the Vite URL, normally `http://localhost:5173/`. Vite proxies `/api`
requests to `http://127.0.0.1:3002`.

To serve the production build locally:

```powershell
npm run build
npm start
```

Open `http://127.0.0.1:3002/`; the staff portal is at
`http://127.0.0.1:3002/inventory`.

## Configuration

Copy [.env.example](.env.example) to `.env`. The API requires `DB_HOST`,
`DB_USER`, and `DB_NAME`. Do not commit `.env` or put database credentials in
`VITE_*` variables.

| Setting | Default in `.env.example` | Meaning |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | MariaDB host |
| `DB_PORT` | `3307` | MariaDB port |
| `DB_USER` | `root` | Database user |
| `DB_PASSWORD` | empty | Local database password |
| `DB_NAME` | `frederick_autocare` | Database name |
| `DB_CONNECTION_LIMIT` | `10` | Connection pool limit |
| `DB_CONNECT_TIMEOUT` | `5000` | Connection timeout in milliseconds |
| `DB_SSL` | `false` | Enables TLS when `true` |
| `DB_SSL_CA` | empty | TLS CA certificate |
| `DB_SSL_CA_BASE64` | empty | Base64 TLS CA certificate |
| `DB_SSL_REJECT_UNAUTHORIZED` | `true` | Verifies the TLS certificate |
| `API_PORT` | `3002` | Local API port |
| `API_HOST` | `127.0.0.1` | Local API bind address |
| `CORS_ORIGIN` | empty | Comma-separated allowed origins |
| `ADMIN_EMAIL` | `admin@frederickauto.local` | Local Admin bootstrap email |
| `ADMIN_PASSWORD` | `admin123` | Local Admin bootstrap password |
| `EMPLOYEE_EMAIL` | `employee@frederickauto.local` | Local Employee bootstrap email |
| `EMPLOYEE_PASSWORD` | `employee123` | Local Employee bootstrap password |
| `SESSION_HOURS` | `8` | Session lifetime in hours |
| `VITE_API_BASE_URL` | empty | Optional separate API origin for frontend builds |

The default account values are for local development only. Replace the
passwords before exposing the API beyond a local machine.

## Usage

### Customer flow

1. Open the storefront.
2. Browse services or filter the catalog.
3. Select a service and open the booking form.
4. Enter customer, vehicle, date, time, and notes.
5. Submit the request and wait for staff confirmation.

### Staff flow

1. Open `/inventory`.
2. Enter an active Staff ID.
3. Sign in with the corresponding email and password.
4. Review bookings or manage inventory according to the account role.
5. Use the Admin account to approve employee access requests.

The local bootstrap accounts are defined by [.env.example](.env.example):

| Role | Email | Password | Main permissions |
| --- | --- | --- | --- |
| Admin | `admin@frederickauto.local` | `admin123` | Manage products and employee requests |
| Employee | `employee@frederickauto.local` | `employee123` | View/manage inventory and bookings |

The API assigns Staff IDs when accounts are initialized. Query the database
for the current IDs; do not assume an ID from another database instance.

## API overview

All endpoints are under `/api`.

### Public endpoints

| Method | URL | Who can call it | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Anyone | Check API and database connectivity |
| `POST` | `/api/bookings` | Anyone | Submit a booking request |
| `POST` | `/api/auth/entry` | Anyone | Verify an active Staff ID |
| `GET` | `/api/auth/entry` | Anyone with entry cookie | Check Staff ID verification |
| `DELETE` | `/api/auth/entry` | Anyone with entry cookie | Clear Staff ID verification |
| `POST` | `/api/auth/login` | Verified staff | Create a staff session |
| `POST` | `/api/auth/register` | Anyone | Submit an employee account request |

### Authenticated endpoints

| Method | URL | Who can call it | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/auth/me` | Signed-in staff | Restore the current session |
| `POST` | `/api/auth/logout` | Signed-in staff | End the current session |
| `GET` | `/api/products` | Signed-in staff | List inventory |
| `POST` | `/api/products` | Admin or Employee | Create a product |
| `PUT` | `/api/products/:id` | Admin | Edit a product |
| `POST` | `/api/products/:id/restock` | Admin or Employee | Add stock |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/products/bulk-delete` | Admin | Delete selected products |
| `GET` | `/api/bookings` | Admin or Employee | List booking requests |
| `PUT` | `/api/bookings/:id/status` | Admin or Employee | Update booking status |
| `GET` | `/api/auth/staff` | Admin | List staff accounts |
| `GET` | `/api/auth/requests` | Admin | List account requests |
| `POST` | `/api/auth/requests/:id/approve` | Admin | Approve an employee request |
| `POST` | `/api/auth/requests/:id/reject` | Admin | Reject an employee request |

There are no planned-but-unimplemented API routes documented in the source.

## Testing

Run the automated appointment tests:

```powershell
npm test
```

Run lint:

```powershell
npm run lint
```

Run the production build:

```powershell
npm run build
```

The tests cover Manila-time appointment hours, Sunday handling, invalid dates,
malformed input, and past appointments. The repository also contains QA
records in [QA_CHECKPOINT.md](QA_CHECKPOINT.md), but not a full automated
browser test suite.

## Project status and roadmap

### Available

- Public storefront and service catalog
- Scroll-driven car film with offline fallback assets
- Booking validation and persistence
- Staff ID gate, password login, sessions, and role authorization
- Inventory and booking operations
- PWA shell generation
- Local MariaDB setup and API health check

### Planned or outside the current automated scope

- Automated customer email or SMS notifications
- Appointment-duration scheduling
- Formal cross-browser and screen-reader testing
- Production deployment testing
- Concurrent staff-edit testing
- Full automated browser regression coverage

## Documentation

- [Database setup guide](docs/database.md)
- [System guide](README_SYSTEM_GUIDE.md)
- [QA checkpoint](QA_CHECKPOINT.md)
- [Mobile video handoff](MOBILE_VIDEO_HANDOFF.md)
- [JavaScript dependency assessment](.github/modernize/assessment/reports/report-20261104102419/js-assessment-report.md)

## Contributing

No repository-specific contribution or branch convention is documented.

Suggested workflow:

1. Create a focused branch.
2. Make a small, reviewable change.
3. Run `npm test`, `npm run lint`, and `npm run build`.
4. Commit with a short imperative message.
5. Open a pull request describing behavior and verification.

## Team

| Name | Role |
| --- | --- |
| TODO | Project owner |
| TODO | Maintainer |
| TODO | Contributor |

## Credits and acknowledgments

- React and React DOM provide the UI runtime.
- Vite and `@vitejs/plugin-react` provide development and production builds.
- Express and NestJS provide the API runtime and adapter.
- MariaDB/XAMPP and `mysql2` provide local persistence.
- Tailwind CSS, `lucide-react`, Three.js, React Three Fiber, and related
  frontend packages are listed in [package.json](package.json).
- The storefront uses local video and image assets in [public/](public/).

## License

License: to be decided. No `LICENSE` file is present in the repository.
