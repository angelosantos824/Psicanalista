/* ==========================================
   GESTÃO ADMINISTRATIVA SQL - MICHELLY SANTOS
   ========================================== */

async function salvarCliente() {
    // 1. Pega os valores dos campos
    const nome = document.getElementById('clienteNome').value.trim();
    const email = document.getElementById('clienteEmail').value.trim();

    // 2. Validação básica
    if (!nome || !email) {
        alert("Preencha o Nome e o E-mail!");
        return;
    }

    // 3. Gera o ID de 4 dígitos (que será a senha)
    const novoId = Math.floor(1000 + Math.random() * 9000).toString();

    console.log("Tentando salvar no Supabase...");

    try {
        // 4. Envia para o Banco de Dados SQL
        const { error } = await _supabase
            .from('pacientes')
            .insert([{ 
                id: novoId, 
                nome: nome, 
                email: email, 
                senha_acesso: novoId, // Senha automática igual ao ID
                financeiro: [],
                notas: "" 
            }]);

        if (error) throw error;

        // 5. Sucesso!
        alert(`✅ Sucesso!\nPaciente: ${nome}\nLogin: ${email}\nSenha: ${novoId}`);
        
        // Limpa os campos
        document.getElementById('clienteNome').value = "";
        document.getElementById('clienteEmail').value = "";
        
        // Recarrega a lista na tela
        renderTable();

    } catch (err) {
        console.error("Erro completo:", err);
        alert("Erro ao salvar: " + err.message);
    }
}