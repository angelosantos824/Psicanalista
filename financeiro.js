const SIMBOLOS_MOEDA = { BRL: 'R$', EUR: 'EUR', USD: '$' };

function formatarValor(valor, moeda = 'BRL') {
    const valorNumerico = Number.parseFloat(valor || 0);
    return `${SIMBOLOS_MOEDA[moeda] || 'R$'} ${valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

async function renderFinanceiro() {
    const tbody = document.getElementById('tabelaFinanceira');
    if (!tbody) return;

    try {
        const { data: lancamentos, error } = await _supabase
            .from('fluxo_caixa')
            .select('*')
            .order('data', { ascending: false });

        if (error) throw error;

        const saldos = { BRL: 0, EUR: 0, USD: 0 };
        tbody.textContent = '';

        (lancamentos || []).forEach((lancamento) => {
            const moeda = moedaValida(lancamento.moeda) ? lancamento.moeda : 'BRL';
            const valor = Number.parseFloat(lancamento.valor || 0);
            const isEntrada = lancamento.tipo === 'entrada';
            saldos[moeda] += isEntrada ? valor : -valor;

            const tr = document.createElement('tr');
            const data = lancamento.data
                ? new Date(lancamento.data).toLocaleDateString('pt-BR')
                : '---';

            tr.appendChild(criarCelula(data));
            tr.appendChild(criarCelula(lancamento.descricao || 'Sem descricao'));
            tr.appendChild(criarCelula(moeda));

            const valorTd = criarCelula(`${isEntrada ? '+' : '-'} ${formatarValor(valor, moeda)}`, isEntrada ? 'valor-entrada' : 'valor-saida');
            tr.appendChild(valorTd);

            const acoesTd = document.createElement('td');
            const btn = document.createElement('button');
            btn.className = 'btn-excluir';
            btn.style.padding = '5px 10px';
            btn.textContent = 'Excluir';
            btn.addEventListener('click', () => excluirLancamento(lancamento.id));
            acoesTd.appendChild(btn);
            tr.appendChild(acoesTd);

            tbody.appendChild(tr);
        });

        setText('saldoBRL', formatarValor(saldos.BRL, 'BRL'));
        setText('saldoEUR', formatarValor(saldos.EUR, 'EUR'));
        setText('saldoUSD', formatarValor(saldos.USD, 'USD'));
    } catch (err) {
        console.error('Erro ao carregar financeiro:', err);
        alert('Nao foi possivel carregar o fluxo de caixa.');
    }
}

async function salvarLancamento() {
    const descricao = document.getElementById('descFinanceiro')?.value.trim();
    const valorRaw = document.getElementById('valorFinanceiro')?.value;
    const moeda = document.getElementById('moedaFinanceiro')?.value;
    const tipo = document.getElementById('tipoFinanceiro')?.value;
    const valor = Number.parseFloat(valorRaw);

    if (!descricao) {
        alert('Preencha a descricao do lancamento.');
        return;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
        alert('Informe um valor financeiro maior que zero.');
        return;
    }

    if (!moedaValida(moeda)) {
        alert('Moeda invalida. Use BRL, EUR ou USD.');
        return;
    }

    if (!['entrada', 'saida'].includes(tipo)) {
        alert('Tipo invalido. Use entrada ou saida.');
        return;
    }

    try {
        const { error } = await _supabase.from('fluxo_caixa').insert([{ descricao, valor, moeda, tipo }]);
        if (error) throw error;

        document.getElementById('descFinanceiro').value = '';
        document.getElementById('valorFinanceiro').value = '';
        document.getElementById('tipoFinanceiro').value = 'entrada';
        renderFinanceiro();
    } catch (err) {
        console.error('Erro ao salvar lancamento:', err);
        alert('Erro ao salvar lancamento financeiro.');
    }
}

async function excluirLancamento(id) {
    if (!id || !confirm('Remover registro?')) return;

    try {
        const { error } = await _supabase.from('fluxo_caixa').delete().eq('id', id);
        if (error) throw error;
        renderFinanceiro();
    } catch (err) {
        console.error('Erro ao excluir lancamento:', err);
        alert('Erro ao excluir lancamento.');
    }
}

function renderFinanceiroPacienteTabela(tbody, financeiro, permitirMarcarPago = false) {
    tbody.textContent = '';

    if (!financeiro || financeiro.length === 0) {
        criarMensagemTabela(tbody, 4, 'Nenhum registro de sessao disponivel.');
        return;
    }

    financeiro.forEach((item, index) => {
        const moeda = moedaValida(item.moeda) ? item.moeda : 'BRL';
        const status = statusPagamentoValido(item.status) ? item.status : 'Pendente';
        const tr = document.createElement('tr');

        tr.appendChild(criarCelula(item.data || '---'));

        if (permitirMarcarPago) {
            tr.appendChild(criarCelula(formatarValor(item.valor, moeda)));
        } else {
            tr.appendChild(criarCelula(moeda));
            tr.appendChild(criarCelula(formatarValor(item.valor, moeda)));
        }

        const statusTd = criarCelula(status, status === 'Pago' ? 'status-pago' : 'status-pendente');
        if (permitirMarcarPago && status !== 'Pago') {
            statusTd.appendChild(document.createElement('br'));
            const btn = document.createElement('button');
            btn.style.marginTop = '6px';
            btn.style.padding = '5px 8px';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.background = '#7b8f80';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '11px';
            btn.textContent = 'Marcar pago';
            btn.addEventListener('click', () => marcarSessaoPaga(index));
            statusTd.appendChild(btn);
        }
        tr.appendChild(statusTd);

        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaFinanceira')) renderFinanceiro();
});
