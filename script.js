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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Controle do Modal de Login (Abrir e Fechar)
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
        closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }

    // 2. Lógica do Formulário de Contato (Se existir na página)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById('status');
            status.innerText = "Enviando...";
            setTimeout(() => {
                status.innerText = "Obrigado! Michelly recebeu sua mensagem.";
                status.style.color = "green";
                contactForm.reset();
            }, 1500);
        });
    }
});

// 3. FUNÇÃO DE LOGIN ÚNICA (Fora do DOMContentLoaded para ser acessível pelo onclick)
function executarLogin() {
    // Pega os elementos do HTML
    const campoUsuario = document.getElementById('loginUser');
    const campoSenha = document.getElementById('loginPass');

    if (!campoUsuario || !campoSenha) {
        console.error("Erro: Campos de login não encontrados no HTML.");
        return;
    }

    const user = campoUsuario.value.trim();
    const pass = campoSenha.value.trim();

    console.log("Tentando login com:", user); // Para ajudar no seu teste

    // VERIFICAÇÃO ADM
    if (user === "admin@michelly.com" && pass === "123456") {
        console.log("Login ADM aprovado!");
        window.location.href = "adm.html";
        return;
    }

    // VERIFICAÇÃO CLIENTE
    let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    
    let clienteEncontrado = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (clienteEncontrado) {
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        alert("Acesso negado! Verifique seu usuário (nome da pasta) e senha (ID único).");
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