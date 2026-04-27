function executarLogin(event) {
    if (event) {
        event.preventDefault(); // Trava o recarregamento
        event.stopPropagation(); // Evita que o clique "suba" para outros elementos
    }

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');
    
    const user = userField.value.trim();
    const pass = passField.value.trim();

    // LOGIN ADMIN
    if (user === "admin@michelly.com" && pass === "123456") {
        console.log("Admin OK. Redirecionando...");
        // Usamos ./ para dizer "nesta mesma pasta"
        window.location.replace("./adm.html"); 
        return false;
    }

    // LOGIN CLIENTE
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const encontrou = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (encontrou) {
        window.location.replace("./area-cliente.html?id=" + encontrou.id);
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