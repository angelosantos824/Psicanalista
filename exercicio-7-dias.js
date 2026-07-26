let pacienteExercicioData = null;
const DIAS_EXERCICIO_7_DIAS = [1, 2, 3, 4, 5, 6, 7];

function normalizarRespostas7Dias(respostas) {
    if (!respostas) return {};

    if (typeof respostas === 'string') {
        try {
            return JSON.parse(respostas) || {};
        } catch {
            return {};
        }
    }

    return respostas;
}

async function carregarExercicio7Dias() {
    const progressoTexto = document.getElementById('progresso-texto');
    if (!progressoTexto) return;

    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('id') || localStorage.getItem('paciente_id');

    if (!pacienteId) {
        alert('Acesso invalido.');
        return;
    }

    localStorage.setItem('paciente_id', pacienteId);

    try {
        const { data, error } = await _supabase
            .from('pacientes')
            .select('*')
            .eq('id', pacienteId)
            .single();

        if (error || !data) throw error || new Error('Paciente nao encontrado.');

        pacienteExercicioData = data;

        if (data.liberar_7dias !== true) {
            progressoTexto.textContent = 'Exercicio ainda nao liberado.';
            return;
        }

        if (!data.data_inicio_7dias) {
            const { error: inicioError } = await _supabase
                .from('pacientes')
                .update({ data_inicio_7dias: new Date().toISOString() })
                .eq('id', pacienteId);

            if (inicioError) throw inicioError;
            location.reload();
            return;
        }

        const inicio = new Date(data.data_inicio_7dias);
        inicio.setHours(0, 0, 0, 0);

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const diffTempo = hoje.getTime() - inicio.getTime();
        const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24)) + 1;
        const diaAtual = diffDias > 7 ? 7 : diffDias;

        progressoTexto.textContent = `Voce esta no DIA ${diaAtual} da sua jornada.`;

        const respostas = normalizarRespostas7Dias(data.respostas_7dias);

        DIAS_EXERCICIO_7_DIAS.forEach((num) => {
            const bloco = document.getElementById(`bloco-${num}`);
            if (!bloco || num > diaAtual) return;

            bloco.style.display = 'block';

            if (!respostas[`dia_${num}`]) return;

            const btn = document.getElementById(`btn-${num}`);
            if (btn) {
                btn.textContent = 'Resposta Salva';
                btn.disabled = true;
            }

            if (num === 2) {
                const sentia = document.getElementById('dia-2-sentia');
                const queria = document.getElementById('dia-2-queria');
                if (sentia) {
                    sentia.value = respostas.dia_2.sentia || '';
                    sentia.disabled = true;
                }
                if (queria) {
                    queria.value = respostas.dia_2.queria || '';
                    queria.disabled = true;
                }
                return;
            }

            const campo = document.getElementById(`dia-${num}`);
            if (campo) {
                campo.value = respostas[`dia_${num}`];
                campo.disabled = true;
            }
        });
    } catch (err) {
        console.error('Erro ao carregar exercicio:', err);
        progressoTexto.textContent = 'Erro ao carregar exercicio.';
        alert('Nao foi possivel carregar o exercicio de 7 dias.');
    }
}

async function salvarDia(num) {
    const params = new URLSearchParams(window.location.search);
    const pacienteId = params.get('id') || localStorage.getItem('paciente_id');
    const btn = document.getElementById(`btn-${num}`);

    if (btn) btn.textContent = 'Salvando...';

    let valor;
    if (num === 2) {
        valor = {
            sentia: document.getElementById('dia-2-sentia')?.value.trim(),
            queria: document.getElementById('dia-2-queria')?.value.trim()
        };
    } else {
        valor = document.getElementById(`dia-${num}`)?.value.trim();
    }

    if (!valor || (num === 2 && (!valor.sentia || !valor.queria))) {
        alert('Por favor, preencha o campo antes de salvar.');
        if (btn) btn.textContent = 'Salvar Resposta';
        return;
    }

    const respostasAtuais = normalizarRespostas7Dias(pacienteExercicioData?.respostas_7dias);

    try {
        const { error } = await _supabase
            .from('pacientes')
            .update({
                respostas_7dias: {
                    ...respostasAtuais,
                    [`dia_${num}`]: valor
                }
            })
            .eq('id', pacienteId);

        if (error) throw error;

        alert('Sua reflexao foi salva com sucesso.');
        location.reload();
    } catch (err) {
        console.error('Erro ao salvar resposta:', err);
        alert('Erro ao salvar. Tente novamente.');
        if (btn) btn.textContent = 'Tentar novamente';
    }
}

document.addEventListener('DOMContentLoaded', carregarExercicio7Dias);
