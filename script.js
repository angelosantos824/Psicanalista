/* ==========================================
   SISTEMA DE LOGIN UNIFICADO - MICHELLY SANTOS
   ========================================== */

async function executarLogin(event) {
    // 1. Previne o recarregamento da página
    if (event) event.preventDefault();

    console.log("🚀 Iniciando processo de login...");

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    // Captura valores e remove espaços extras
    const user = userField.value.trim();
    const pass = passField.value.trim();

    if (!user || !pass) {
        alert("Por favor, preencha todos os campos.");
        return false;
    }

    try {
        // --- PASSO 1: TENTAR LOGIN DE ADMIN (Supabase Auth) ---
        // Consulta os usuários na aba "Authentication" do Supabase
        const { data, error: adminError } = await _supabase.auth.signInWithPassword({
            email: user,
            password: pass,
        });

        // Se o login de Admin funcionar, redireciona e para a execução
        if (!adminError && data.user) {
            console.log("✅ Acesso Admin confirmado via Auth!");
            location.replace("adm.html");
            return; 
        }

        // --- PASSO 2: TENTAR LOGIN DE PACIENTE (Tabela SQL) ---
        // Se o código chegou aqui, não é Admin ou a senha de Admin está errada.
        console.log("🔍 Buscando na tabela de pacientes...");
        
        const { data: paciente, error: dbError } = await _supabase
            .from('pacientes')
            .select('*')
            .eq('email', user)
            .single();

        // Verifica se o paciente existe e se a senha manual na tabela bate
        if (paciente && paciente.senha_acesso === pass) {
            console.log("✅ Acesso Paciente confirmado!");
            location.replace("area-cliente.html?id=" + paciente.id);
            return;
        }

        // --- PASSO 3: SE CHEGOU AQUI, NADA FUNCIONOU ---
        console.warn("❌ Falha no login: Credenciais não encontradas.");
        alert("Acesso Negado! Verifique seu e-mail e senha.");

    } catch (err) {
        console.error("Erro inesperado na conexão:", err);
        alert("Erro ao conectar com o banco de dados. Verifique o console.");
    }
}

/* ==========================================
   CONTROLE DOS MODAIS E POPUPS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');
    const popup = document.getElementById('popupConvite');
    const btnFecharPopup = document.getElementById('fecharPopup');

    // --- Lógica do Modal de Login ---
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Abrindo modal de login...");
            if (modal) modal.style.display = "flex"; 
        });
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (modal) modal.style.display = "none";
        };
    }

    // --- Lógica do Popup de Convite ---
    const jaViuPopup = sessionStorage.getItem('popupExibido');

    if (popup && !jaViuPopup) {
        setTimeout(() => {
            popup.style.display = 'flex';
        }, 3000);
    }

    if (btnFecharPopup) {
        btnFecharPopup.addEventListener('click', () => {
            if (popup) popup.style.display = 'none';
            sessionStorage.setItem('popupExibido', 'true');
        });
    }

    // --- Fechar elementos ao clicar fora ---
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
        if (e.target === popup) {
            popup.style.display = 'none';
            sessionStorage.setItem('popupExibido', 'true');
        }
    });

    // --- Suporte para links de rodapé ---
    const footerLink = document.querySelector('a[onclick*="loginModal"]');
    if (footerLink) {
        footerLink.removeAttribute('onclick'); 
        footerLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) modal.style.display = "flex";
        });
    }
});