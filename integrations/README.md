# Send form submissions to Google Sheets

1. Open your Google Sheet, then **Extensions > Apps Script**.
2. Delete the placeholder code and paste in `google-sheet.gs`. Save.
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when asked, then copy the **Web app URL** (ends in `/exec`).
5. In `js/main.js`, set `SHEET_URL` (top of the contact form block) to that URL.

The first submission adds a header row (Received, Inquiry No., Name, Email, Designing, Timing, Story).
After changing the script later, use **Deploy > Manage deployments > Edit > New version**; the URL stays the same.
