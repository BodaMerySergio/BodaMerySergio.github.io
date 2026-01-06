```markdown
RSVP -> Google Sheets setup (quick steps)
========================================

Overview
--------
This repository addition adds a front-end RSVP form and an Apps Script server-side snippet that writes posted responses into a Google Sheet. The form sends JSON to the Apps Script web app endpoint.

Steps you must perform
----------------------

1. Create the Google Sheet (in the Google account: bodameryysergio@gmail.com)
   - Open Google Sheets, create a new sheet, name it (e.g., "Boda RSVPs").
   - Copy the sheet ID from the URL: https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit

2. Create and deploy the Apps Script
   - Go to https://script.google.com/ and create a new project while signed in as bodameryysergio@gmail.com.
   - Replace the code in Code.gs with the contents of the provided Code.gs file.
   - Edit the top of Code.gs and set:
     - const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
     - optionally change SHEET_NAME (default "Responses")
   - Save the project.

3. Deploy the Web App
   - In Apps Script, choose Deploy -> New deployment.
   - Deployment type: "Web app".
   - Execute as: "Me" (so writes are performed as the script owner).
   - Who has access: If you want guests to be able to submit without signing in, choose "Anyone" or "Anyone, even anonymous". Note: "Anyone, even anonymous" may be required if guests will be posting without Google accounts.
   - Click Deploy, authorize the script when prompted.
   - Copy the Web app URL shown after deployment.

4. Configure the site to use the web app URL
   - Open rsvp.js (it's added to the repo).
   - Set the APPS_SCRIPT_WEB_APP_URL constant to the Web app URL you copied, e.g.:
     const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

5. Test
   - Open the website (GitHub Pages) or open index.html locally (if needed) and submit the form.
   - Confirm data appears in the Google Sheet.

Security and privacy
--------------------
- The Apps Script runs with the permissions of the script owner (you). Be careful with the "Who has access" setting; granting "Anyone, even anonymous" allows anonymous HTTP POSTs.
- Consider adding a simple secret token in the JSON payload (and checking it in Code.gs) if you want to reduce spam submissions. If you add a token, update rsvp.js to include it in the payload.

Optional: Add a verification token
----------------------------------
- Add a SECRET_TOKEN string to both rsvp.js and Code.gs and verify in doPost before appending rows.
- This is a light anti-spam measure but not bulletproof.

If you want me to try pushing the branch and files again from here, reply "Retry push". If you'd rather run the push locally, use the commands below.
```
