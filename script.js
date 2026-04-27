document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // Abrir Modal
    if (openBtn) {
        openBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    // Fechar Modal
    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = "none";
    }

    // Fechar ao clicar fora
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    };

    // Form de Contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById('status');
            status.innerText = "Enviando...";
            setTimeout(() => {
                status.innerText = "Mensagem enviada com sucesso!";
                status.style.color = "green";
                contactForm.reset();
            }, 1500);
        });
    }
});

function executarLogin() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (!user || !pass) {
        alert("Preencha todos os campos.");
        return;
    }

    // Login ADM
    if (user === "admin@michelly.com" && pass === "123456") {
        window.location.href = "adm.html";
        return;
    }

    // Login Cliente
    const clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];
    const clienteEncontrado = clientes.find(c => 
        c.pasta.toLowerCase() === user.toLowerCase() && 
        c.id.toString() === pass
    );

    if (clienteEncontrado) {
        window.location.href = `area-cliente.html?id=${clienteEncontrado.id}`;
    } else {
        alert("Acesso negado! Verifique Usuário (nome da pasta) e Senha (ID).");
    }
}