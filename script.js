/* ============================================================
   SCRIPT.JS - LÓGICA DE LOGIN E MODAL
   ============================================================ */

// Garantir que o código rode após a página carregar
window.onload = function() {
    console.log("Script carregado com sucesso!");

    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // Abrir o modal
    if (openBtn) {
        openBtn.onclick = function(e) {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    // Fechar o modal
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }
};

// FUNÇÃO DE LOGIN - FORA DO ONLOAD PARA SER ACHADA PELO HTML
function executarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    console.log("Tentativa de login com:", user);

    // 1. ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // 2. CLIENTE
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const cliente = clientesGuardados.find(c => c.pasta === user && c.id.toString() === pass);

    if (cliente) {
        window.location.href = "area-cliente.html?id=" + cliente.id;
    } else {
        alert("Usuário ou senha incorretos!");
    }
}