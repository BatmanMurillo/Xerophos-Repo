// Agregar el evento para abrir/cerrar el menú lateral
const menuButton = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
const body = document.body;
//example

// Agregar un evento para mostrar/ocultar el menú
menuButton.addEventListener("click", function() {
    menu.classList.toggle("show"); // Alterna la clase 'show' para mostrar/ocultar el menú
    body.classList.toggle("menu-active"); // Activa/desactiva el desplazamiento del contenido
});
