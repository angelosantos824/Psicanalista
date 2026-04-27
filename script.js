// Remove o alerta de teste para não incomodar mais
console.log("Sistema de login ativo.");

// 1. FUNÇÃO DE LOGIN
function executarLogin(event) {
    // ESTA LINHA É A MAIS IMPORTANTE: Impede a página de recarregar
    if (event) event.preventDefault();

    console.log("Iniciando validação de login...");

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro: Campos de login não encontrados.");
        return false;
    }

    const user = userField.value.trim();
    const pass = passField.value.trim();

// 1. LOGIN ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        console.log("Admin detectado. Redirecionando...");
        window.location.replace("adm.html"); // Replace é mais forte que o href
        return false;
    }

    // 2. LOGIN CLIENTE
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        window.location.replace("area-cliente.html?id=" + encontrou.id);
    } else {
        alert("Usuário ou senha incorretos!");
    }
    
    return false;
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