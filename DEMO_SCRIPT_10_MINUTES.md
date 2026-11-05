# Frederick Auto — 10-minute system demonstration

**Audience:** project panel, instructor, client or shop owner.  
**Duration:** 10 minutes, including clicks and short pauses.  
**Delivery:** read the quoted narration; follow the on-screen actions. Aim for a conversational 125–140 words per minute, with interaction pauses. Use the segment end times as cues during rehearsal.

Updated November 5, 2026. Both admin and employee use **Inventory with summary cards**, filters are inside **one Filter button**, Compact table rows is removed, and **View storefront** is available. The administrator can now create another administrator with a generated staff ID and separate password-visibility controls. Demonstrate locally unless an actual public deployment has been verified.

## Preparation — before starting the timer

1. Start XAMPP's working database and the application. Open the built website, normally http://127.0.0.1:3002/. Run a full practice booking and sign-in before presenting; recent mobile checks used isolated browser fixtures and do not replace this rehearsal.
2. Use a clean browser window for the customer/admin journey. Have a separate browser profile already signed in as the existing demo employee, avoiding a second login that replaces the admin session in the same profile.
3. Prepare the actual assigned demo admin/employee IDs and their passwords privately. Do not project a password list or read passwords aloud. The script does not provide usable credentials.
4. Use a demonstration database or clearly labeled demo records. Keep genuine customer names, phone numbers, notes and staff information out of the projected view.
5. Pick an available **future Monday–Saturday appointment between 8:00 AM and before 5:00 PM, Manila time**. Use 10:00 AM if available. Do not hardcode today's date or reuse an already occupied slot.
6. Prepare the following test data. Choose another unique SKU if this one already exists; the app rejects duplicates.

| Field | Demo value |
| --- | --- |
| Customer | DEMO Customer |
| Phone | 09000000000 — local test record only |
| Vehicle | DEMO Toyota Vios |
| Service | Car accessories |
| Booking notes | DEMO ONLY — dashboard accessory consultation |
| Product name | DEMO Dash Cam Mount |
| SKU | DEMO-MOUNT-01 |
| Category | Electronics |
| Starting stock | 4 |
| Unit price | 500 |
| Low-stock threshold | 10 |
| Additional admin name | DEMO Additional Admin |
| Additional admin email | demo.additional.admin@example.test — use a unique address for each rehearsal |
| Additional admin password | Prepare a private password of 12–200 characters; do not write a real password in this script |

7. Use a dedicated demonstration database for new administrator creation. The new account has full admin permissions and persists after creation. Ensure the existing demo employee can sign in; do not depend on creating that employee during the timed demo.
8. Have responsive browser mode ready at approximately **390 × 844**. Close/reopen old site tabs after rebuilding so the current PWA version is active.
9. Rehearse Get the app. The browser may show an install prompt, instructions, or an already-installed message. Only perform an offline demonstration if you have verified the current worker/cache during rehearsal; keep the network connected for booking and staff operations.
10. Do not switch into source code, database tools or cloud provisioning during the timed presentation. Keep one screenshot of a successful demo booking and one of the staff workspace ready as a contingency.
11. Restart the backend after backend-code updates. An anonymous POST to `/api/auth/admins` should require sign-in (401), rather than return “API route not found.” This is a rehearsal check, not part of the presentation.

## Timing map

| Time | Segment | Duration |
| --- | --- | --- |
| 00:00–00:40 | Introduction and purpose | 40 seconds |
| 00:40–01:40 | Customer website and scroll video | 60 seconds |
| 01:40–02:55 | Customer service booking | 75 seconds |
| 02:55–03:40 | Staff ID and password sign-in | 45 seconds |
| 03:40–04:55 | Admin inventory workflow | 75 seconds |
| 04:55–06:10 | Create another administrator | 75 seconds |
| 06:10–07:00 | Review the customer booking | 50 seconds |
| 07:00–08:00 | Employee workflow | 60 seconds |
| 08:00–09:15 | Mobile layout and PWA | 75 seconds |
| 09:15–10:00 | Validation and closing | 45 seconds |
| **Total** | | **600 seconds** |

## 00:00–00:40 — Introduction and purpose

**Screen:** landing-page hero, at the top of the page.

**Say:**

> Good day, everyone. Today I will demonstrate the Frederick Auto system, which brings the customer website and the shop's daily staff tools into one application.
>
> Customers can explore services and request an appointment. Employees can work with inventory and bookings, while administrators have additional controls for product management and team access.
>
> I will follow a customer request into the staff workspace, create an additional administrator, and show inventory and mobile workflows. This is our working local demonstration using clearly labeled test records.

**Action:** point to the brand and primary booking action. Pause briefly before scrolling.

**Cue:** begin moving through the website at **00:40**.

## 00:40–01:40 — Customer website and scroll video

**Actions, in order:**

1. Scroll slowly down, then slightly back up to show the film reversing.
2. Click **Services**; let the transition finish.
3. Show a service category and search; clear the search afterward.
4. Click **Our workshop**, then **Find us**. Point to the contact/directions area without opening another website.
5. Return to Services and locate **Car accessories** for the next segment.

