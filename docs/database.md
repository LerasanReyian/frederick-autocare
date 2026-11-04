# Database setup guide

## 1. Overview

This project uses MariaDB through XAMPP. The verified local server is MariaDB
10.4.32 on `127.0.0.1:3307`, and the database name is
`frederick_autocare`. The Node.js driver is `mysql2` 3.24.6. The canonical
script is [database/schema.sql](../database/schema.sql); it creates the
database, six tables, constraints, indexes, and 12 sample inventory products.

## 2. Requirements 

1. Install XAMPP with its MySQL/MariaDB module.
2. Use a MariaDB server compatible with the SQL in
   [database/schema.sql](../database/schema.sql). The repository's verified
   local version is MariaDB 10.4.32.
3. Install Node.js 20.19 or newer and npm.
4. Optionally use the phpMyAdmin bundled with XAMPP or the XAMPP MariaDB
   command-line client.

The repository does not pin a separate MariaDB version for all environments.
Use MariaDB 10.4.32 for the same version as the verified local setup.

## 3. Start the database server

### Windows with XAMPP

1. Open **XAMPP Control Panel**.
2. If a separate Windows `MySQL80` service is running, stop it. Only one
   database server can use the configured port.
3. Start the **MySQL** module in XAMPP.
4. Confirm the module shows **Running**.
5. Confirm that XAMPP's MySQL port is `3307`. If it shows another port, use
   that port in `.env` and every command below.

Check the running server with the XAMPP client:

```powershell
C:\xampp\mysql\bin\mysql.exe --connect-timeout=5 -h 127.0.0.1 -P 3307 -u root -e "SELECT VERSION();"
```

The verified local result is `10.4.32-MariaDB`.

### macOS or Linux

The repository documents XAMPP on Windows only. A macOS or Linux service may
work if it provides a compatible MariaDB server, but its service command and
client path are not defined in this repository.

TODO: Verify the supported macOS/Linux server startup command and client path
if this project will be developed on those platforms.

## 4. Create the database and load the data

The script uses `CREATE DATABASE IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`,
and `INSERT IGNORE`. It does not contain `DROP DATABASE`, `DROP TABLE`, or
`TRUNCATE`. Running it again does not delete existing data or overwrite the
sample products with the same IDs. It is safe to re-run for normal setup.

The application also initializes missing database objects at startup through
[server/initialize-db.js](../server/initialize-db.js). That startup path
creates a missing database and missing tables, but it deliberately imports
only `CREATE TABLE` statements. It does not insert the 12 sample products.
Run the full SQL script manually when sample inventory is required.

### Method A: XAMPP phpMyAdmin

1. Start MySQL in XAMPP.
2. Open **phpMyAdmin** from the XAMPP Control Panel.
3. Make sure phpMyAdmin is connected to port `3307`, not another local MySQL
   instance.
4. Open the **Import** tab.
5. Choose [database/schema.sql](../database/schema.sql).
6. Keep the SQL format selected.
7. Click **Import** or **Go**.
8. Open the `frederick_autocare` database and confirm that the six tables are
   listed.

The exact phpMyAdmin version and its installed menu labels are not committed
in this repository.

### Method B: XAMPP command line

From the repository root in PowerShell:

```powershell
C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3307 -u root -p < database\schema.sql
```

When the local XAMPP root password is blank, press **Enter** at the password
prompt. This blank password is for the verified local development setup only.
Do not use it for a shared or production server.

On macOS or Linux, use the `mysql` client only if it is installed and points
to a compatible MariaDB server:

```bash
mysql -h 127.0.0.1 -P 3307 -u root -p < database/schema.sql
```

## 5. Connect the application

1. Copy [.env.example](../.env.example) to a private `.env` file.
2. Set the database values in `.env`.
3. Do not commit `.env`; it is ignored by the repository.

The verified local settings are:

