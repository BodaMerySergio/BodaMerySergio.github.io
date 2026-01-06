const SHEET_URL = "https://script.google.com/macros/s/AKfycbz9xyjYJ9mbEbgerV299G-s7nROjC7X5zlNHr9wG-zytlsn4wSInh1N_eNU3ddtD-vEQA/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const statusEl = document.getElementById("rsvp-status");
  const guestsInput = document.getElementById("guests");
  const kidsInput = document.getElementById("kids");
  const menuSection = document.getElementById("menu-section");
  const menuPreferences = document.getElementById("menu-preferences");
  const attendingRadios = document.querySelectorAll('input[name="attending"]');

  // Generar opciones de menú para cada invitado
  function generateMenuOptions() {
    const totalGuests = parseInt(guestsInput.value) || 0;
    const totalKids = parseInt(kidsInput.value) || 0;
    const adults = totalGuests - totalKids;
    const isAttending = document.querySelector('input[name="attending"]:checked')?.value === "Sí";
    
    if (totalGuests > 0 && isAttending) {
      menuSection.style.display = "block";
      menuPreferences.innerHTML = "";
      
      // Adultos - opciones carne/pescado
      for (let i = 1; i <= adults; i++) {
        const guestDiv = document.createElement("div");
        guestDiv.className = "guest-menu";
        guestDiv.style.cssText = "margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;";
        
        guestDiv.innerHTML = `
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Adulto ${i}:</label>
          <div class="radio-group">
            <label class="radio-pill"><input type="radio" name="menu-${i}" value="Carne" required /> Carne</label>
            <label class="radio-pill"><input type="radio" name="menu-${i}" value="Pescado" /> Pescado</label>
          </div>
        `;
        
        menuPreferences.appendChild(guestDiv);
      }
      
      // Niños - campo de texto libre
      for (let i = 1; i <= totalKids; i++) {
        const kidDiv = document.createElement("div");
        kidDiv.className = "guest-menu";
        kidDiv.style.cssText = "margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 8px;";
        
        kidDiv.innerHTML = `
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Niño ${i}:</label>
          <input type="text" name="kid-menu-${i}" placeholder="Ej. menú infantil, pescado, etc." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;" />
        `;
        
        menuPreferences.appendChild(kidDiv);
      }
    } else {
      menuSection.style.display = "none";
    }
  }

  guestsInput.addEventListener("input", generateMenuOptions);
  kidsInput.addEventListener("input", generateMenuOptions);
  attendingRadios.forEach(radio => {
    radio.addEventListener("change", generateMenuOptions);
  });

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    statusEl.textContent = "Enviando...";
    statusEl.style.color = "#333";
    
    const formData = new FormData(form);
    
    // Recopilar preferencias de menú
    const totalGuests = parseInt(formData.get("guests")) || 0;
    const totalKids = parseInt(formData.get("kids")) || 0;
    const adults = totalGuests - totalKids;
    const menuChoices = [];
    
    // Adultos
    for (let i = 1; i <= adults; i++) {
      const choice = formData.get(`menu-${i}`);
      if (choice) menuChoices.push(`Adulto ${i}: ${choice}`);
    }
    
    // Niños
    for (let i = 1; i <= totalKids; i++) {
      const choice = formData.get(`kid-menu-${i}`);
      if (choice) menuChoices.push(`Niño ${i}: ${choice}`);
    }
    
    const data = {
      timestamp: new Date().toISOString(),
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      attending: formData.get("attending") || "",
      guests: formData.get("guests") || "0",
      kids: formData.get("kids") || "0",
      menuPreferences: menuChoices.join("; ") || "",
      dietary: formData.get("dietary") || "",
      message: formData.get("message") || ""
    };

    try {
      const resp = await fetch(SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      statusEl.textContent = "Gracias — tu respuesta fue enviada.";
      statusEl.style.color = "green";
      form.reset();
      menuSection.style.display = "none";
    } catch (err) {
      statusEl.textContent = "Ocurrió un error. Por favor inténtalo de nuevo.";
      statusEl.style.color = "red";
    }
  });
});
