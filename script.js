function handleLogin(event) {
    event.preventDefault();
    const usuario = document.getElementById('usuarioInput').value;
    if(usuario.trim() !== "") {
        // Ocultar login y mostrar panel general
        document.getElementById('view-login').classList.remove('active');
        document.getElementById('view-dashboard').classList.add('active');
    }
}

function switchTab(tabId) {
    // Ocultar todas las pestañas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Quitar clase activa de los enlaces del menú
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    // Mostrar la pestaña seleccionada
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // Activar visualmente el botón del menú correspondiente
    event.target.classList.add('active');
}

function logout() {
    // Volver a la pantalla de login
    document.getElementById('view-dashboard').classList.remove('active');
    document.getElementById('view-login').classList.add('active');
    document.getElementById('loginForm').reset();
}