**Say while navigating:**

> The landing page uses an automotive background tied to the visitor's scroll position. As I move down and back up, the film responds in both directions.
>
> The navigation connects customers to Services, Our workshop and Find us. The content remains readable while the car stays visible behind it.
>
> Customers can browse the service collection, choose a category, or search. Each card has a description and its displayed estimate or pricing guidance. Final fitment, availability and pricing can be discussed with the shop.
>
> I will select Car accessories to begin our customer's request.

**Cue:** click **Select for booking** at **01:40**.

## 01:40–02:55 — Customer service booking

**Actions, in order:**

1. Click **Select for booking** on Car accessories.
2. Point out the popup and blurred background.
3. Click **Review request** once with required fields empty; briefly show validation.
4. Fill the prepared demo customer, phone, vehicle, available future appointment and notes. The selected service should carry into the form.
5. Click **Review request**, check the summary, then **Submit request** once.
6. Wait for the actual success state before describing the request as submitted.

**Say:**

> Selecting a service opens the booking form without taking the customer away from the website. The background becomes blurred so attention stays on the request.
>
> I will first try to continue with missing information. The form identifies the required fields, helping the customer correct the request before submission.
>
> Now I will enter our demo details and choose a future appointment during shop hours. Customers do not need a staff ID or staff account to use this form.
>
> The review step gives them an opportunity to check the vehicle, service and requested schedule before submitting. I will submit this once and wait for the result.
>
> The success screen means the request was recorded. Its appointment is still subject to review and confirmation by the shop, which we will show in the staff workspace shortly.

**Cue:** close the booking dialog and open **Staff login** by **02:55**.

## 02:55–03:40 — Staff ID and password sign-in

**Actions, in order:**

1. Open **Staff login**.
2. Enter the assigned demo admin ID and continue.
3. On the password form, enter that same account's email and password.
4. Click **Sign in to inventory** and wait for the workspace.

**Say:**

> Staff access starts with an assigned ID. The system checks that ID before opening the password sign-in form.
>
> The ID identifies the staff account entering the workspace, and that account's password is still required. It is an account identification step, not a claim of multi-factor authentication.
>
> I am signing in as our demonstration administrator. After a successful sign-in, the system presents the tools available to that role, beginning with the combined Inventory page.

**Cue:** have Inventory visible at **03:40**. Do not spend this segment reading credentials or troubleshooting account setup.

## 03:40–04:55 — Admin inventory workflow

**Actions, in order:**

1. Point to total products, inventory value, low stock and out-of-stock summaries.
2. Open **Filter**, show Category and Stock status, then clear/close it.
3. Click **Add product** and enter the prepared DEMO Dash Cam Mount record. Keep threshold 10. Submit and wait for success.
4. Search its SKU to isolate the new item.
5. Click **Edit**, change its price from 500 to 550, and save.
6. Point out **Export**. Download the current filtered inventory only if time permits; do not open another application during this segment.

**Say:**

> Inventory combines summary information and product tools on one page for both administrators and employees.
>
> The summaries show product counts, inventory value and stock conditions. Search finds products by name or SKU, while category and stock status are grouped inside one Filter button.
>
> I will create a demonstration item with four units and a low-stock threshold of ten. We will replenish it through the employee account later.
>
> After saving, I can find it through its SKU. As administrator, I will edit its price and save the change.
>
> Export can download the current inventory view as CSV for reporting. We will keep this demo item for the employee workflow.

**Cue:** open **Account requests** at **04:55**.

## 04:55–06:10 — Create another administrator

**Actions, in order:**

1. In **Account requests**, locate **Team access IDs** and click **Add admin**.
2. Enter DEMO Additional Admin and the prepared unique email.
3. Point out the separate eye buttons for Password and Confirm password. Toggle one **while its input is empty**, then hide it again before entering a real password. This demonstrates the feature without projecting a credential.
4. Enter the prepared password of 12–200 characters and confirm it. Keep both inputs hidden while presenting.
5. Click **Create admin** once and wait for the success message.
6. Point out the generated `FA-A-…` ID and new team-list entry. Do not read the password aloud.

**Say:**

> An existing administrator can now create another administrator from the team-access area.
>
> The form requires the person's name, email, password and matching confirmation. Each password field has its own show-and-hide control. I will demonstrate the visibility button before entering our private demo password.
>
> After I submit, the system creates the account and assigns a unique administrator staff ID. We wait for the success message before treating creation as complete.
>
> The new administrator signs in using that ID, the assigned email and password, and receives the same administrator permissions. This creation feature is restricted to signed-in administrators; employees cannot use it. The new record also appears in the team list.

**Cue:** open **Bookings** at **06:10**. The created account stays in the demo database; there is no automatic removal after presentation.

## 06:10–07:00 — Review the customer booking

**Actions, in order:**

1. Open Bookings and click **Refresh** if necessary.
2. Find **DEMO Customer** from the earlier request.
3. Show its vehicle, service and requested schedule.
4. Change Booking status to **Approved / confirmed**. Wait for the save; choose an appropriate preset customer response if demonstrating that control.

