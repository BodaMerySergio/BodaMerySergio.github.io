// Code.gs (Google Apps Script)
// Instructions:
// 1) Create a Google Sheet in the Google account bodameryysergio@gmail.com
// 2) Note the Sheet ID (the long ID in the sheet URL).
// 3) Create a new Apps Script project, replace the default code with this file.
// 4) Set SHEET_ID and optionally SHEET_NAME below.
// 5) Deploy -> New deployment -> Select "Web app", Execute as: "Me", Who has access: "Anyone" or "Anyone, even anonymous" (see README).
// 6) Copy the web app URL and paste into rsvp.js APPS_SCRIPT_WEB_APP_URL.

const SHEET_ID = "18ZjJq3ErWpm5dlbfvfYT8uWAx-K-ui7ujRr6QlLZn70";
const SHEET_NAME = "Responses"; // name of the worksheet/tab within the sheet

function doPost(e) {
  try {
    const raw = e.postData && e.postData.contents ? e.postData.contents : null;
    if (!raw) {
      return ContentService.createTextOutput("No POST data received").setMimeType(ContentService.MimeType.TEXT);
    }

    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Write header row
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre",
        "Correo Electrónico",
        "Asistirá",
        "Invitados Total",
        "Niños",
        "Menú Niños",
        "Alergias/Restricciones",
        "Mensaje",
        "Recibido (Timestamp)"
      ]);
    }

    // Build row in the same order as headers
    const row = [
      data.timestamp || "",
      data.name || "",
      data.email || "",
      data.attending || "",
      data.guests || "",
      data.kids || "",
      data.kidsMeal || "",
      data.dietary || "",
      data.message || "",
      new Date()
    ];

    sheet.appendRow(row);

    // Send email with calendar invite if attending
    Logger.log("Attending value: '" + data.attending + "'");
    Logger.log("Email value: '" + data.email + "'");
    Logger.log("Condition check: " + (data.attending === "Sí" && data.email));
    
    if (data.attending === "Sí" && data.email) {
      try {
        const subject = "Confirmación RSVP - Boda de Sergio y Mery";
        const eventDate = new Date(2025, 6, 4, 12, 30, 0);
        const eventEndDate = new Date(2025, 6, 5, 2, 0, 0);
        
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Boda Sergio y Mery//ES
BEGIN:VEVENT
DTSTART:20250704T123000Z
DTEND:20250705T020000Z
SUMMARY:Boda de Sergio y Mery
LOCATION:La Casona de Torrelodones\, Crta. de Torrelodones a Hoyo de Manzanares\, Km. 23\, 28250 - Torrelodones (MADRID)
DESCRIPTION:¡Nos casamos y queremos celebrarlo contigo!
END:VEVENT
END:VCALENDAR`;
        
        const body = `Hola ${data.name},\n\n` +
          `¡Gracias por confirmar tu asistencia a nuestra boda!\n\n` +
          `Detalles del evento:\n` +
          `📅 Fecha: 4 de julio de 2025\n` +
          `🕧 Hora: 12:30h\n` +
          `📍 Lugar: La Casona de Torrelodones\n` +
          `Crta. de Torrelodones a Hoyo de Manzanares, Km. 23\n` +
          `28250 - Torrelodones (MADRID)\n\n` +
          `Adjuntamos una invitación de calendario para que no olvides la fecha.\n\n` +
          `¡Nos vemos pronto!\n\n` +
          `Sergio y Mery`;
        
        const icsBlob = Utilities.newBlob(icsContent, "text/calendar", "boda.ics");
        MailApp.sendEmail({
          to: data.email,
          subject: subject,
          body: body,
          attachments: [icsBlob]
        });
        
        Logger.log("Email sent successfully to: " + data.email);
      } catch (emailErr) {
        Logger.log("Error sending email: " + emailErr.message);
        Logger.log("Error stack: " + emailErr.stack);
      }
    } else {
      Logger.log("Email not sent - condition not met");
    }

    const resp = ContentService.createTextOutput("ok");
    resp.setMimeType(ContentService.MimeType.TEXT);
    return resp;
  } catch (err) {
    const errorResp = ContentService.createTextOutput("error: " + err.message);
    errorResp.setMimeType(ContentService.MimeType.TEXT);
    return errorResp;
  }
}
