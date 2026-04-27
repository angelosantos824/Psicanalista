/* ==========================================
   SISTEMA DE LOGIN BLINDADO - MICHELLY SANTOS
   ========================================== */

function executarLogin(event) {
    // 1. TRAVA TOTAL
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
        // Trocamos o assign por replace para evitar o "flash" de retorno
        location.replace("adm.html"); 
        return false; 
    }

    // 3. VERIFICAÇÃO CLIENTE
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        // Trocamos aqui também para garantir a entrada do cliente
        location.replace("area-cliente.html?id=" + encontrou.id);
    } else {
        alert("Acesso Negado! Usuário ou senha incorretos.");
    }

    return false;
}

// Inicialização do Modal (Mantenha como está, está perfeito)
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