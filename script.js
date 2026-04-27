/* ============================================================
   SCRIPT.JS - LÓGICA DE LOGIN E MODAL
   ============================================================ */

/* SCRIPT DE LOGIN E MODAL - MICHELLY SANTOS */
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // Abre o modal
    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    // Fecha o modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    // Fecha se clicar fora
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// FUNÇÃO DE LOGIN
function executarLogin() {
    console.log("Tentando logar..."); // Isso ajuda a ver se o botão funciona

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro: Campos não encontrados no HTML.");
        return;
    }

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 1. LOGIN ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // 2. LOGIN CLIENTE
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        window.location.href = "area-cliente.html?id=" + encontrou.id;
    } else {
        alert("Acesso negado! Verifique seus dados.");
    }
}