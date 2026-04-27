// Verifica se o arquivo carregou
console.log("Script de Login Carregado!");

function executarLogin(event) {
    // 1. Para o recarregamento da página
    if (event) event.preventDefault();

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro: Campos de login não encontrados.");
        return false;
    }

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 2. LOGIN ADMIN (MICHELLY)
    if (user === "admin@michelly.com" && pass === "123456") {
        console.log("Login Admin aprovado.");
        window.location.href = "adm.html"; // No GitHub, usamos o nome direto do arquivo
        return false;
    }

    // 3. LOGIN CLIENTE (LOCALSTORAGE)
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        window.location.href = "area-cliente.html?id=" + encontrou.id;
    } else {
        alert("Usuário ou senha incorretos!");
    }
    return false;
}

// Controle do Modal (Abrir e Fechar)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
});