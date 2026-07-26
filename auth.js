async function executarLogin(event) {
    if (event) event.preventDefault();

    const userField = document.getElementById('loginUser');
    const passField = document.getElementById('loginPass');

    if (!userField || !passField) {
        alert('Campos de login nao encontrados.');
        return;
    }

    const user = userField.value.trim();
    const pass = passField.value.trim();

    if (!emailValido(user) || !pass) {
        alert('Preencha um e-mail valido e a senha.');
        return;
    }

    try {
        const { data: authData, error: authError } = await _supabase.auth.signInWithPassword({
            email: user,
            password: pass
        });

        if (!authError && authData.user) {
            window.location.replace('adm.html');
            return;
        }

        const { data: paciente, error: dbError } = await _supabase
            .from('pacientes')
            .select('id,email,senha_acesso,codigo_acesso,anamnese_completa,anamnese')
            .eq('email', user)
            .single();

        if (!dbError && paciente && (paciente.senha_acesso === pass || paciente.codigo_acesso === pass)) {
            localStorage.setItem('paciente_id', paciente.id);
            const destino = paciente.anamnese_completa || paciente.anamnese
                ? 'area-cliente.html'
                : 'anamnese.html';
            window.location.replace(`${destino}?id=${encodeURIComponent(paciente.id)}`);
            return;
        }

        if (authError) console.error('Falha no login administrativo:', authError);
        if (dbError) console.error('Falha no login do paciente:', dbError);
        alert('Acesso negado. Verifique e-mail e senha.');
    } catch (err) {
        console.error('Erro no login:', err);
        alert('Erro tecnico ao conectar com o Supabase. Tente novamente em instantes.');
    }
}

async function validarAcessoAdmin() {
    try {
        const { data, error } = await _supabase.auth.getSession();

        if (error || !data.session) {
            if (error) console.error('Erro ao validar sessao administrativa:', error);
            alert('Sessao expirada. Faca login novamente.');
            window.location.replace('index.html');
            return false;
        }

        return true;
    } catch (err) {
        console.error('Erro ao validar acesso:', err);
        alert('Nao foi possivel validar seu acesso.');
        window.location.replace('index.html');
        return false;
    }
}

function deslogar() {
    localStorage.removeItem('paciente_id');
    window.location.href = 'index.html';
}

async function sairAdmin() {
    const { error } = await _supabase.auth.signOut();
    if (error) console.error('Erro ao sair:', error);
    window.location.href = 'index.html';
}
