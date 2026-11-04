# Luna task: finish mobile layout and replace the landing-page background video

Date: November 4, 2026, Asia/Manila.

## Request

Continue the existing Frederick Auto project. Fix the landing-page mobile header, navigation and section panels, especially the experience after tapping Services, Our workshop and Find us. Use the supplied image as a reference for mobile composition. Replace the public landing-page background film with the supplied **mp41.mp4**, preserving scroll-controlled playback and the existing brand.

Implement and verify these changes. Do not stop at a plan or claim success from build results alone.

## Project and inputs

- Project: `C:\Users\User\gihub-lerasan\sia\frederick-autocare`
- New landing-page source video: `C:\Users\User\Downloads\mp41.mp4`
- Mobile design reference: `C:\Users\User\AppData\Local\Temp\codex-clipboard-566c7dcf-6de2-4694-95ba-3366053eb8e4.png`
- Existing background/history: [QA_CHECKPOINT.md](QA_CHECKPOINT.md)
- Built frontend and API: `http://127.0.0.1:3002/`
- Staff portal: `/inventory`

The new video file was confirmed to exist and is 4,472,478 bytes. Its duration, dimensions, frame count and ideal reveal point have **not** been measured in this handoff pass. Inspect the clip before choosing a trim or encoding settings. Do not reuse the old clip's timing blindly.

The reference image was inspected. It shows three separate phone compositions with simple vertical hierarchy, large left-aligned headings, spacious layouts, rounded edges and pill-shaped actions. It is a layout reference, not a request to add unrelated account screens or replace the auto-shop brand with pastel colors, portrait photos or decorative blobs.

If the temporary reference image is unavailable later, use this description and say the original could not be reopened. Do not invent details of an unseen replacement.

## Current progress: preserve existing work

The user's latest report says the previous assistant completed:

- Staff hero autoplay and removal of its visible Play/Pause control.
- Removal of MySQL/database wording from staff screens.
- Improved timeout, network, authentication, conflict and other request errors.
- Operation-specific duplicate-record messages and corrected recovery guidance.
- Passing tests, lint and production build; healthy API.

In this handoff pass, current `StaffEntryLayout.jsx` was inspected: it contains muted inline looping autoplay, reduced-motion handling, poster fallback and no visible film-control button. The other reported changes and test outcomes were **not independently rerun in this pass**. Inspect current source and preserve them; do not redo earlier tasks from the old checkpoint by default.

This pass creates instructions only. **The mobile fixes and new landing film are still pending.**

Database: retain the repaired XAMPP setup at `127.0.0.1:3307`, database `frederick_autocare`. The previous checkpoint pass verified six healthy tables and HTTP 200 API health. Recovery database copies and the optional autostart launcher have since been removed; no new database repair or port change is part of this task.

## 1. Diagnose mobile layout and navigation before editing

Read these files and inspect the running page:

- `src/components/Header.jsx`
- `src/App.jsx`
- `src/storefront.css`
- `src/index.css` and any overlapping rules in `src/App.css`
- `src/components/ServiceCatalog.jsx` and `ServiceCard.jsx`
- `src/components/BookingModal.jsx`, `StaffAccessModal.jsx` and `src/staff.css`

Verified source facts to investigate, not a claim of a reproduced root cause:

- Header links currently target `#services`, `#about` and `#contact`; matching IDs exist in App.jsx. The workshop section is `#about`.
- Links close the menu through React state and use native anchors. Verify the actual scroll position after the menu closes, not just the URL hash.
- At widths up to 1100px, content panels use `width: min(540px, 58%)`. Full-width panels begin only at 760px, while mobile navigation begins at 900px. This leaves 761–900px using mobile navigation with narrow inherited panels.
- Mobile hero copy has substantial fixed vertical padding; inspect its effect on short screens and address-bar resizing.
- The stylesheet contains multiple later overrides. Inspect computed styles and consolidate conflicting rules where useful rather than continually appending patches.

Reproduce each reported issue at phone and tablet widths. Record the concrete symptom and cause before claiming it fixed. A previous automated pass does not override the user's current observation.

## 2. Implement the mobile composition

- Use one clear vertical reading flow, comfortable gutters, large readable headings and prominent pill-style primary actions inspired by the reference.
- Preserve Frederick Auto's navy/charcoal, crimson and white/off-white theme, existing logo, real services and contact details.
- Keep the cinematic car film visible around and through appropriately translucent panels. The film itself stays at **100% opacity**; do not introduce a full-screen dimming layer.
- Use enough local panel contrast for readable text over both bright and dark film frames. Do not make text faint to expose more video.
- Scale headings without clipping. Target approximately 16px body/input text and comfortable line spacing; do not shrink content to hide overflow.
- Give Services, Our workshop, process and Find us coherent full-width mobile panels with consistent spacing and useful content order. Avoid narrow desktop columns and excessive empty scroll gaps.
- Preserve desktop composition while fixing phone/tablet behavior. Do not use a global overflow-hidden rule to conceal broken widths.
- Ensure service filters, cards, pagination, phone/email links, footer and booking actions fit narrow screens. Wrap long content appropriately.

### Header and section behavior

- Keep brand and menu toggle aligned, with comfortable tap targets, visible focus and no collision or horizontal overflow.
- The open menu must fit short screens and scroll internally if needed. It must not remain over a selected section.
- Tapping Services, Our workshop or Find us closes the menu and reveals the correct section heading below the fixed header. Use consistent header-height/anchor offsets; avoid arbitrary delayed scrolling unless necessary and justified.
- Test brand/home, hero Explore services, footer links, repeated clicks, direct hash loading, browser Back/Forward and portrait/landscape resizing.
- Retain accessible toggle state, Escape behavior and useful focus handling. Do not leave focus trapped in a hidden menu.
- Book a service opens the customer popup; Staff login opens the staff-ID gate. Opening either should close navigation and leave a clear, reachable dialog over the blurred background.
- Closing dialogs should restore scrolling and a useful focus position. The customer booking flow must remain independent of staff IDs.

