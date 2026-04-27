/* ==========================================
   SISTEMA DE LOGIN BLINDADO - MICHELLY SANTOS
   ========================================== */

function executarLogin(event) {
    // 1. TRAVA TOTAL: Impede o navegador de recarregar ou seguir links
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    console.log("Validando login...");

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 2. VERIFICAÇÃO ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        console.log("Acesso Admin confirmado!");
        // O './' garante que ele procure o arquivo na mesma pasta atual
        window.location.assign("./adm.html");
        return false; 
    }

    // 3. VERIFICAÇÃO CLIENTE
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        window.location.assign("./area-cliente.html?id=" + encontrou.id);
    } else {
        alert("Acesso Negado! Usuário ou senha incorretos.");
    }

    return false; // Reforço para não recarregar
}

// Inicialização do Modal
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