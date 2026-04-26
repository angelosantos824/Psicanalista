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