// Inicializar EmailJS
emailjs.init({
    publicKey: "imgrqXcpU3XyWFyIs"
});

// Elementos
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");
const boton = document.getElementById("btnEnviar");
const textoBoton = boton.querySelector("span:first-child");
const flecha = boton.querySelector(".arrow");
const tarjeta = document.querySelector(".login-card");
const inputEmail = document.getElementById("email");
const contenedorBrasas = document.querySelector(".embers");

const textoOriginal = textoBoton.textContent;
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const tieneMouse = window.matchMedia("(pointer: fine)").matches;

/* =========================
   MÁS BRASAS (aleatorias)
========================= */

if (!sinMovimiento) {
    for (let i = 0; i < 22; i++) {
        const brasa = document.createElement("span");
        const tam = 2 + Math.random() * 5;

        brasa.className = "spark";
        brasa.style.left = Math.random() * 100 + "%";
        brasa.style.width = tam + "px";
        brasa.style.height = tam + "px";
        brasa.style.animationDuration = 5 + Math.random() * 6 + "s";
        brasa.style.animationDelay = -Math.random() * 10 + "s";
        brasa.style.setProperty("--sway", (Math.random() * 80 - 40) + "px");

        contenedorBrasas.appendChild(brasa);
    }
}

/* =========================
   TARJETA QUE SIGUE AL MOUSE
========================= */

// Cuando termina la animación de entrada, activamos la inclinación
setTimeout(() => tarjeta.classList.add("ready"), 1300);

if (tieneMouse && !sinMovimiento) {
    document.addEventListener("mousemove", (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;

        tarjeta.style.setProperty("--ry", (x * 6) + "deg");
        tarjeta.style.setProperty("--rx", (-y * 6) + "deg");
    });

    tarjeta.addEventListener("mousemove", (e) => {
        const r = tarjeta.getBoundingClientRect();
        tarjeta.style.setProperty("--mx", (e.clientX - r.left) + "px");
        tarjeta.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
}

/* =========================
   PLACEHOLDER QUE SE ESCRIBE SOLO
========================= */

const ejemplos = [
    "nombre@correo.com",
    "tu.correo@gmail.com",
    "parrilla@correo.com"
];

if (!sinMovimiento) {
    let i = 0;
    let j = 0;
    let borrando = false;

    const escribir = () => {
        // Si el usuario está escribiendo, dejamos el ejemplo quieto
        if (document.activeElement === inputEmail || inputEmail.value) {
            inputEmail.placeholder = ejemplos[0];
            i = 0; j = 0; borrando = false;
            return setTimeout(escribir, 800);
        }

        const texto = ejemplos[i];

        if (!borrando) {
            j++;
            if (j === texto.length) {
                borrando = true;
                inputEmail.placeholder = texto;
                return setTimeout(escribir, 1800);
            }
        } else {
            j--;
            if (j === 0) {
                borrando = false;
                i = (i + 1) % ejemplos.length;
            }
        }

        inputEmail.placeholder = texto.slice(0, j) || " ";
        setTimeout(escribir, borrando ? 35 : 80);
    };

    setTimeout(escribir, 2500);
}

/* =========================
   EFECTOS DEL BOTÓN
========================= */

// Onda al hacer clic
boton.addEventListener("click", (e) => {
    if (sinMovimiento || boton.disabled) return;

    const r = boton.getBoundingClientRect();
    const tam = Math.max(r.width, r.height) * 2;
    const onda = document.createElement("span");

    onda.className = "ripple";
    onda.style.width = onda.style.height = tam + "px";
    onda.style.left = (e.clientX - r.left - tam / 2) + "px";
    onda.style.top = (e.clientY - r.top - tam / 2) + "px";

    boton.appendChild(onda);
    setTimeout(() => onda.remove(), 700);
});

// Chispas al suscribirse
function lanzarChispas() {
    if (sinMovimiento) return;

    const r = boton.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    for (let i = 0; i < 28; i++) {
        const chispa = document.createElement("span");
        const angulo = Math.random() * Math.PI * 2;
        const dist = 70 + Math.random() * 150;

        chispa.className = "chispa";
        chispa.style.left = cx + "px";
        chispa.style.top = cy + "px";
        chispa.style.setProperty("--dx", Math.cos(angulo) * dist + "px");
        chispa.style.setProperty("--dy", (Math.sin(angulo) * dist - 40) + "px");

        document.body.appendChild(chispa);
        setTimeout(() => chispa.remove(), 1200);
    }
}

function animarTarjeta(clase) {
    tarjeta.classList.remove("celebra", "error-shake");
    void tarjeta.offsetWidth; // reinicia la animación
    tarjeta.classList.add(clase);
    setTimeout(() => tarjeta.classList.remove(clase), 1300);
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "message show" + (tipo ? " " + tipo : "");
}

function restaurarBoton() {
    boton.disabled = false;
    boton.classList.remove("cargando", "exito");
    textoBoton.textContent = textoOriginal;
    flecha.textContent = "↗";
}

/* =========================
   ENVÍO DEL FORMULARIO
========================= */

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    if (boton.disabled) return;

    // Estado: enviando
    boton.disabled = true;
    boton.classList.add("cargando");
    textoBoton.textContent = "ENVIANDO...";
    flecha.textContent = "✦";
    mostrarMensaje("Encendiendo las brasas...", "");

    // Enviar los datos a EmailJS
    emailjs.sendForm(
        "service_qtfb30q",
        "template_vqzslv8",
        formulario
    )
    .then(function() {

        boton.classList.remove("cargando");
        boton.classList.add("exito");
        textoBoton.textContent = "¡BIENVENIDO A LA MESA!";
        flecha.textContent = "✓";

        mostrarMensaje("¡Suscripción realizada correctamente! Revisa tu correo.", "");
        animarTarjeta("celebra");
        lanzarChispas();

        formulario.reset();

        setTimeout(restaurarBoton, 4000);

    })
    .catch(function(error) {

        restaurarBoton();
        mostrarMensaje("No se pudo enviar el correo. Intenta nuevamente.", "error");
        animarTarjeta("error-shake");

        console.error("Error:", error);

    });

});