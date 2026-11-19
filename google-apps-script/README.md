# RSVP & Wishes → Google Sheet

RSVPs and wishes from the site are saved to
[this spreadsheet](https://docs.google.com/spreadsheets/d/1Z98ysW8ahS56JWZzJDJexAkrxImXGT4GGEdvSl7eEzY/edit).
The script creates two tabs with styled headers automatically:

| Tab        | Columns                                             |
| ---------- | --------------------------------------------------- |
| **RSVP**   | Timestamp · Name · Attending · Guests · Invited As  |
| **Wishes** | Timestamp · Name · Message · Invited As             |

"Invited As" is the guest name from their personal invite link (blank for the general link).
Wishes are private: they are saved to the sheet only and are not shown on the website.

## One-time setup

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete the sample code, paste in everything from `Code.gs`, and save.
3. In the function dropdown pick **setup** → **Run**. Approve the permission prompt
   (Advanced → Go to project → Allow). The RSVP and Wishes tabs are created.
4. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   → **Deploy**, then copy the **Web app URL** (ends in `/exec`).
5. Put the URL in `rsvpScriptUrl` in `lib/wedding.ts`
   (or set the `SHEET_SCRIPT_URL` environment variable in Vercel, which takes priority).

Test: opening the web app URL in a browser should show `{"ok":true,"message":"RSVP & Wishes endpoint is running."}`.

## Changing the script later

After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**
so the same URL keeps working.
