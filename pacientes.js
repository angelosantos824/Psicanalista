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
            acoesTd.className = 'acoes-paciente';

            const link = document.createElement('a');
            link.href = 'detalhes-cliente.html?id=' + encodeURIComponent(paciente.id);
            link.className = 'btn-acao-admin btn-acao-admin-prontuario';
            link.textContent = 'Prontuario';

            const botaoRestaurar = document.createElement('button');
            botaoRestaurar.className = 'btn-acao-admin btn-acao-admin-senha';
            botaoRestaurar.type = 'button';
            botaoRestaurar.textContent = 'Restaurar senha';
            botaoRestaurar.addEventListener('click', () => restaurarSenhaPaciente(paciente));

            const botaoExcluir = document.createElement('button');
            botaoExcluir.className = 'btn-acao-admin btn-excluir';
            botaoExcluir.type = 'button';
            botaoExcluir.textContent = 'Excluir';
            botaoExcluir.addEventListener('click', () => excluirPaciente(paciente.id));

            acoesTd.append(link, botaoRestaurar, botaoExcluir);
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
        mostrarToastAcesso('Informe o nome completo do paciente.');
        return;
    }

    if (!emailValido(email)) {
        mostrarToastAcesso('Informe um e-mail valido para o paciente.');
        return;
    }

    try {
        const dadosAcesso = await criarPacienteComAcesso({ nome, email });

        nomeInput.value = '';
        emailInput.value = '';
        mostrarModalAcesso(dadosAcesso);
        renderTable();
        return dadosAcesso;
    } catch (err) {
        console.error('Erro ao salvar paciente:', err);
        mostrarToastAcesso('Erro ao salvar paciente. Verifique os dados e tente novamente.');
    }
}

async function criarPacienteComAcesso({ nome, email, telefone = null, notas = '' }) {
    const { data: sessionData, error: sessionError } = await _supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const senha = Math.floor(1000 + Math.random() * 9000).toString();
    const payload = {
        nome,
        email,
        senha_acesso: senha,
        codigo_acesso: senha,
        financeiro: [],
        notas,
        telefone
    };

    if (sessionData?.session?.user?.id) {
        payload.user_id = sessionData.session.user.id;
    }

    const { error } = await _supabase.from('pacientes').insert([payload]);
    if (error) throw error;

    return { nome, email, senha };
}

function formatarSolicitacaoNotas(solicitacao) {
    const partes = [
        'Pre-cadastro recebido pelo formulario do site.',
        `Interesse: ${solicitacao.interesse || 'Nao informado'}`,
        `Telefone: ${solicitacao.telefone || 'Nao informado'}`,
        `Mensagem: ${solicitacao.mensagem || 'Nao informada'}`
    ];

    return partes.join('\n');
}

