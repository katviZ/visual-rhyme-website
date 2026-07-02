# Visual Rhyme — Lead Capture (Apps Script)

Google Apps Script Web App that receives lead submissions from the site's
`LeadCaptureModal`, appends them to a Google Sheet, and emails
`katvisualrhyme@gmail.com` a notification.

## Files
- `lead-capture.gs` — the Web App code.

## Deploy (one-time, ~5 minutes)

1. **Create the Sheet.** In Google Drive, create a new blank Sheet named
   e.g. `Visual Rhyme — Leads`. Open it and copy the ID from the URL
   (the long string between `/d/` and `/edit`).
2. **Create the Apps Script project.** Go to
   [script.google.com](https://script.google.com) → **New project**.
   Delete the placeholder code and paste the full contents of
   `lead-capture.gs`.
3. **Set the config.** In the pasted code, replace `SHEET_ID` at the top
   with the ID from step 1. `NOTIFY_EMAIL` is already set to
   `katvisualrhyme@gmail.com`.
4. **Deploy as Web App.**
   - Click **Deploy → New deployment**.
   - Type: **Web app**.
   - Description: `Visual Rhyme Lead Capture v1`.
   - Execute as: **Me** (`katvisualrhyme@gmail.com`).
   - Who has access: **Anyone**.
   - Click **Deploy**. Authorize when prompted (needs Sheet + Mail scopes).
5. **Copy the exec URL.** Looks like
   `https://script.google.com/macros/s/AKfycb.../exec`.
6. **Wire the frontend.** Open `src/lib/leadCapture.js` in the website
   repo and paste the exec URL as `LEAD_ENDPOINT`. Commit + push. Vercel
   rebuilds. Test the "Get the Guide" form on the live site.

## Verify

- **GET the exec URL in a browser.** It should return
  `{"ok":true,"service":"Visual Rhyme Lead Capture","version":1}`.
- **Submit a test lead** through the site. Within seconds:
  - A row appears in the Sheet.
  - An email lands in `katvisualrhyme@gmail.com`.

## Local resilience

The frontend queues failed submissions in `localStorage` under
`vr_lead_queue` and auto-retries on the next page load. No lead is ever
silently dropped — worst case, it flushes when the visitor returns.

## Updating the script later

- Edit `lead-capture.gs` in the Apps Script editor.
- Deploy → **Manage deployments** → edit the existing one → new version.
  The exec URL stays the same; no frontend change needed.

## Rotating / revoking

If the endpoint gets abused, open **Manage deployments** and archive it.
The old URL will return 404 immediately. Deploy a fresh one and swap
`LEAD_ENDPOINT` in the frontend.
