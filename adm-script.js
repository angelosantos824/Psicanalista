/* SCRIPT DO PAINEL ADMINISTRATIVO */
let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];

function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    if (!tbody) return;

    tbody.innerHTML = '';
    clientes.forEach((cliente, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${cliente.id}</td>
                <td><a href="detalhes-cliente.html?id=${cliente.id}">${cliente.nome}</a></td>
                <td>📁 ${cliente.pasta}</td>
                <td>
                    <button onclick="deletarCliente(${index})" style="background:#ff9999; border:none; padding:5px; cursor:pointer;">Excluir</button>
                </td>
            </tr>
        `;
    });
    localStorage.setItem('clientes_michelly', JSON.stringify(clientes));
}

function salvarCliente() {
    const nome = document.getElementById('clienteNome').value.trim();
    const pasta = document.getElementById('clientePasta').value.trim();

    if (!nome || !pasta) return alert("Preencha Nome e Pasta!");

    const novoId = Math.floor(1000 + Math.random() * 9000);
    clientes.push({ 
        id: novoId.toString(), 
        nome: nome, 
        pasta: pasta, 
        financeiro: [], 
        notas: "" 
    });

    alert("Cliente Criado!\nUsuário: " + pasta + "\nSenha: " + novoId);
    
    // Fecha o modal se ele existir
    const modal = document.getElementById('modalCliente');
    if(modal) modal.style.display = 'none';
    
    renderTable();
}

function deletarCliente(index) {
    if (confirm("Deseja excluir este cliente?")) {
        clientes.splice(index, 1);
        renderTable();
    }
}

// Inicializa a tabela
document.addEventListener('DOMContentLoaded', renderTable);