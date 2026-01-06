const SHEET_URL = "https://script.google.com/macros/s/AKfycbzD-5BTsO__CieGGC79ub6No2TSYQqvVAwBues3MGTTu5m0FFB_WCPnnThU5VGAm5WrpQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvp-form");
  const statusEl = document.getElementById("rsvp-status");

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    statusEl.textContent = "Enviando...";
    statusEl.style.color = "#333";
    
    const formData = new FormData(form);
    const data = {
      timestamp: new Date().toISOString(),
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      attending: formData.get("attending") || "",
      guests: formData.get("guests") || "0",
      kids: formData.get("kids") || "0",
      kidsMeal: formData.get("kids-meal") || "",
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
    } catch (err) {
      statusEl.textContent = "Ocurrió un error. Por favor inténtalo de nuevo.";
      statusEl.style.color = "red";
    }
  });
});
