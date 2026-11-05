# Mobile UI checkpoint — November 5, 2026

## Additional feature: administrator creates another administrator

- Admin path: Account requests → Team access IDs → Add admin. Name, unique email and matching 12–200 character password are required. Password and confirmation have independent show/hide controls, hidden by default and reset when the form closes.
- POST /api/auth/admins is authenticated and admin-only. It fixes the inserted role to admin, hashes the password, generates a unique FA-A staff ID and returns only public account fields. Existing schema already supports this role; no migration was needed.
- Implementation: server/admin-accounts.js, its installation in server/index.js, and the admin-only form in InventoryPortal.tsx.
- Real integration checks passed against a uniquely created local QA database: anonymous 401, employee 403, validation, normalized duplicate email, concurrent duplicate protection, stored password hash, generated ID, new admin login/permissions and public registration remaining employee-only.
- Chrome checks passed at 320/390/1440px for form submission, confirmation errors, independent visibility toggles, success/ID display, and no overflow. Employee UI has no creation controls. The QA database was removed after the run; existing application records were not changed. Script: ignored .qa/admin-create-check.mjs.
- The live local API initially returned API route not found because its old process had not reloaded the new route. The verified project API on port 3002 was restarted. Health returned 200/connected and an anonymous POST to the new route returned the expected 401 sign-in requirement. Restart the backend after future backend edits.
- DEMO_SCRIPT_10_MINUTES.md now contains ten continuous segments totaling 600 seconds, including admin creation and password visibility. Azure publication remains outside this completed local feature.

Project: C:\Users\User\gihub-lerasan\sia\frederick-autocare

## Latest requested behavior

- Admin and employee both use a single Inventory page, including summary cards. The redundant Overview navigation and rendering branches were removed for both roles.
- The previously requested single Filter button remains; Compact table rows remains removed; View storefront remains restored.
- Mobile fixes cover the public customer website, staff ID/password forms, employee dashboard and admin dashboard.

## Changes

- Long booking names, vehicle details, notes, team names and account-request emails wrap within the viewport.
- Inventory summary cards use a compact two-column phone layout and appear only on Inventory, so they no longer bury Bookings or Account requests.
- Staff navigation scrolls on short screens, locks background scrolling, makes the background/closed drawer inert, traps keyboard focus while open, and restores focus on close. Section selection returns to the page top.
- Add/edit product forms constrain their height, keep keyboard focus inside, and return focus to the triggering control. Phone controls have readable 16px input text and larger touch targets.
- Customer section panels fill tablet widths through 900px. The customer menu scrolls within short landscape screens, and booking dialogs fit the dynamic viewport.
- Mobile staff entry has space between its home link and heading. Staff verification fallback copy no longer exposes deployment instructions.

## Verified evidence

- Production/PWA build and lint passed. All three existing appointment tests passed during this change set.
- Local Chrome passed 19 fixture-based viewport cases: customer/employee/admin at 320×740, 390×844, 768×1024, 820×1180 and 667×375, plus staff-ID/password entry at 390×844 and 667×375.
- Checks included overflow, long data, public menu and booking bounds, role menus without Overview, retained Inventory summaries, admin requests, drawer scrolling/inert/focus/Escape, product-modal bounds/focus, form font sizes and no page errors in customer/dashboard checks.
- Scripts/report: ignored .qa/mobile-final-check.mjs and .qa/mobile-final-report.json. Screenshots: .qa/mobile-employee-bookings-after.png and .qa/mobile-admin-bookings-after.png.
- Test API responses were isolated browser fixtures. These checks did not modify real stock, accounts or bookings, and are not a fresh verification of production authentication or database migration.
- Physical iOS/Android, Safari and Firefox were not tested. Changes are local and built; not committed, pushed or remotely deployed during this pass. Existing PWA tabs may need closing/reopening for the updated worker to activate.

Files: src/components/InventoryPortal.tsx, src/components/StaffAccessModal.jsx, src/staff.css and src/storefront.css. Preserve earlier unstaged filter changes in InventoryPortal.tsx.
