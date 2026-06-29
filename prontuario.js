const paramsProntuario = new URLSearchParams(window.location.search);
const idCliente = paramsProntuario.get('id') || localStorage.getItem('paciente_id');

function calcularIdadeAutomatico(dataNascimento) {
    const idadeInput = document.getElementById('idade');
    if (!idadeInput || !dataNascimento) return;

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade -= 1;
    }

    idadeInput.value = Number.isFinite(idade) && idade >= 0 ? idade : '';
}

window.calcularIdadeAutomático = calcularIdadeAutomatico;
window.calcularIdadeAutomatico = calcularIdadeAutomatico;

function preencherValor(id, valor) {
    const element = document.getElementById(id);
    if (element) element.value = valor || '';
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
    if (!elementoData || !cardAviso) return;

    if (!paciente.proximo_agendamento) {
        cardAviso.style.display = 'none';
        return;
    }

    const dataSessao = new Date(paciente.proximo_agendamento);
    const agora = new Date();
    cardAviso.style.display = 'block';

    if (dataSessao > agora) {
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
    } else {
        elementoData.textContent = 'Aguardando novo agendamento...';
        elementoData.style.color = '#85741d';
        elementoData.style.fontWeight = 'normal';
        elementoData.style.fontSize = '1.1rem';
        if (fusoAviso) fusoAviso.style.display = 'none';
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

        const btnAnamnese = document.getElementById('btnAnamnese');
        if (btnAnamnese) btnAnamnese.href = `anamnese.html?id=${encodeURIComponent(idCliente)}`;

        preencherValor('email', paciente.email);
        preencherValor('telefone', paciente.telefone);
        preencherValor('nascimento', paciente.nascimento);
        preencherValor('idade', paciente.idade);
        preencherValor('morada', paciente.morada);
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
            renderFinanceiroPacienteTabela(tabelaFinanceiraCliente, paciente.financeiro || [], false);
        }

        const tabelaFinanceiroDetalhes = document.querySelector('#tabelaFinanceiro tbody');
        if (tabelaFinanceiroDetalhes) {
            renderFinanceiroPacienteTabela(tabelaFinanceiroDetalhes, paciente.financeiro || [], true);
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
                notas: document.getElementById('notasEvolucao')?.value || ''
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
        const { error } = await _supabase
            .from('pacientes')
            .update({ anamnese_completa: anamneseData })
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
    if (formAnamnese) formAnamnese.addEventListener('submit', salvarAnamnese);

    if (
        document.getElementById('nomeCliente') ||
        document.getElementById('nomeDisplay') ||
        document.getElementById('tabelaFinanceiro')
    ) {
        carregarDadosPaciente();
    }
});
