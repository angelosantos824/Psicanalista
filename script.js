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

    // Fecha se clicar fora da caixa branca
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

// FUNÇÃO DE LOGIN ÚNICA
function executarLogin() {
    const campoU = document.getElementById('loginUser');
    const campoS = document.getElementById('loginPass');

    if (!campoU || !campoS) {
        alert("Erro: Campos de login não encontrados.");
        return;
    }

    const user = campoU.value.trim();
    const pass = campoS.value.trim();

    // 1. Verificação de ADM (Michelly)
    if (user === "admin@michelly.com" && pass === "123456") {
        // Redirecionamento relativo (sem a barra inicial) para funcionar no GitHub Pages
        window.location.href = "adm.html"; 
        return;
    }

    // 2. Verificação de Cliente
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const clienteEncontrado = clientesGuardados.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (clienteEncontrado) {
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        alert("Acesso negado! Usuário ou Senha incorretos.");
    }
}