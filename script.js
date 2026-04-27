/* ============================================================
   SCRIPT.JS - LÓGICA DE LOGIN E MODAL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // Abre o modal ao clicar em "Login" no menu
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    // Fecha o modal ao clicar em "Cancelar"
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Fecha o modal ao clicar fora da caixa branca
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// FUNÇÃO DE LOGIN
function executarLogin() {
    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert("Erro técnico: Campos de login não encontrados no HTML.");
        return;
    }

    const usuarioDigitado = userField.value.trim();
    const senhaDigitada = passField.value.trim();

    if (usuarioDigitado === "" || senhaDigitada === "") {
        alert("Por favor, preencha o usuário e a senha.");
        return;
    }

    // 1. LOGIN DA MICHELLY (ADMIN)
    if (usuarioDigitado === "admin@michelly.com" && senhaDigitada === "123456") {
        // Redirecionamento SEM a barra inicial para funcionar no GitHub
        window.location.href = "adm.html";
        return;
    }

    // 2. LOGIN DOS CLIENTES (BUSCA NO BANCO LOCAL)
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    const clienteEncontrado = clientesGuardados.find(cliente => 
        cliente.pasta.toLowerCase() === usuarioDigitado.toLowerCase() && 
        cliente.id.toString() === senhaDigitada
    );

    if (clienteEncontrado) {
        // Se encontrou, leva para a área do cliente
        window.location.href = "area-cliente.html?id=" + clienteEncontrado.id;
    } else {
        alert("Acesso negado! Verifique seu usuário (pasta) e senha (ID).");
    }
}