// Remove o alerta de teste para não incomodar mais
console.log("Sistema de login ativo.");

// 1. FUNÇÃO DE LOGIN
function executarLogin() {
    // Captura os elementos
    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro: Campos de login não encontrados no HTML!");
        return;
    }

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // TESTE DE ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        // Redirecionamento relativo para o GitHub Pages
        window.location.href = "adm.html";
        return;
    }

    // TESTE DE CLIENTE
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const cliente = clientesGuardados.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (cliente) {
        window.location.href = "area-cliente.html?id=" + cliente.id;
    } else {
        alert("Usuário ou senha incorretos!\n\nVerifique se o usuário é o nome da sua pasta.");
    }
}

// 2. CONTROLE DO MODAL
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault(); // Impede de tentar abrir "login.html"
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});