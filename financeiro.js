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

function renderFinanceiroPacienteTabela(tbody, financeiro, permitirMarcarPago = false, paciente = {}) {
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

        if (status === 'Pago') {
            statusTd.appendChild(document.createElement('br'));
            const btnComprovante = document.createElement('button');
            btnComprovante.className = 'btn-comprovante';
            btnComprovante.type = 'button';
            btnComprovante.textContent = 'Comprovante';
            btnComprovante.addEventListener('click', () => gerarComprovantePagamento(item, index, paciente));
            statusTd.appendChild(btnComprovante);
        }

        tr.appendChild(statusTd);

        tbody.appendChild(tr);
    });
}

function escapeComprovante(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatarDataComprovante(value) {
    if (!value) return '---';

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(String(value))) return value;

    const data = new Date(value);
    if (Number.isNaN(data.getTime())) return String(value);

    return data.toLocaleDateString('pt-BR');
}

function numeroComprovante(index, paciente = {}) {
    const ano = new Date().getFullYear();
    const pacienteRef = String(paciente.id || paciente.email || 'PAC')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 6)
        .toUpperCase() || 'PAC';
    return `MS-${ano}-${pacienteRef}-${String(index + 1).padStart(3, '0')}`;
}

function gerarComprovantePagamento(item, index, paciente = {}) {
    const moeda = moedaValida(item.moeda) ? item.moeda : 'BRL';
    const numero = numeroComprovante(index, paciente);
    const emissao = new Date().toLocaleString('pt-BR');
    const dataPagamento = formatarDataComprovante(item.data);
    const valor = formatarValor(item.valor, moeda);
    const pacienteNome = paciente.nome || paciente.full_name || 'Paciente';
    const pacienteEmail = paciente.email || '---';
    const pacienteTelefone = paciente.telefone || '---';
    const servico = item.descricao || 'Sessão individual de psicanálise';
    const metodo = item.forma_pagamento || item.metodo_pagamento || 'Não informado';

    const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprovante ${escapeComprovante(numero)}</title>
    <style>
        :root {
            --texto: #2f2924;
            --muted: #6f655d;
            --borda: #eaded3;
            --bege: #fcfbf9;
            --dourado: #d4a373;
            --verde: #7b8f80;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 32px;
            background: var(--bege);
            color: var(--texto);
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.5;
        }

        .documento {
            max-width: 760px;
            margin: 0 auto;
            background: #fff;
            border: 1px solid var(--borda);
            border-radius: 18px;
            box-shadow: 0 24px 70px rgba(41,32,25,.12);
            overflow: hidden;
        }

        .topo {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 24px;
            padding: 34px;
            border-bottom: 1px solid var(--borda);
            background: linear-gradient(180deg, #fff, #fffaf6);
        }

        h1 {
            margin: 0 0 6px;
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 30px;
            color: var(--texto);
            letter-spacing: 0;
        }

        .subtitulo {
            margin: 0;
            color: var(--muted);
            font-weight: 700;
        }

        .numero {
            min-width: 180px;
            padding: 14px;
            border-radius: 12px;
            background: var(--texto);
            color: #fff8f0;
            text-align: right;
        }

        .numero span {
            display: block;
            color: #e8c3a2;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .conteudo { padding: 34px; }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 24px;
        }

        .box {
            padding: 16px;
            border: 1px solid var(--borda);
            border-radius: 12px;
            background: #fff;
        }

        .box.full { grid-column: 1 / -1; }
        .label {
            display: block;
            margin-bottom: 5px;
            color: #a86936;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .valor {
            padding: 24px;
            margin: 10px 0 24px;
            border-radius: 14px;
            background: #f0f4f1;
            border: 1px solid rgba(123,143,128,.25);
            text-align: center;
        }

        .valor strong {
            display: block;
            color: var(--verde);
            font-size: 32px;
        }

        .aviso {
            padding: 14px 16px;
            border-radius: 12px;
            background: #fdfaf5;
            border: 1px solid var(--borda);
            color: var(--muted);
            font-size: 13px;
        }

        .assinatura {
            margin-top: 36px;
            padding-top: 22px;
            border-top: 1px solid var(--borda);
            text-align: center;
            color: var(--muted);
        }

        .acoes {
            max-width: 760px;
            margin: 18px auto 0;
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        button {
            border: 0;
            border-radius: 999px;
            padding: 12px 18px;
            background: var(--dourado);
            color: #fff;
            cursor: pointer;
            font-weight: 800;
        }

        @media print {
            body { padding: 0; background: #fff; }
            .documento { box-shadow: none; border-radius: 0; border: 0; }
            .acoes { display: none; }
        }

        @media (max-width: 640px) {
            body { padding: 14px; }
            .topo, .grid { grid-template-columns: 1fr; }
            .numero { text-align: left; }
        }
    </style>
</head>
<body>
    <main class="documento">
        <header class="topo">
            <div>
                <h1>COMPROVANTE DE PAGAMENTO</h1>
                <p class="subtitulo">Documento interno não fiscal</p>
            </div>
            <div class="numero">
                <span>Número</span>
                ${escapeComprovante(numero)}
            </div>
        </header>

        <section class="conteudo">
            <div class="grid">
                <div class="box">
                    <span class="label">Emitente</span>
                    <strong>Michelly Eufrazio Santos</strong><br>
                    Psicanalista Clínica<br>
                    Aveiro, Portugal / Online
                </div>
                <div class="box">
                    <span class="label">Emissão</span>
                    ${escapeComprovante(emissao)}
                </div>
                <div class="box">
                    <span class="label">Paciente</span>
                    <strong>${escapeComprovante(pacienteNome)}</strong><br>
                    ${escapeComprovante(pacienteEmail)}<br>
                    ${escapeComprovante(pacienteTelefone)}
                </div>
                <div class="box">
                    <span class="label">Pagamento</span>
                    Data: ${escapeComprovante(dataPagamento)}<br>
                    Método: ${escapeComprovante(metodo)}<br>
                    Status: Pago
                </div>
                <div class="box full">
                    <span class="label">Serviço</span>
                    ${escapeComprovante(servico)}
                </div>
            </div>

            <div class="valor">
                <span class="label">Valor pago</span>
                <strong>${escapeComprovante(valor)}</strong>
                <span>${escapeComprovante(moeda)}</span>
            </div>

            <p class="aviso">
                Este documento confirma o pagamento do atendimento descrito acima. Documento interno não fiscal.
                Não substitui fatura, recibo fiscal, fatura-recibo ou documento equivalente quando exigido pela legislação aplicável.
            </p>

            <div class="assinatura">
                <strong>Michelly Eufrazio Santos</strong><br>
                Psicanalista Clínica
            </div>
        </section>
    </main>

    <div class="acoes">
        <button type="button" onclick="window.print()">Imprimir / Salvar PDF</button>
    </div>
</body>
</html>`;

    const janela = window.open('', '_blank', 'noopener,noreferrer');
    if (!janela) {
        alert('Nao foi possivel abrir o comprovante. Verifique o bloqueador de pop-ups.');
        return;
    }

    janela.document.open();
    janela.document.write(html);
    janela.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaFinanceira')) renderFinanceiro();
});
