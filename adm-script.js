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
async function salvarCliente() {
    const nome = document.getElementById('clienteNome').value.trim();
    const email = document.getElementById('clientePasta').value.trim(); // Reutilizando seu ID de input para Email

    if (!nome || !email) return alert("Preencha Nome e E-mail!");

    // Gera um ID aleatório de 4 dígitos (como você fazia)
    const novoId = Math.floor(1000 + Math.random() * 9000).toString();

    const novoPaciente = {
        id: novoId,
        nome: nome,
        email: email,
        senha_acesso: novoId, // A SENHA É O ID AUTOMATICAMENTE
        financeiro: [],
        notas: ""
    };

    const { error } = await _supabase
        .from('pacientes')
        .insert([novoPaciente]);

    if (error) {
        alert("Erro ao salvar no banco: " + error.message);
    } else {
        alert(`✅ Cliente Criado!\n\nUsuário (Email): ${email}\nSenha (ID): ${novoId}`);
        
        // Limpa campos e fecha modal
        document.getElementById('clienteNome').value = '';
        document.getElementById('clientePasta').value = '';
        
        const modal = document.getElementById('modalCliente');
        if(modal) modal.style.display = 'none';
        
        renderTable(); // Atualiza a lista na hora
    }
}

// 3. DELETAR PACIENTE DO SQL
async function deletarCliente(id) {
    if (confirm("Deseja excluir este cliente permanentemente do banco de dados?")) {
        const { error } = await _supabase
            .from('pacientes')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Erro ao excluir: " + error.message);
        } else {
            renderTable();
        }
    }
}

// Inicializa a tabela ao carregar a página
document.addEventListener('DOMContentLoaded', renderTable);