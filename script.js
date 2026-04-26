document.addEventListener('DOMContentLoaded', () => {
    // Lógica do Formulário de Contato
    const form = document.getElementById('contact-form');
    const status = document.getElementById('status');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            status.innerText = "Enviando...";
            setTimeout(() => {
                status.innerText = "Obrigado, Michelly recebeu sua mensagem. Em breve entrará em contato.";
                status.style.color = "green";
                form.reset();
            }, 1500);
        });
    }

    // Lógica do Modal de Login
    const loginBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');
    const modal = document.getElementById('loginModal');

    if (loginBtn) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }

    // REDIRECIONAMENTO DE TESTE: 
    // Para facilitar seu teste, se clicar em "Entrar" no modal, ele vai para o ADM
    const loginSubmit = document.querySelector('#loginModal button[type="submit"]');
    if (loginSubmit) {
        loginSubmit.onclick = (e) => {
            e.preventDefault();
            window.location.href = "adm.html";
        }
    }
});

// Adicione isso ao seu script.js na função de login
function validarLogin(email, senha) {
    // 1. Verificação de ADM
    if (email === "admin@michelly.com" && senha === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // 2. Verificação de Cliente
    let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    // O cliente usará o próprio ID ou Nome como senha (exemplo simples)
    let clienteEncontrado = clientes.find(c => c.pasta === email && c.id === senha);

    if (clienteEncontrado) {
        // Redireciona para a área do cliente passando o ID
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        alert("Usuário ou senha incorretos!");
    }
}

function executarLogin() {
    // Pegamos os valores que o usuário digitou
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    // Verificação do ADM
    if (user === "admin@michelly.com" && pass === "123456") {
        window.location.href = "adm.html";
        return; // Para a execução aqui
    }

    // Verificação de Clientes (Angelo, etc)
    let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    let clienteEncontrado = clientes.find(c => c.pasta === user && c.id === pass);

    if (clienteEncontrado) {
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        alert("Dados incorretos. Tente novamente ou solicite acesso via WhatsApp.");
    }
}

// Manter a lógica de abrir e fechar o modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        }
    }
});

function executarLogin() {
    // 1. Pega o que foi digitado nos campos
    const campoUsuario = document.getElementById('loginUser').value.trim();
    const campoSenha = document.getElementById('loginPass').value.trim();

    // 2. Verificação de Segurança da Michelly (ADM)
    if (campoUsuario === "admin@michelly.com" && campoSenha === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // 3. Busca na lista de clientes cadastrados
    let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    // Procura um cliente onde:
    // A PASTA seja igual ao usuário digitado
    // E o ID seja igual à senha digitada
    let clienteEncontrado = clientes.find(c => 
        c.pasta.toLowerCase() === campoUsuario.toLowerCase() && 
        c.id.toString() === campoSenha
    );

    if (clienteEncontrado) {
        // Se achou, leva para a área dele
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        // Se não achou, avisa o erro
        alert("Acesso negado! O Usuário deve ser o nome da sua pasta e a Senha o seu ID único.");
    }
}