// Script para la cuenta regresiva hasta la boda
// Fecha de la boda: 4 de julio de 2025

// Función para actualizar la cuenta regresiva
function actualizarCuentaRegresiva() {
    // Fecha objetivo: 4 de julio de 2025 a las 18:00 (hora de Madrid)
    const fechaBoda = new Date('2026-07-04T12:30:00+02:00').getTime();
    
    // Obtener la fecha y hora actual
    const ahora = new Date().getTime();
    
    // Calcular la diferencia
    const diferencia = fechaBoda - ahora;
    
    // Cálculos de tiempo
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    // Actualizar los elementos HTML
    document.getElementById('days').textContent = dias;
    document.getElementById('hours').textContent = horas;
    document.getElementById('minutes').textContent = minutos;
    document.getElementById('seconds').textContent = segundos;
    
    // Si la cuenta regresiva ha terminado
    if (diferencia < 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        document.querySelector('.countdown-section h2').textContent = '¡Es hoy!';
    }
}

// Actualizar la cuenta regresiva cada segundo
setInterval(actualizarCuentaRegresiva, 1000);

// Ejecutar inmediatamente al cargar la página
actualizarCuentaRegresiva();

// Funcionalidad de navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de aparición al hacer scroll
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.style.opacity = '1';
            entrada.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observar todas las secciones
document.querySelectorAll('section').forEach(seccion => {
    seccion.style.opacity = '0';
    seccion.style.transform = 'translateY(30px)';
    seccion.style.transition = 'all 0.6s ease-out';
    observador.observe(seccion);
});
