# QA checkpoint — November 4, 2026

Project: C:/Users/User/gihub-lerasan/sia/frederick-autocare
Website: http://127.0.0.1:3002/
Database viewer: http://localhost/phpmyadmin/index.php?route=/sql&db=frederick_autocare&table=booking_requests

## Current work
- Added database-backed unique staff IDs to existing accounts; assigned new IDs automatically to approved employee accounts.
- Staff ID popup in public header/footer; direct /inventory access also checks the ID. Server verifies a 10-minute HttpOnly proof bound to the same account before password login. Login cannot bypass this check.
- Customers can book without an ID. Booking and ID modals blur/inert the background.
- Added supplied a.mp4 as the staff hero (WebM + MP4, poster, pause control).
- Increased fonts, touch targets, and contrast; fixed tablet navigation; added Escape/outside-click handling.
- Added staff ID list for administrators under Account requests.
- Database recovered instance on port 3308 restarted. PHPMyAdmin was already pointed to 3308 but the database was offline. Disabled invalid optional pma control-user configuration. Live browser verification shows all 3 bookings and NO errors.
- Original XAMPP database files are preserved. Quarantined pma-db-check.php was NOT restored, rerun, or recreated. Do not disable antivirus.

## Validation and continuation
- Production build passes.
- phpMyAdmin verification passes: port 3308, 3 bookings, no #1932 or connection errors.
- Critical QA script: .qa/qa-critical.mjs (responsive navigation, booking dialog, staff gate, login, roles, accessibility).
- Critical functional QA PASSED: header links at 320/390/768/1440px, booking validation/blur/inert background/Escape, invalid and valid staff IDs, blocked login bypass, admin login/session restoration, every staff navigation section, staff ID display, mobile menu/logout, employee account binding and admin-only ID restrictions. No JavaScript page errors.
- Automated accessibility scan found secondary text contrast issues; corrections have been applied and rebuilt. The final rerun updates .qa/qa-report.json. Staff ID dialog and login page had zero WCAG A/AA findings in the first scan.
- npm test: all 3 appointment-validation tests pass.
- Cross-browser/device-manual testing and a fresh full create/edit/delete/export cycle are not completed in this focused pass; previous workflow tests are retained in .qa/.
- Review any axe contrast/label findings; inspect .qa/qa-staff-login.png and .qa/qa-mobile-staff.png when generated.
- Backend migration backup: .qa/before-staff-ids.sql. phpMyAdmin config backup: .qa/phpmyadmin-config-before.txt (private; do not publish).
- Primary account IDs are available in the administrator's Account requests page. Passwords remain unchanged.
- App runs with npm start. It auto-starts the recovered DB if needed. Current DB console session 89882; API session 35543.
