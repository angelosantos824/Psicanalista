const paramsProntuario = new URLSearchParams(window.location.search);
const idCliente = paramsProntuario.get('id') || localStorage.getItem('paciente_id');
let notasEvolucaoOriginal = '';

function calcularIdadeAutomatico(dataNascimento) {
    const idadeInput = document.getElementById('idade');
    if (!idadeInput || !dataNascimento) return;

    const idade = calcularIdadeValor(dataNascimento);
    idadeInput.value = Number.isFinite(idade) && idade >= 0 ? idade : '';
}

function calcularIdadeValor(dataNascimento) {
    if (!dataNascimento) return null;

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade -= 1;
    }

    return Number.isFinite(idade) && idade >= 0 ? idade : null;
}

window.calcularIdadeAutomático = calcularIdadeAutomatico;
window.calcularIdadeAutomatico = calcularIdadeAutomatico;

function preencherValor(id, valor) {
    const element = document.getElementById(id);
    if (element) element.value = valor || '';
}

function atualizarIdentificacaoImpressao(paciente) {
    const identificacao = [
        paciente.nome || 'Paciente',
        paciente.email || 'E-mail nao informado',
        `Codigo: ${paciente.senha_acesso || paciente.codigo_acesso || '---'}`
    ].join(' | ');

    document.querySelectorAll('.print-paciente-identificacao').forEach((elemento) => {
        elemento.textContent = identificacao;
    });
}

function formatarDataHoraNota() {
    return new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function prepararNotasEvolucaoParaSalvar() {
    const campo = document.getElementById('notasEvolucao');
    const valorAtual = campo?.value.trim() || '';

    if (!valorAtual || valorAtual === notasEvolucaoOriginal.trim()) {
        return campo?.value || '';
    }

    const notasDatadas = `Nota de evolução registrada em ${formatarDataHoraNota()}\n${valorAtual}`;
    if (campo) campo.value = notasDatadas;
    notasEvolucaoOriginal = notasDatadas;
    return notasDatadas;
}

function renderAnamnese(container, anamnese) {
    container.textContent = '';

    if (!anamnese) {
        container.textContent = 'Nenhuma anamnese registrada.';
        return;
    }

    let dados = anamnese;
    if (typeof dados === 'string') {
        try {
            dados = JSON.parse(dados);
        } catch {
            container.textContent = dados;
            return;
        }
    }

    Object.entries(dados).forEach(([campo, valor]) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = campo.replaceAll('_', ' ') + ':';
        p.append(strong, document.createElement('br'), document.createTextNode(valor || '---'));
        container.appendChild(p);
    });
}

function atualizarProgresso7Dias(paciente) {
    const barraProgresso = document.getElementById('barraProgresso');
    const textoProgresso = document.getElementById('textoProgresso');
    if (!barraProgresso || !textoProgresso) return;

    let respostas7 = paciente.respostas_7dias || {};
    if (typeof respostas7 === 'string') {
        try {
            respostas7 = JSON.parse(respostas7);
        } catch {
            respostas7 = {};
        }
    }

    const diasRespondidos = Object.keys(respostas7).length;
    const percentual = Math.round((diasRespondidos / 7) * 100);
    barraProgresso.style.width = `${percentual}%`;
    textoProgresso.textContent = `${percentual}% concluido (${diasRespondidos}/7 dias)`;
}

