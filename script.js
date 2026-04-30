/* ==========================================
   SISTEMA DE LOGIN UNIFICADO - MICHELLY SANTOS
   ========================================== */

async function executarLogin(event) {
    if (event) event.preventDefault();

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');
    const user = userField.value.trim();
    const pass = passField.value.trim();

    console.log("🚀 Iniciando tentativa de login para:", user);

    try {
        // --- PASSO 1: LOGIN DE ADMIN (AUTENTICAÇÃO OFICIAL) ---
        const { data: authData, error: authError } = await _supabase.auth.signInWithPassword({
            email: user,
            password: pass,
        });

        if (!authError && authData.user) {
            console.log("✅ Admin reconhecido pelo Supabase Auth!");
            window.location.replace("adm.html");
            return; // PARA O CÓDIGO AQUI
        }

        // --- PASSO 2: LOGIN DE PACIENTE (TABELA SQL) ---
        // Só chega aqui se o Passo 1 falhar
        console.log("🔍 Não é Admin. Buscando na tabela de pacientes...");
        
        const { data: paciente, error: dbError } = await _supabase
            .from('pacientes')
            .select('*')
            .eq('email', user)
            .single();

        if (paciente && paciente.senha_acesso === pass) {
            console.log("✅ Paciente reconhecido na tabela SQL!");
            window.location.replace("area-cliente.html?id=" + paciente.id);
            return;
        }

        // --- PASSO 3: FALHA TOTAL ---
        alert("Acesso Negado! Verifique seu e-mail e senha.");

    } catch (err) {
        console.error("❌ Erro inesperado:", err);
        alert("Erro técnico ao conectar. Verifique o console.");
    }
}

/* ==========================================
   MODAIS E POPUPS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');
    const popup = document.getElementById('popupConvite');
    const btnFecharPopup = document.getElementById('fecharPopup');

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = "flex"; 
        });
    }

    if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";

    const jaViuPopup = sessionStorage.getItem('popupExibido');
    if (popup && !jaViuPopup) {
        setTimeout(() => popup.style.display = 'flex', 3000);
    }

    if (btnFecharPopup) {
        btnFecharPopup.addEventListener('click', () => {
            popup.style.display = 'none';
            sessionStorage.setItem('popupExibido', 'true');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = "none";
        if (e.target === popup) {
            popup.style.display = 'none';
            sessionStorage.setItem('popupExibido', 'true');
        }
    });
});