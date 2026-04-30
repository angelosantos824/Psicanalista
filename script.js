/* ==========================================
   SISTEMA DE LOGIN SQL - MICHELLY SANTOS
   ========================================== */

async function executarLogin(event) {
    // 1. Previne o recarregamento da página
    if (event) {
        event.preventDefault();
    }

    console.log("🚀 Validando login no Supabase...");

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    const user = userField.value.trim();
    const pass = passField.value.trim();

    // 2. VERIFICAÇÃO ADMIN (Acesso rápido)
    if (user === "admin@michellysantospsi.com" && pass === "181005") {
        console.log("✅ Acesso Admin confirmado!");
        location.replace("adm.html"); 
        return false; 
    }

    // 3. VERIFICAÇÃO CLIENTE NO SUPABASE (SQL)
    try {
        // Buscamos o paciente pelo e-mail
        const { data: paciente, error } = await _supabase
            .from('pacientes')
            .select('*')
            .eq('email', user)
            .single();

        if (error || !paciente) {
            alert("Acesso Negado! Usuário não encontrado.");
            return false;
        }

        // Verifica se a senha do banco bate com a digitada
        if (paciente.senha_acesso === pass) {
            console.log("✅ Acesso Paciente confirmado!");
            // Redireciona para a área do cliente passando o ID do Supabase
            location.replace("area-cliente.html?id=" + paciente.id);
        } else {
            alert("Senha incorreta!");
        }

    } catch (err) {
        console.error("Erro na conexão:", err);
        alert("Erro ao conectar com o banco de dados.");
    }

    return false;
}

// Inicialização do Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');

    // Abre o modal
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Abrindo modal...");
            // Usamos 'flex' para garantir que centralize conforme o CSS moderno
            modal.style.display = "flex"; 
        });
    }

    // Fecha o modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        };
    }

    // Fecha se clicar fora da caixa branca
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
});

const footerLink = document.querySelector('a[onclick*="loginModal"]');
    if(footerLink) {
        footerLink.removeAttribute('onclick'); // Remove o comando antigo do HTML
        footerLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById('popupConvite');
    const btnFechar = document.getElementById('fecharPopup');

    // 1. Verifica se o usuário já viu o popup nesta visita
    const jaViu = sessionStorage.getItem('popupExibido');

    if (!jaViu) {
        // 2. Exibe o popup após 3 segundos de navegação
        setTimeout(() => {
            popup.style.display = 'flex';
        }, 3000);
    }

    // 3. Função para fechar o popup
    btnFechar.addEventListener('click', () => {
        popup.style.display = 'none';
        sessionStorage.setItem('popupExibido', 'true');
    });

    // 4. Fechar se clicar fora do conteúdo branco
    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            sessionStorage.setItem('popupExibido', 'true');
        }
    });
});