function atualizarAgendaCliente(paciente) {
    const elementoData = document.getElementById('dataAgendada');
    const cardAviso = document.getElementById('cardAvisoAgenda');
    const fusoAviso = document.getElementById('fusoCliente');
    const sessaoOnlineArea = document.getElementById('sessaoOnlineArea');
    if (!elementoData || !cardAviso) return;

    if (!paciente.proximo_agendamento) {
        cardAviso.style.display = 'none';
        if (sessaoOnlineArea) sessaoOnlineArea.style.display = 'none';
        return;
    }

    const dataSessao = new Date(paciente.proximo_agendamento);
    const agora = new Date();
    if (Number.isNaN(dataSessao.getTime()) || dataSessao <= agora) {
        cardAviso.style.display = 'none';
        if (sessaoOnlineArea) sessaoOnlineArea.style.display = 'none';
        return;
    }

    cardAviso.style.display = 'block';
    if (sessaoOnlineArea) sessaoOnlineArea.style.display = 'block';

    const fuso = paciente.fuso_paciente || 'Europe/Lisbon';
    const dataFormatada = dataSessao.toLocaleDateString('pt-BR', {
        timeZone: fuso,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const horaFormatada = dataSessao.toLocaleTimeString('pt-BR', {
        timeZone: fuso,
        hour: '2-digit',
        minute: '2-digit'
    });

    elementoData.textContent = `${dataFormatada} as ${horaFormatada}`;
    if (fusoAviso) fusoAviso.style.display = 'block';
}

function bloquearCliqueAnamnese(event) {
    event.preventDefault();
}

function mostrarMensagemTrocaSenha(mensagem, tipo = 'erro') {
    const elemento = document.getElementById('mensagemTrocaSenha');
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.className = `mensagem-troca-senha ${tipo}`;
}

function mostrarMensagemContatoPaciente(mensagem, tipo = 'erro') {
    const elemento = document.getElementById('mensagemContatoPaciente');
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.className = `mensagem-troca-senha ${tipo}`;
}

async function carregarDadosAnamnese() {
    const idPaciente = paramsProntuario.get('id') || localStorage.getItem('paciente_id');
    if (!idPaciente) return;

    localStorage.setItem('paciente_id', idPaciente);

    try {
        const { data: paciente, error } = await _supabase
            .from('pacientes')
            .select('nome,email,telefone,nascimento,morada')
            .eq('id', idPaciente)
            .single();

        if (error || !paciente) throw error || new Error('Paciente nao encontrado.');

        preencherValor('anamneseNome', paciente.nome);
        preencherValor('anamneseEmail', paciente.email);
        preencherValor('anamneseTelefone', paciente.telefone);
        preencherValor('anamneseNascimento', paciente.nascimento);
        preencherValor('anamneseMorada', paciente.morada);
    } catch (err) {
        console.error('Erro ao carregar dados da anamnese:', err);
        alert('Nao foi possivel carregar seus dados. Tente novamente.');
    }
}

async function atualizarContatoPaciente() {
    if (!idCliente) {
        mostrarMensagemContatoPaciente('Paciente nao identificado.');
        return;
    }

    const telefone = document.getElementById('telefoneClienteArea')?.value.trim() || null;
    const morada = document.getElementById('moradaClienteArea')?.value.trim() || null;

    if (!telefone || !morada) {
        mostrarMensagemContatoPaciente('Preencha telefone e endereco.');
        return;
    }

    try {
        const { error } = await _supabase
            .from('pacientes')
            .update({ telefone, morada })
            .eq('id', idCliente);

        if (error) throw error;

        mostrarMensagemContatoPaciente('Dados atualizados com sucesso.', 'sucesso');
    } catch (err) {
        console.error('Erro ao atualizar contato do paciente:', err);
        mostrarMensagemContatoPaciente('Erro ao atualizar dados. Tente novamente.');
    }
}

async function alterarSenhaPaciente() {
    if (!idCliente) {
        mostrarMensagemTrocaSenha('Paciente nao identificado.');
        return;
    }

    const senhaAtualInput = document.getElementById('senhaAtualPaciente');
    const novaSenhaInput = document.getElementById('novaSenhaPaciente');
    const confirmarSenhaInput = document.getElementById('confirmarSenhaPaciente');

    const senhaAtual = senhaAtualInput?.value.trim();
    const novaSenha = novaSenhaInput?.value.trim();
    const confirmarSenha = confirmarSenhaInput?.value.trim();

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mostrarMensagemTrocaSenha('Preencha todos os campos de senha.');
        return;
    }

    if (novaSenha.length < 4) {
        mostrarMensagemTrocaSenha('A nova senha precisa ter pelo menos 4 caracteres.');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarMensagemTrocaSenha('A confirmacao nao confere com a nova senha.');
        return;
    }

    try {
        const { data: paciente, error: erroBusca } = await _supabase
            .from('pacientes')
            .select('senha_acesso,codigo_acesso')
            .eq('id', idCliente)
            .single();

        if (erroBusca || !paciente) throw erroBusca || new Error('Paciente nao encontrado.');

        if (paciente.senha_acesso !== senhaAtual && paciente.codigo_acesso !== senhaAtual) {
            mostrarMensagemTrocaSenha('Senha atual incorreta.');
            return;
        }

        const { error } = await _supabase
            .from('pacientes')
            .update({
                senha_acesso: novaSenha,
                codigo_acesso: novaSenha
            })
            .eq('id', idCliente);

        if (error) throw error;

        senhaAtualInput.value = '';
        novaSenhaInput.value = '';
        confirmarSenhaInput.value = '';
        mostrarMensagemTrocaSenha('Senha alterada com sucesso.', 'sucesso');
    } catch (err) {
        console.error('Erro ao alterar senha do paciente:', err);
        mostrarMensagemTrocaSenha('Erro ao alterar senha. Tente novamente.');
    }
}

async function carregarDadosPaciente() {
    if (!idCliente) {
        console.warn('Nenhum ID de paciente recebido.');
        alert('Paciente nao identificado.');
        return;
    }

    localStorage.setItem('paciente_id', idCliente);

    try {
        const { data: paciente, error } = await _supabase
            .from('pacientes')
            .select('*')
            .eq('id', idCliente)
            .single();

        if (error || !paciente) throw error || new Error('Paciente nao encontrado.');

        const fusoPacienteSelect = document.getElementById('fusoPaciente');
        if (fusoPacienteSelect) fusoPacienteSelect.value = paciente.fuso_paciente || 'Europe/Lisbon';

        setText('nomeCliente', paciente.nome || 'Paciente');
        setText('nomeDisplay', paciente.nome || 'Paciente');
        setText('infoCliente', `Codigo de acesso: ${paciente.senha_acesso || paciente.codigo_acesso || '---'}`);
        atualizarIdentificacaoImpressao(paciente);

        const btnAnamnese = document.getElementById('btnAnamnese');
        if (btnAnamnese) {
            const anamnesePreenchida = Boolean(paciente.anamnese_completa || paciente.anamnese);

            if (anamnesePreenchida) {
                btnAnamnese.removeAttribute('href');
                btnAnamnese.classList.add('btn-acao-disabled');
                btnAnamnese.setAttribute('aria-disabled', 'true');
                btnAnamnese.addEventListener('click', bloquearCliqueAnamnese);
            } else {
                btnAnamnese.href = `anamnese.html?id=${encodeURIComponent(idCliente)}`;
                btnAnamnese.classList.remove('btn-acao-disabled');
                btnAnamnese.removeAttribute('aria-disabled');
                btnAnamnese.removeEventListener('click', bloquearCliqueAnamnese);
            }
        }

        preencherValor('email', paciente.email);
        preencherValor('telefone', paciente.telefone);
        preencherValor('nascimento', paciente.nascimento);
        preencherValor('idade', paciente.idade);
        preencherValor('morada', paciente.morada);
        preencherValor('telefoneClienteArea', paciente.telefone);
        preencherValor('moradaClienteArea', paciente.morada);
        preencherValor('linkReuniao', paciente.link_reuniao);

        const statusPaciente = document.getElementById('statusPaciente');
        if (statusPaciente) statusPaciente.value = paciente.status || 'Atendimento';

        const btnReuniaoCliente = document.getElementById('btnReuniaoCliente');
        const semLinkReuniao = document.getElementById('semLinkReuniao');
        if (btnReuniaoCliente && semLinkReuniao) {
            if (urlValida(paciente.link_reuniao, false)) {
                btnReuniaoCliente.href = paciente.link_reuniao;
                btnReuniaoCliente.style.display = 'inline-block';
                semLinkReuniao.style.display = 'none';
            } else {
                btnReuniaoCliente.style.display = 'none';
                semLinkReuniao.style.display = 'block';
            }
        }

        setText('historiaCliente', paciente.historia || paciente.queixa_principal || 'Nenhuma historia registrada.');

        const anamneseConteudo = document.getElementById('anamneseConteudo');
        if (anamneseConteudo) {
            renderAnamnese(anamneseConteudo, paciente.anamnese_completa || paciente.anamnese);
        }

        preencherValor('notasEvolucao', paciente.notas);
        notasEvolucaoOriginal = paciente.notas || '';

        const btnTarefa7 = document.getElementById('btnTarefa7');
        if (btnTarefa7) {
            btnTarefa7.style.display = paciente.liberar_7dias === true ? 'flex' : 'none';
            btnTarefa7.href = `tarefa-7-dias.html?id=${encodeURIComponent(idCliente)}`;
        }

        const liberar7Dias = document.getElementById('liberar7Dias');
        if (liberar7Dias) liberar7Dias.checked = paciente.liberar_7dias === true;

        atualizarProgresso7Dias(paciente);
        atualizarAgendaCliente(paciente);

        if (paciente.proximo_agendamento) {
            const data = new Date(paciente.proximo_agendamento);
            preencherValor('agendamentoData', data.toISOString().split('T')[0]);
            preencherValor('agendamentoHora', data.toTimeString().slice(0, 5));
        }

        const linkPasta = document.getElementById('linkPasta');
        const pastaUrl = paciente.link_drive_pasta || paciente.pasta_nome;
        if (linkPasta && urlValida(pastaUrl, false)) linkPasta.href = pastaUrl;

        const tabelaFinanceiraCliente = document.getElementById('tabelaFinanceiraCliente');
        if (tabelaFinanceiraCliente) {
            renderFinanceiroPacienteTabela(tabelaFinanceiraCliente, paciente.financeiro || [], false, paciente);
        }

        const tabelaFinanceiroDetalhes = document.querySelector('#tabelaFinanceiro tbody');
        if (tabelaFinanceiroDetalhes) {
            renderFinanceiroPacienteTabela(tabelaFinanceiroDetalhes, paciente.financeiro || [], true, paciente);
        }

        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.style.display = 'none';

        const conteudoPrincipal = document.getElementById('conteudo-principal');
        if (conteudoPrincipal) conteudoPrincipal.style.display = 'block';
    } catch (err) {
        console.error('Erro ao carregar dados do paciente:', err);
        alert('Erro ao carregar informacoes do paciente.');
    }
}

async function marcarSessaoPaga(index) {
    try {
        const { data: paciente, error: erroBusca } = await _supabase
            .from('pacientes')
            .select('financeiro')
            .eq('id', idCliente)
            .single();

        if (erroBusca) throw erroBusca;

        const financeiroAtual = paciente.financeiro || [];
        if (!financeiroAtual[index]) {
            alert('Sessao nao encontrada.');
            return;
        }

        financeiroAtual[index].status = 'Pago';

        const { error } = await _supabase
            .from('pacientes')
            .update({ financeiro: financeiroAtual })
            .eq('id', idCliente);

        if (error) throw error;
        carregarDadosPaciente();
    } catch (err) {
        console.error('Erro ao atualizar pagamento:', err);
        alert('Erro ao atualizar pagamento.');
    }
}

async function addSessao() {
    if (!idCliente) {
        alert('Paciente nao identificado.');
        return;
    }

    const valor = Number.parseFloat(prompt('Valor da sessao:'));
    if (!Number.isFinite(valor) || valor <= 0) {
        alert('Informe um valor valido maior que zero.');
        return;
    }

    const moeda = String(prompt('Moeda: BRL, EUR ou USD', 'EUR') || '').toUpperCase();
    if (!moedaValida(moeda)) {
        alert('Moeda invalida. Use BRL, EUR ou USD.');
        return;
    }

    const status = prompt('Status: Pago ou Pendente', 'Pendente');
    if (!statusPagamentoValido(status)) {
        alert('Status invalido. Use Pago ou Pendente.');
        return;
    }

    try {
        const hoje = new Date().toLocaleDateString('pt-BR');
        const { data: paciente, error: erroBusca } = await _supabase
            .from('pacientes')
            .select('financeiro')
            .eq('id', idCliente)
            .single();

        if (erroBusca) throw erroBusca;

        const financeiroAtual = paciente.financeiro || [];
        financeiroAtual.push({ data: hoje, valor, moeda, status });

        const { error } = await _supabase
            .from('pacientes')
            .update({ financeiro: financeiroAtual })
            .eq('id', idCliente);

        if (error) throw error;

        alert('Sessao registrada com sucesso.');
        carregarDadosPaciente();
    } catch (err) {
        console.error('Erro ao registrar sessao:', err);
        alert('Erro ao registrar sessao.');
    }
}

async function salvarTudo() {
    if (!idCliente) {
        alert('Paciente nao identificado.');
        return;
    }

    const linkReuniao = document.getElementById('linkReuniao')?.value.trim() || '';
    if (!urlValida(linkReuniao, true)) {
        alert('Informe um link de reuniao valido com http ou https.');
        return;
    }

    let proximoAgendamento = null;
    const data = document.getElementById('agendamentoData')?.value;
    const hora = document.getElementById('agendamentoHora')?.value;
    if (data && hora) proximoAgendamento = `${data}T${hora}:00`;

    try {
        const { error } = await _supabase
            .from('pacientes')
            .update({
                proximo_agendamento: proximoAgendamento,
                liberar_7dias: document.getElementById('liberar7Dias')?.checked || false,
                link_reuniao: linkReuniao || null,
                fuso_paciente: document.getElementById('fusoPaciente')?.value || 'Europe/Lisbon',
                telefone: document.getElementById('telefone')?.value.trim() || null,
                nascimento: document.getElementById('nascimento')?.value || null,
                idade: document.getElementById('idade')?.value || null,
                status: document.getElementById('statusPaciente')?.value || 'Atendimento',
                morada: document.getElementById('morada')?.value.trim() || null,
                notas: prepararNotasEvolucaoParaSalvar()
            })
            .eq('id', idCliente);

        if (error) throw error;
        alert('Prontuario salvo com sucesso.');
        carregarDadosPaciente();
    } catch (err) {
        console.error('Erro ao salvar prontuario:', err);
        alert('Erro ao salvar prontuario.');
    }
}

async function salvarAnamnese(event) {
    event.preventDefault();

    const form = document.getElementById('formAnamnese');
    const btn = document.querySelector('.btn-enviar');
    const idPaciente = paramsProntuario.get('id') || localStorage.getItem('paciente_id');

    if (!idPaciente) {
        alert('Paciente nao identificado.');
        return;
    }

    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const anamneseData = Object.fromEntries(formData.entries());
        const nascimento = document.getElementById('anamneseNascimento')?.value || null;
        const morada = document.getElementById('anamneseMorada')?.value.trim() || null;
        const idade = nascimento ? calcularIdadeValor(nascimento) : null;

        const { error } = await _supabase
            .from('pacientes')
            .update({
                anamnese_completa: anamneseData,
                nascimento,
                idade,
                morada
            })
            .eq('id', idPaciente);

        if (error) throw error;

        alert('Anamnese enviada com sucesso! Obrigado.');
        window.location.href = `area-cliente.html?id=${encodeURIComponent(idPaciente)}`;
    } catch (err) {
        console.error('Erro ao enviar anamnese:', err);
        alert('Erro ao enviar anamnese. Tente novamente.');
        btn.textContent = 'Tentar Novamente';
        btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formAnamnese = document.getElementById('formAnamnese');
    if (formAnamnese) {
        formAnamnese.addEventListener('submit', salvarAnamnese);
        carregarDadosAnamnese();
    }

    if (
        document.getElementById('nomeCliente') ||
        document.getElementById('nomeDisplay') ||
        document.getElementById('tabelaFinanceiro')
    ) {
        carregarDadosPaciente();
    }
});