| Setting | Default | Purpose |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | MariaDB host |
| `DB_PORT` | `3307` | MariaDB port |
| `DB_USER` | `root` | Database user |
| `DB_PASSWORD` | empty | Local XAMPP password |
| `DB_NAME` | `frederick_autocare` | Database name |
| `DB_CONNECTION_LIMIT` | `10` | MySQL pool size |
| `DB_CONNECT_TIMEOUT` | `5000` | Connection timeout in milliseconds |
| `DB_SSL` | `false` | TLS switch |
| `DB_SSL_CA` | empty | TLS CA certificate |
| `DB_SSL_CA_BASE64` | empty | Base64 TLS CA certificate |
| `DB_SSL_REJECT_UNAUTHORIZED` | `true` | TLS certificate verification |

The pool sets the database session timezone to `+08:00` in
[server/db.js](../server/db.js). Keep the host, port, user, password, and
database name consistent with the server shown in XAMPP. A port mismatch can
produce connection-refused errors or connect to a different database server.

Start the API after configuring `.env`:

```powershell
npm run server
```

The API listens on port `3002` by default. The API's database initialization
and default account creation are implemented in
[server/index.js](../server/index.js).

## 6. Verify it worked

Run these checks against a fresh database after importing the script:

```sql
SELECT VERSION();
SHOW TABLES;
SELECT COUNT(*) AS product_count FROM inventory_products;
SELECT name, sku, stock FROM inventory_products
WHERE sku IN ('LGT-HID-6000K', 'CARE-BDY-500')
ORDER BY sku;
SELECT COUNT(*) AS user_count FROM inventory_users;
```

Expected results from the script and application:

1. `VERSION()` reports MariaDB; the verified local result is
   `10.4.32-MariaDB`.
2. `SHOW TABLES` lists six tables:
   `booking_requests`, `inventory_account_requests`,
   `inventory_entry_checks`, `inventory_products`, `inventory_sessions`, and
   `inventory_users`.
3. A fresh script import contains `12` inventory products.
4. The two selected products are `Body Repair Compound` with SKU
   `CARE-BDY-500` and stock `0`, and `HID Headlight Kit` with SKU
   `LGT-HID-6000K` and stock `24`.
5. `inventory_users` is empty after SQL import alone. When the API starts, it
   creates the local Admin and Employee accounts if their email addresses do
   not already exist.

Check the API as well:

```powershell
Invoke-WebRequest http://127.0.0.1:3002/api/health
```

The response should contain:

```json
{"status":"ok","database":"connected"}
```

To look up the generated staff IDs without displaying password hashes:

```sql
SELECT name, email, role, staff_id, active
FROM inventory_users
ORDER BY role, email;
```

## 7. Schema overview

| Table | Purpose | Key columns and relationships |
| --- | --- | --- |
| `inventory_users` | Admin and Employee accounts | `id` primary key; unique `staff_id` and `email`; `role` is `admin` or `employee` |
| `inventory_sessions` | Server-side login sessions | `id` primary key; `user_id` references `inventory_users(id)` with `ON DELETE CASCADE` |
| `inventory_account_requests` | Employee access requests | `id` primary key; unique `email`; `reviewed_by` references `inventory_users(id)` with `ON DELETE SET NULL` |
| `booking_requests` | Public service bookings | `id` primary key; `reviewed_by` references `inventory_users(id)` with `ON DELETE SET NULL` |
| `inventory_products` | Inventory catalog and stock | `id` primary key; unique `sku`; indexes on `category` and `stock` |
| `inventory_entry_checks` | Short-lived staff-ID entry proofs | `id` primary key; `user_id` references `inventory_users(id)` with `ON DELETE CASCADE` |

Important database rules:

- All tables use InnoDB.
- The database and schema use `utf8mb4` and `utf8mb4_unicode_ci`.
- User emails, staff IDs, product SKUs, and account-request emails are unique.
- Roles and statuses use fixed `ENUM` values from the SQL script.
- Product `stock` and `threshold` are unsigned integers.
- Product `price` is an unsigned `DECIMAL(14, 2)`.
- Foreign keys cascade session and entry-proof deletion when a user is deleted.
- Reviewer references become `NULL` when the reviewer is deleted.
- The script defines no views, generated columns, or calculated columns.

