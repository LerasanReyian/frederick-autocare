CREATE DATABASE IF NOT EXISTS frederick_autocare
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE frederick_autocare;

CREATE TABLE IF NOT EXISTS inventory_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_inventory_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_sessions (
  id CHAR(64) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at DATETIME(6) NOT NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_inventory_sessions_user
    FOREIGN KEY (user_id) REFERENCES inventory_users(id) ON DELETE CASCADE,
  INDEX idx_inventory_sessions_expiry (expires_at),
  INDEX idx_inventory_sessions_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_account_requests (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  requested_role ENUM('employee') NOT NULL DEFAULT 'employee',
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME(6) NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_inventory_account_requests_email UNIQUE (email),
  CONSTRAINT fk_inventory_account_requests_reviewer
    FOREIGN KEY (reviewed_by) REFERENCES inventory_users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_requests (
  id CHAR(36) NOT NULL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  vehicle VARCHAR(160) NOT NULL,
  service VARCHAR(160) NOT NULL,
  appointment_at DATETIME NOT NULL,
  notes VARCHAR(1000) NULL,
  response_message VARCHAR(500) NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  reviewed_by CHAR(36) NULL,
  reviewed_at DATETIME(6) NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_booking_requests_reviewer
    FOREIGN KEY (reviewed_by) REFERENCES inventory_users(id) ON DELETE SET NULL,
  INDEX idx_booking_requests_status_date (status, appointment_at),
  INDEX idx_booking_requests_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_products (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  sku VARCHAR(64) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  threshold INT UNSIGNED NOT NULL DEFAULT 10,
  price DECIMAL(14, 2) UNSIGNED NOT NULL DEFAULT 0.00,
  color VARCHAR(64) NOT NULL DEFAULT 'bg-violet-100 text-violet-700',
  symbol CHAR(1) NOT NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_inventory_products_sku UNIQUE (sku),
  INDEX idx_inventory_products_category (category),
  INDEX idx_inventory_products_stock (stock)
) ENGINE=InnoDB;

INSERT IGNORE INTO inventory_products
  (id, name, category, sku, stock, threshold, price, color, symbol)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'HID Headlight Kit', 'Lighting', 'LGT-HID-6000K', 24, 10, 3500.00, 'bg-sky-100 text-sky-700', 'H'),
  ('00000000-0000-4000-8000-000000000002', 'LED Headlight Cleaning Set', 'Car Care', 'CARE-HCL-001', 8, 12, 850.00, 'bg-cyan-100 text-cyan-700', 'C'),
  ('00000000-0000-4000-8000-000000000003', 'All-Weather Floor Matting', 'Interior', 'INT-MAT-4PC', 36, 15, 2200.00, 'bg-zinc-200 text-zinc-700', 'M'),
  ('00000000-0000-4000-8000-000000000004', 'Premium Leather Seat Cover', 'Interior', 'INT-SEAT-BLK', 14, 8, 4800.00, 'bg-amber-100 text-amber-800', 'S'),
  ('00000000-0000-4000-8000-000000000005', 'Custom-Fit Car Carpet', 'Interior', 'INT-CRPT-GRY', 19, 10, 1800.00, 'bg-slate-200 text-slate-700', 'C'),
  ('00000000-0000-4000-8000-000000000006', 'Ceramic Glass Tint Roll', 'Exterior', 'EXT-TINT-20', 11, 12, 5200.00, 'bg-indigo-100 text-indigo-700', 'T'),
  ('00000000-0000-4000-8000-000000000007', 'Full HD Dash Camera', 'Electronics', 'ELE-DASH-1080', 27, 10, 3900.00, 'bg-violet-100 text-violet-700', 'D'),
  ('00000000-0000-4000-8000-000000000008', 'Bluetooth Car Stereo', 'Electronics', 'ELE-STR-BT01', 6, 10, 6500.00, 'bg-blue-100 text-blue-700', 'B'),
  ('00000000-0000-4000-8000-000000000009', 'Dual-Tone Electric Horn', 'Electronics', 'ELE-HORN-12V', 31, 12, 1200.00, 'bg-rose-100 text-rose-700', 'H'),
  ('00000000-0000-4000-8000-000000000010', 'Remote Car Alarm System', 'Security', 'SEC-ALRM-RMT', 9, 10, 2800.00, 'bg-red-100 text-red-700', 'A'),
  ('00000000-0000-4000-8000-000000000011', 'Universal Repair Parts Kit', 'Parts', 'PRT-REPR-UNI', 42, 15, 1450.00, 'bg-red-100 text-red-700', 'P'),
  ('00000000-0000-4000-8000-000000000012', 'Body Repair Compound', 'Car Care', 'CARE-BDY-500', 0, 8, 950.00, 'bg-emerald-100 text-emerald-700', 'B');
