/* ============================================================
   SCRIPT.JS - LÓGICA DE LOGIN E MODAL
   ============================================================ */

/* ==========================================
   SISTEMA DE LOGIN - MICHELLY SANTOS
   ========================================== */

// Força o reconhecimento da função mesmo em navegadores antigos
window.executarLogin = function() {
    console.log("Botão de login clicado!"); // Aparecerá no F12 se funcionar

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro: Campos de login não encontrados no sistema.");
        return;
    }

    const usuarioDigitado = userField.value.trim();
    const senhaDigitada = passField.value.trim();

    // 1. Verificação de Administrador
    if (usuarioDigitado === "admin@michelly.com" && senhaDigitada === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // 2. Verificação de Clientes (LocalStorage)
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    const clienteEncontrado = clientes.find(c => 
        c.pasta.toLowerCase() === usuarioDigitado.toLowerCase() && 
        c.id.toString() === senhaDigitada
    );

    if (clienteEncontrado) {
        window.location.href = "area-cliente.html?id=" + clienteEncontrado.id;
    } else {
        alert("Acesso negado! Verifique seu usuário (pasta) e senha (ID).");
    }
};

// Controle de abrir/fechar o Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const btnAbrir = document.getElementById('openLogin');
    const btnFechar = document.getElementById('closeLogin');

    if (btnAbrir) {
        btnAbrir.onclick = function(e) {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    if (btnFechar) {
        btnFechar.onclick = function() {
            modal.style.display = "none";
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});