No ERD or schema diagram is present in the repository.

## 8. Sample data

The SQL script inserts 12 inventory products with fixed IDs, categories, SKUs,
stock values, thresholds, prices, colors, and symbols. It does not insert
users, bookings, sessions, account requests, or entry checks.

The API creates these two local demo accounts at first startup when their
emails are absent:

| Account | Email | Role | Default password | Purpose |
| --- | --- | --- | --- | --- |
| Frederick Admin | `admin@frederickauto.local` | `admin` | `admin123` | Local administrator workflow |
| Frederick Employee | `employee@frederickauto.local` | `employee` | `employee123` | Local employee workflow |

These passwords are committed local-development defaults from
[.env.example](../.env.example) and [server/index.js](../server/index.js).
Change them before using the application beyond local testing. Passwords are
stored as scrypt hashes, not as plain text.

## 9. Reset and backup

### Reset to a clean database

The normal schema script is non-destructive. To reset all local data, first
stop the API, then deliberately drop the database and import the script again:

```powershell
C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3307 -u root -p -e "DROP DATABASE IF EXISTS frederick_autocare;"
C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3307 -u root -p < database\schema.sql
```

The first command deletes accounts, bookings, sessions, requests, products,
and staff-entry proofs. Confirm the database name and server before running it.

### Back up

Create a logical dump outside the repository:

```powershell
C:\xampp\mysql\bin\mysqldump.exe -h 127.0.0.1 -P 3307 -u root -p --routines --triggers frederick_autocare > C:\Temp\frederick_autocare.sql
```

### Restore

Restore into an existing database:

```powershell
C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3307 -u root -p frederick_autocare < C:\Temp\frederick_autocare.sql
```

Keep dumps out of Git and do not paste passwords into commands that may be
saved in shell history.

### Change the schema safely

1. Back up the database.
2. Test the change against a temporary database.
3. Prefer additive, backward-compatible changes.
4. Update [database/schema.sql](../database/schema.sql).
5. Update [server/initialize-db.js](../server/initialize-db.js) if the API
   must initialize or migrate the change automatically.
6. Run the application checks before using the change on the working database.

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Connection refused | XAMPP MySQL is stopped, or `DB_PORT` does not match the XAMPP port | Start MySQL in XAMPP and make `DB_HOST`/`DB_PORT` match the running server |
| Access denied for `root` | The local password is not blank, or the wrong server is selected | Use the configured password with `-p`; confirm the XAMPP server and port |
| Unknown database `frederick_autocare` | The schema has not been imported, or `.env` points to another name | Import [database/schema.sql](../database/schema.sql) or correct `DB_NAME` |
| Port already in use | Another Windows `MySQL80` service or MySQL/MariaDB instance is using the port | Stop the competing service or change the XAMPP port and `.env` together |
| Wrong timezone or appointment times | The API pool uses `+08:00`, while a different server or client uses another timezone | Keep the API connected to the intended server and use the configured `+08:00` session timezone |
| `#1932` or `ER_NO_SUCH_TABLE_IN_ENGINE` | Stale or inconsistent InnoDB table metadata | Do not copy `.ibd` files or drop files blindly; preserve a backup and repair through a logical SQL export/import |
| SQL syntax error on an older server | The server is not compatible with the MariaDB/MySQL syntax used by the script | Use the verified MariaDB 10.4.32 setup and inspect the first failing statement |
| Character or emoji corruption | The connection or database is not using the script's `utf8mb4` settings | Recreate/import using [database/schema.sql](../database/schema.sql) and verify the database character set |
| API reports missing database configuration | `DB_HOST`, `DB_USER`, or `DB_NAME` is absent | Copy [.env.example](../.env.example) to `.env` and set the required values |
| API starts but products are missing | The application startup initializer creates tables but does not insert sample products | Run the full schema script manually |

The repository's recovery notes also warn that phpMyAdmin must connect to the
repaired XAMPP server on port `3307`, not an older server on another port.
