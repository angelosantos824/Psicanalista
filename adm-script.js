/* ==========================================
   GESTÃO ADMINISTRATIVA SQL - MICHELLY SANTOS
   ========================================== */

// 1. CARREGAR PACIENTES DO SUPABASE
async function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    if (!tbody) return;

    console.log("Buscando pacientes no banco...");
    
    // Busca todos os pacientes ordenados pelo nome
    const { data: pacientes, error } = await _supabase
        .from('pacientes')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao carregar:", error.message);
        return;
    }

    tbody.innerHTML = '';
    pacientes.forEach((cliente) => {
        tbody.innerHTML += `
            <tr>
                <td>#${cliente.id}</td>
                <td><a href="detalhes-cliente.html?id=${cliente.id}" style="color: #d4a373; font-weight: bold; text-decoration: none;">${cliente.nome}</a></td>
                <td>📧 ${cliente.email}</td>
                <td>
                    <button onclick="deletarCliente(${cliente.id})" style="background:#ff9999; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; color:white;">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// 2. SALVAR NOVO PACIENTE (COM ID/SENHA AUTOMÁTICOS)
// Função para carregar a lista de pacientes
async function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    if (!tbody) return;

    const { data: pacientes, error } = await _supabase
        .from('pacientes')
        .select('*')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro ao buscar dados:", error);
        return;
    }

    tbody.innerHTML = '';
    pacientes.forEach((p) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${p.nome}</td>
                <td>${p.email}</td>
                <td>
                    <button onclick="excluirPaciente(${p.id})" style="background:#ff9999; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; color:white;">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Função para Salvar
async function salvarNovoPacienteSQL() {
    const nome = document.getElementById('nomeInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();

    if (!nome || !email) {
        alert("Preencha Nome e E-mail!");
        return;
    }

    // Gera o ID de 4 dígitos (que será a senha)
    const novoId = Math.floor(1000 + Math.random() * 9999);

    const { error } = await _supabase
        .from('pacientes')
        .insert([{ 
            id: novoId, 
            nome: nome, 
            email: email, 
            senha_acesso: novoId.toString(), // ID e Senha são iguais
            financeiro: [],
            notas: "" 
        }]);

    if (error) {
        alert("Erro ao salvar: " + error.message);
    } else {
        alert(`✅ Sucesso!\nPaciente: ${nome}\nLogin: ${email}\nSenha: ${novoId}`);
        document.getElementById('nomeInput').value = '';
        document.getElementById('emailInput').value = '';
        renderTable(); // Atualiza a lista
    }
}

// Função para Excluir
async function excluirPaciente(id) {
    if (confirm("Deseja realmente excluir este paciente?")) {
        const { error } = await _supabase.from('pacientes').delete().eq('id', id);
        if (error) alert("Erro ao excluir");
        else renderTable();
    }
}

// Inicia ao carregar a página
document.addEventListener('DOMContentLoaded', renderTable);