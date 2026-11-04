# Mobile UI checkpoint — November 5, 2026

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
