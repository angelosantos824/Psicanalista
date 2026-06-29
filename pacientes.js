async function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    if (!tbody) return;

    try {
        const { data: pacientes, error } = await _supabase
            .from('pacientes')
            .select('*')
            .order('nome', { ascending: true });

        if (error) throw error;

        tbody.textContent = '';

        if (!pacientes || pacientes.length === 0) {
            criarMensagemTabela(tbody, 3, 'Nenhum paciente cadastrado no banco.');
            return;
        }

        pacientes.forEach((paciente) => {
            const tr = document.createElement('tr');

            const senhaTd = document.createElement('td');
            const senhaSpan = document.createElement('span');
            senhaSpan.className = 'id-label';
            senhaSpan.textContent = '#' + (paciente.senha_acesso || paciente.codigo_acesso || '---');
            senhaTd.appendChild(senhaSpan);

            const nomeTd = document.createElement('td');
            nomeTd.style.fontWeight = 'bold';
            nomeTd.style.color = '#d4a373';
            nomeTd.textContent = paciente.nome || 'Sem nome';

            const acoesTd = document.createElement('td');
            const link = document.createElement('a');
            link.href = 'detalhes-cliente.html?id=' + encodeURIComponent(paciente.id);
            link.style.background = '#7b8f80';
            link.style.color = 'white';
            link.style.textDecoration = 'none';
            link.style.padding = '6px 12px';
            link.style.borderRadius = '6px';
            link.style.fontSize = '12px';
            link.textContent = 'Prontuario';

            const botaoExcluir = document.createElement('button');
            botaoExcluir.className = 'btn-excluir';
            botaoExcluir.style.padding = '6px 12px';
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', () => excluirPaciente(paciente.id));

            acoesTd.append(link, document.createTextNode(' '), botaoExcluir);
            tr.append(senhaTd, nomeTd, acoesTd);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar pacientes:', err);
        alert('Nao foi possivel carregar a lista de pacientes.');
    }
}

async function salvarPacienteSQL() {
    const nomeInput = document.getElementById('nomeInput');
    const emailInput = document.getElementById('emailInput');
    const nome = nomeInput?.value.trim();
    const email = emailInput?.value.trim();

    if (!nome || nome.length < 2) {
        alert('Informe o nome completo do paciente.');
        return;
    }

    if (!emailValido(email)) {
        alert('Informe um e-mail valido para o paciente.');
        return;
    }

    try {
        const { data: sessionData, error: sessionError } = await _supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const senha = Math.floor(1000 + Math.random() * 9000).toString();
        const payload = {
            nome,
            email,
            senha_acesso: senha,
            codigo_acesso: senha,
            financeiro: [],
            notas: ''
        };

        if (sessionData?.session?.user?.id) {
            payload.user_id = sessionData.session.user.id;
        }

        const { error } = await _supabase.from('pacientes').insert([payload]);
        if (error) throw error;

        nomeInput.value = '';
        emailInput.value = '';
        alert('Paciente cadastrado com sucesso. Senha de acesso: ' + senha);
        renderTable();
    } catch (err) {
        console.error('Erro ao salvar paciente:', err);
        alert('Erro ao salvar paciente. Verifique os dados e tente novamente.');
    }
}

async function excluirPaciente(id) {
    if (!id || !confirm('Deseja realmente excluir este paciente?')) return;

    try {
        const { error } = await _supabase.from('pacientes').delete().eq('id', id);
        if (error) throw error;
        renderTable();
    } catch (err) {
        console.error('Erro ao excluir paciente:', err);
        alert('Erro ao excluir paciente.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (document.getElementById('tabelaClientes')) {
        const acessoOk = await validarAcessoAdmin();
        if (acessoOk) renderTable();
    }
});