## 3. Replace the landing-page film correctly

Inspect `src/components/ScrollFilm.jsx` before changing assets. The current implementation uses:

- `public/drive-reveal.webm`, `drive-reveal.mp4`, `drive-reveal.jpg`
- `public/drive-frames/000.webp` through `125.webp`
- Hardcoded `FRAME_COUNT = 126` and a canvas fallback with 1280×720 backing dimensions.
- A two-stage scroll mapping that accelerates the early reveal, plus loading/seek watchdogs and image-frame fallback.

Required changes:

1. Inspect `mp41.mp4`: measure metadata and view its beginning, middle and end. Choose a useful opening frame so the car is visible promptly. Trim only if inspection supports it; the old 2.65-second trim does not automatically apply.
2. Generate browser-compatible, reasonably sized video encodes with seek-friendly keyframes, an opening poster, and a matching image-frame fallback from **this same new clip**. Use existing local tooling where available. Preserve the supplied source file.
3. Replace every public film representation together. Never leave the old car clip in the canvas fallback or poster. If frame count/aspect ratio changes, update component metadata, numbering, canvas sizing and crop behavior accordingly.
4. Prefer versioned media names/paths or otherwise ensure existing PWA clients receive the new assets. Remove obsolete generated frames only after verifying they are unused and replacements work; do not touch recovery files or unrelated media.
5. Preserve scroll scrubbing in both directions, including native anchor navigation, manual dragging of the scrollbar, resizing and restoring a previously scrolled page. The settled frame must match the current page position.
6. Do not turn the landing film into an independent autoplay loop. No visible Play control, timeline, duration display or “scroll to explore” text.
7. Keep muted inline media, graceful codec/loading failure handling, poster fallback and direct user-driven scrolling with reduced-motion preferences. Avoid repeated full re-downloads or decoding the entire frame sequence into memory on phones.
8. Check mobile crop using the new footage. Keep the car in frame at portrait and landscape ratios; do not blindly keep the old 55% object-position.

**Only the public landing-page film is being replaced.** Preserve the existing staff hero assets/playback behavior; its ordinary autoplay is separate from the public scroll-driven film.

## 4. PWA and error behavior

- Inspect `scripts/build-pwa.js`, `scripts/service-worker.template.js` and production registration before changing media URLs.
- Update the cached public poster reference and cache version as needed. The version currently depends on built HTML/asset names; replacing same-name public media alone may not invalidate an existing cache. Verify an upgrade from the previous worker, not just a fresh profile.
- Offline landing should retain a useful poster/shell. Staff and booking actions must communicate unavailable connectivity clearly.
- Never cache private API responses or introduce automatic offline booking submission as part of this layout task.
- Preserve the newer staff error-handling work and keep backend/database information out of both staff roles' UI.

## 5. Verification required before calling this done

Run appropriate automated checks from the project directory:

```powershell
npm test
npm run lint
npm run build
```

Port 3002 serves `dist`; rebuild before checking the final version there. Inspect existing listeners before launching duplicate servers. Read QA scripts before running: ignored `.qa/` scripts can contain old ports, credentials, fixtures or data-changing operations.

Browser checks must include:

| Area | Required checks |
| --- | --- |
| Widths | 320, 360, 390, 430, 768, 820, 900 and desktop 1440px; short landscape viewport |
| Header | Toggle, short-screen menu, all anchors, repeated clicks, correct heading offset, focus, no leftover overlay |
| Panels | Services, workshop, process, contact, footer; no clipping/sideways scrolling; consistent mobile spacing |
| Video | New footage visible in poster, video and forced fallback; actual frames change down/up; crop and anchor-jump synchronization |
| Dialogs | Booking and staff-ID gate, blur, keyboard, close/focus return, small-screen keyboard and scrolling |
| Accessibility | Text contrast over varying frames, labels, visible focus, reduced motion; automated scan plus manual checks |
| PWA | Fresh install and existing-worker update, offline poster/shell, no private response caching |
| Regression | Staff gate/login still works; desktop layout preserved; API health remains good |

Capture before/after mobile screenshots and record viewport sizes. State which browsers were actually used. Do not label browser QA complete from lint/build or a changed hash alone. Do not modify real bookings or stock during layout verification.

## 6. Completion and checkpoint update

- [ ] Mobile navigation reveals the correct sections cleanly below the header.
- [ ] Mobile panels follow the reference's clear hierarchy while retaining the auto-shop theme and visible film.
- [ ] New mp41.mp4 footage powers all public video/poster/frame fallback paths.
- [ ] Scroll-controlled playback works down/up, after anchor jumps, and on mobile crop/resize.
- [ ] Booking, staff access, desktop, PWA and error behavior pass relevant regression checks.
- [ ] Tests/lint/build and actual browser checks reported honestly, with remaining limitations.
- [ ] QA_CHECKPOINT.md updated with actual files changed, test evidence, remaining work and next action.

If usage runs low, save the exact unfinished item and last observed result in the checkpoint. Do not mark incomplete work finished or leave the next assistant guessing.

Suggested starting instruction: **Read this file and QA_CHECKPOINT.md, inspect current source and reproduce the mobile problems, then implement and test this mobile/video update in the existing checkout.**
