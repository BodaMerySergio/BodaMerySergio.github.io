function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Añadir encabezados si es la primera fila
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Nombre', 'Email', 'Asistencia', 'Invitados', 
        'Niños', 'Preferencias Menú', 'Alergias', 'Canción', 'Mensaje'
      ]);
    }
    
    // Añadir los datos
        sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.attending,
      data.guests,
      data.kids,
      data.menuPreferences,
      data.dietary,
      data.song,
      data.message
    ]);
    
    return ContentService.createTextOutput('Success');
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}