async function renderSolicitacoesAtendimento() {
    const tbody = document.getElementById('tabelaSolicitacoesAtendimento');
    if (!tbody) return;

    try {
        const { data: solicitacoes, error } = await _supabase
            .from('solicitacoes_atendimento')
            .select('*')
            .eq('status', 'pendente')
            .order('criado_em', { ascending: false });

        if (error) throw error;

        tbody.textContent = '';

        if (!solicitacoes || solicitacoes.length === 0) {
            criarMensagemTabela(tbody, 6, 'Nenhuma solicitacao pendente.');
            return;
        }

        solicitacoes.forEach((solicitacao) => {
            const tr = document.createElement('tr');
            const data = solicitacao.criado_em
                ? new Date(solicitacao.criado_em).toLocaleDateString('pt-BR')
                : '---';

            tr.appendChild(criarCelula(data));
            tr.appendChild(criarCelula(solicitacao.nome || 'Sem nome'));
            tr.appendChild(criarCelula(solicitacao.email || '---'));
            tr.appendChild(criarCelula(solicitacao.telefone || '---'));
            tr.appendChild(criarCelula(solicitacao.interesse || '---'));

            const acoesTd = document.createElement('td');
            acoesTd.className = 'acoes-paciente';

            const btnAutorizar = document.createElement('button');
            btnAutorizar.className = 'btn-acao-admin btn-acao-admin-prontuario';
            btnAutorizar.type = 'button';
            btnAutorizar.textContent = 'Autorizar';
            btnAutorizar.addEventListener('click', () => autorizarSolicitacaoAtendimento(solicitacao));

            const btnPreencher = document.createElement('button');
            btnPreencher.className = 'btn-acao-admin btn-acao-admin-senha';
            btnPreencher.type = 'button';
            btnPreencher.textContent = 'Preencher cadastro';
            btnPreencher.addEventListener('click', () => preencherCadastroComSolicitacao(solicitacao));

            const btnArquivar = document.createElement('button');
            btnArquivar.className = 'btn-acao-admin btn-excluir';
            btnArquivar.type = 'button';
            btnArquivar.textContent = 'Arquivar';
            btnArquivar.addEventListener('click', () => atualizarStatusSolicitacao(solicitacao.id, 'arquivada'));

            acoesTd.append(btnAutorizar, btnPreencher, btnArquivar);
            tr.appendChild(acoesTd);
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error('Erro ao carregar solicitacoes:', err);
        criarMensagemTabela(tbody, 6, 'Nao foi possivel carregar as solicitacoes. Verifique a tabela solicitacoes_atendimento.');
    }
}

function preencherCadastroComSolicitacao(solicitacao) {
    const nomeInput = document.getElementById('nomeInput');
    const emailInput = document.getElementById('emailInput');

    if (nomeInput) nomeInput.value = solicitacao.nome || '';
    if (emailInput) emailInput.value = solicitacao.email || '';

    mostrarToastAcesso('Cadastro preenchido com os dados da solicitacao.');
}

async function atualizarStatusSolicitacao(id, status) {
    if (!id) return;

    try {
        const { error } = await _supabase
            .from('solicitacoes_atendimento')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        renderSolicitacoesAtendimento();
    } catch (err) {
        console.error('Erro ao atualizar solicitacao:', err);
        mostrarToastAcesso('Erro ao atualizar solicitacao.');
    }
}

async function autorizarSolicitacaoAtendimento(solicitacao) {
    if (!solicitacao?.id) return;

    const nome = solicitacao.nome || '';
    const email = solicitacao.email || '';

    if (!nome || !emailValido(email)) {
        mostrarToastAcesso('Solicitacao sem nome ou e-mail valido.');
        return;
    }

    if (!confirm(`Autorizar acesso para ${nome}?`)) return;

    try {
        const dadosAcesso = await criarPacienteComAcesso({
            nome,
            email,
            telefone: solicitacao.telefone || null,
            notas: formatarSolicitacaoNotas(solicitacao)
        });

        const { error } = await _supabase
            .from('solicitacoes_atendimento')
            .update({ status: 'autorizada' })
            .eq('id', solicitacao.id);

        if (error) throw error;

        mostrarModalAcesso(dadosAcesso);
        renderSolicitacoesAtendimento();
        renderTable();
        return dadosAcesso;
    } catch (err) {
        console.error('Erro ao autorizar solicitacao:', err);
        mostrarToastAcesso('Erro ao autorizar solicitacao. Verifique os dados e tente novamente.');
    }
}

async function restaurarSenhaPaciente(paciente) {
    if (!paciente?.id) return;

    const nome = paciente.nome || 'Paciente';
    const email = paciente.email || '';

    if (!confirm(`Deseja restaurar a senha de ${nome}?`)) return;

    try {
        const senha = Math.floor(1000 + Math.random() * 9000).toString();
        const { error } = await _supabase
            .from('pacientes')
            .update({
                senha_acesso: senha,
                codigo_acesso: senha
            })
            .eq('id', paciente.id);

        if (error) throw error;

        const dadosAcesso = { nome, email, senha };
        mostrarModalAcesso(dadosAcesso);
        renderTable();
        return dadosAcesso;
    } catch (err) {
        console.error('Erro ao restaurar senha do paciente:', err);
        mostrarToastAcesso('Erro ao restaurar senha. Tente novamente.');
    }
}

function montarMensagemAcesso({ nome, email, senha }) {
    return `Olá, ${nome}!

Seu acesso à Área do Paciente foi criado com sucesso.

Segue seus dados de acesso:

🌐 Site:
https://www.michellysantospsi.com

👤 Login:
${email}

🔑 Senha:
${senha}

Área do paciente:
https://www.michellysantospsi.com/area-cliente.html

No primeiro acesso recomendamos alterar sua senha.

Qualquer dúvida estou à disposição.

Atenciosamente,
Michelly Santos`;
}

function mostrarToastAcesso(mensagem) {
    let toast = document.getElementById('toastAcessoPaciente');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastAcessoPaciente';
        toast.className = 'acesso-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.textContent = mensagem;
    toast.classList.add('ativo');

    window.clearTimeout(toast._timeoutId);
    toast._timeoutId = window.setTimeout(() => {
        toast.classList.remove('ativo');
    }, 2400);
}

function fecharModalAcesso() {
    const modal = document.getElementById('modalAcessoPaciente');
    if (!modal) return;

    modal.classList.remove('ativo');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-acesso-aberto');
}

function criarModalAcesso() {
    const modal = document.createElement('div');
    modal.id = 'modalAcessoPaciente';
    modal.className = 'modal-acesso-overlay';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="modal-acesso-card" role="dialog" aria-modal="true" aria-labelledby="modalAcessoTitulo">
            <button class="modal-acesso-fechar" type="button" aria-label="Fechar modal">&times;</button>
            <div class="modal-acesso-header">
                <span class="modal-acesso-icone" aria-hidden="true">✓</span>
                <h2 id="modalAcessoTitulo">✅ Acesso criado com sucesso</h2>
            </div>

            <div class="modal-acesso-dados" aria-label="Dados de acesso do paciente">
                <article class="modal-acesso-info">
                    <span>Nome:</span>
                    <strong data-acesso-campo="nome"></strong>
                </article>
                <article class="modal-acesso-info">
                    <span>E-mail:</span>
                    <strong data-acesso-campo="email"></strong>
                </article>
                <article class="modal-acesso-info">
                    <span>Senha provisória:</span>
                    <strong data-acesso-campo="senha"></strong>
                </article>
                <article class="modal-acesso-info">
                    <span>Site:</span>
                    <a href="https://www.michellysantospsi.com" target="_blank" rel="noopener">https://www.michellysantospsi.com</a>
                </article>
                <article class="modal-acesso-info">
                    <span>Área do paciente:</span>
                    <a href="https://www.michellysantospsi.com/area-cliente.html" target="_blank" rel="noopener">https://www.michellysantospsi.com/area-cliente.html</a>
                </article>
            </div>

            <textarea class="modal-acesso-mensagem" readonly data-acesso-campo="mensagem"></textarea>

            <div class="modal-acesso-acoes">
                <button class="modal-acesso-btn modal-acesso-btn-primary" type="button" data-acesso-acao="copiar">📋 Copiar mensagem</button>
                <button class="modal-acesso-btn modal-acesso-btn-whatsapp" type="button" data-acesso-acao="whatsapp">💬 Enviar WhatsApp</button>
                <button class="modal-acesso-btn modal-acesso-btn-secondary" type="button" data-acesso-acao="fechar">Fechar</button>
            </div>
        </div>
    `;

    modal.addEventListener('click', (event) => {
        if (event.target === modal) fecharModalAcesso();
    });

    modal.querySelector('.modal-acesso-fechar').addEventListener('click', fecharModalAcesso);
    modal.querySelector('[data-acesso-acao="fechar"]').addEventListener('click', fecharModalAcesso);
    modal.querySelector('[data-acesso-acao="copiar"]').addEventListener('click', async () => {
        const mensagem = modal.querySelector('[data-acesso-campo="mensagem"]').value;
        await navigator.clipboard.writeText(mensagem);
        mostrarToastAcesso('Mensagem copiada.');
    });
    modal.querySelector('[data-acesso-acao="whatsapp"]').addEventListener('click', () => {
        const mensagem = modal.querySelector('[data-acesso-campo="mensagem"]').value;
        window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
    });

    document.body.appendChild(modal);
    return modal;
}

function mostrarModalAcesso(dados) {
    const modal = document.getElementById('modalAcessoPaciente') || criarModalAcesso();
    const mensagem = montarMensagemAcesso(dados);

    modal.querySelector('[data-acesso-campo="nome"]').textContent = dados.nome;
    modal.querySelector('[data-acesso-campo="email"]').textContent = dados.email;
    modal.querySelector('[data-acesso-campo="senha"]').textContent = dados.senha;
    modal.querySelector('[data-acesso-campo="mensagem"]').value = mensagem;

    modal.classList.add('ativo');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-acesso-aberto');
    modal.querySelector('[data-acesso-acao="copiar"]').focus();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') fecharModalAcesso();
});

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
        if (acessoOk) {
            renderTable();
            renderSolicitacoesAtendimento();
        }
    }
});
