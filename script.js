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

function enviarWhatsApp(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Captura os valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const interesse = document.getElementById('interesse').value;
    const mensagem = document.getElementById('mensagem').value || "Não informada";

    // Seu número de WhatsApp (com código do país e sem espaços/traços)
    // Exemplo para Portugal: +351910377246
    const seuNumero = "+351910377246"; 

    // Monta a mensagem organizada com emojis e quebras de linha (%0A)
    const texto = 
        "Olá, Michelly! Tenho um novo pedido de contato pelo site:" + "%0A%0A" +
        "👤 *NOME:* " + nome + "%0A" +
        "📧 *E-MAIL:* " + email + "%0A" +
        "💼 *INTERESSE:* " + interesse + "%0A" +
        "💬 *MENSAGEM:* " + mensagem + "%0A%0A" +
        "---" + "%0A" +
        "viva sua análise.";

    // Cria o link final
    const url = "https://wa.me/" + seuNumero + "?text=" + encodeURIComponent(texto);

    // Abre em uma nova aba
    window.open(url, '_blank');
}