**Say:**

> Here is the customer request submitted earlier. Staff can review the vehicle, service, contact information and preferred appointment together.
>
> I will approve this demo request and record an appropriate response. The status and response are stored with the booking, giving the shop a consistent record of its decision.
>
> This connects the public booking form to the staff workflow. Next, I will switch to our prepared employee profile to show daily inventory work and the same updated booking.

**Presenter note:** selecting a response records it; do not claim that this action sends email or SMS.

**Cue:** switch to the separate employee browser profile at **07:00**.

## 07:00–08:00 — Employee workflow

**Actions, in order:**

1. Open the employee browser profile that was signed in during preparation.
2. Show the employee navigation and combined Inventory page.
3. Search **DEMO-MOUNT-01** or the actual unique SKU used earlier.
4. Point out the four units and low-stock condition.
5. Click **Restock** once. The current action adds **25 units**, so this demo item should change from **4 to 29**.
6. Open Bookings and show the demo request's updated status.

**Say:**

> The employee workspace also uses one Inventory page with its summaries, search and filters.
>
> Employees can add items and replenish stock. Product edit, delete and administrator-creation controls are reserved for administrators.
>
> I will locate our demo item by SKU. Its four units are below the threshold of ten. Clicking Restock once uses the current twenty-five-unit replenishment action, bringing it to twenty-nine units after the save succeeds.
>
> Opening Bookings shows the approved customer request. Both roles work with shared records, using the controls available to their account.

**Cue:** open responsive mode or your prepared phone-sized view at **08:00**.

## 08:00–09:15 — Mobile layout and PWA

**Actions, in order:**

1. Use the employee page at approximately 390 × 844.
2. Show the compact inventory summaries and mobile product cards. Open Filter, then close it.
3. Open the staff menu, select Bookings, and show that the details fit the screen.
4. Use **View storefront** to return to the public website. Show its mobile menu and one service panel.
5. Move to Find us and select **Get the app**. Show the available install prompt, instructions or installed message.

**Say:**

> The system also adapts to smaller screens. Inventory uses compact summaries and product cards, and the filters remain available through the same button.
>
> The staff menu opens as a drawer that can scroll on shorter screens. Booking details and longer text wrap within the page, while forms use readable input sizes and reachable controls.
>
> Returning to the customer website, visitors can still browse services, find the shop and request a booking from a phone-sized layout.
>
> The application includes PWA support. Depending on the browser, Get the app opens installation or provides instructions for adding it to the home screen. Cached public content can be available after an initial visit; submitting bookings and accessing staff records require a connection. Installation availability depends on the browser and its current state.

**Presenter note:** a responsive desktop preview demonstrates layout, not physical-phone or Safari certification. Do not force an install/offline sequence that did not work during rehearsal.

**Cue:** return to a clean customer hero or Inventory screen at **09:15**.

## 09:15–10:00 — Validation and closing

**Action:** leave the screen on the clean landing page or combined Inventory page. Stop clicking and address the audience.

**Say:**

> We followed a customer from service discovery to a recorded booking, created another administrator, and demonstrated an employee stock update.
>
> Recent checks covered nineteen customer and staff viewport cases, appointment validation, and the new administrator's sign-in and permissions. Physical-device and additional-browser testing remain next steps.
>
> Frederick Auto brings customer service information, appointment requests, inventory and staff access into one workflow. The next deployment step is completing the Azure setup and verifying the published system against its hosted database.
>
> Thank you for watching. I am ready for your questions.

**Finish at 10:00.** Keep questions outside the timed demonstration unless the panel asks otherwise.

## Recovery lines — use only if needed

| Situation | Say and do |
| --- | --- |
| Page takes longer than expected | “While this loads, this step connects the customer's request to the staff workflow.” Pause briefly; use a prepared screenshot if necessary. |
| Booking time is occupied | “That slot is already requested. I will choose another available time.” Return to the form and pick the rehearsed alternate. |
| Demo SKU already exists | “The system protects SKU uniqueness. I will use a different demonstration SKU.” Update it and use that value consistently afterward. |
| Admin email already exists | “That email already belongs to an account. I will use the prepared alternate demo email.” Preserve the current form and change the email; do not recreate an existing person. |
| A save fails | “This change has not been confirmed. I will keep the current information and retry after checking the connection.” Do not present the failed operation as successful. |
| Install prompt does not appear | “This browser is showing installation guidance. The available flow depends on browser support and whether the app is already installed.” Show Get the app instructions and continue. |
| You are behind schedule | Skip the CSV download and shorten public browsing. Keep booking submission, the new administrator feature, booking review and employee restock. |

## After the demonstration

- Sign out of demo staff sessions.
- The new administrator remains a full-permission account after the demo. Use the prepared demonstration-data reset/cleanup procedure; do not claim the system has an admin-delete screen or automatic account expiry.
- Remove only the clearly identified demo records through the appropriate authorized workflow, if cleanup is required. Do not delete real stock, requests or bookings.
- Keep the demonstration recording free of passwords and private customer information.
