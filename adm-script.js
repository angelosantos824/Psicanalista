document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // 1. Controle do Modal
    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };
});

// 2. FUNÇÃO DE LOGIN (CHAMADA PELO BOTÃO 'ENTRAR')
function executarLogin() {
    // Busca os campos de texto
    const campoUsuario = document.getElementById('loginUser');
    const campoSenha = document.getElementById('loginPass');

    if (!campoUsuario || !campoSenha) {
        alert("Erro: Campos de login não encontrados na página.");
        return;
    }

    const usuario = campoUsuario.value.trim();
    const senha = campoSenha.value.trim();

    // Verificação de Administrador (Michelly)
    if (usuario === "admin@michelly.com" && senha === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // Verificação de Cliente (Buscando no banco de dados local)
    const clientesGuardados = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    const clienteEncontrado = clientesGuardados.find(c => 
        c.pasta.toLowerCase() === usuario.toLowerCase() && 
        c.id.toString() === senha
    );

    if (clienteEncontrado) {
        // Redireciona para a área do cliente enviando o ID dele na URL
        window.location.href = "area-cliente.html?id=" + clienteEncontrado.id;
    } else {
        alert("Acesso Negado! Verifique seu usuário (pasta) e sua senha (ID).");
    }
}