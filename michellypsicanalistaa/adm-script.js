// Função para carregar clientes ou iniciar com uma lista vazia
let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];

function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    const totalDisplay = document.getElementById('totalClientes');
    
    if (!tbody) return; // Segurança caso o elemento não exista

// Dentro da função renderTable no seu adm-script.js:
tbody.innerHTML += `
    <tr>
        <td>#${cliente.id}</td>
        <td><a href="detalhes-cliente.html?id=${cliente.id}" style="color: #7b8f80; font-weight: bold;">${cliente.nome}</a></td>
        <td>📁 ${cliente.pasta}</td>
        <td>
            <button class="btn-action btn-edit" onclick="editarCliente(${index})">Editar</button>
            <button class="btn-action btn-del" onclick="deletarCliente(${index})">Excluir</button>
        </td>
    </tr>
`;

    totalDisplay.innerText = clientes.length;
    // Salva sempre que renderiza
    localStorage.setItem('clientes_michelly', JSON.stringify(clientes));
}

function salvarCliente() {
    const idIndex = document.getElementById('clienteId').value;
    const nome = document.getElementById('clienteNome').value;
    const pasta = document.getElementById('clientePasta').value;

    if (nome === '' || pasta === '') {
        alert("Por favor, preencha o nome e a pasta.");
        return;
    }

    if (idIndex !== "") {
        // Editando
        clientes[idIndex].nome = nome;
        clientes[idIndex].pasta = pasta;
    } else {
        // Criando Novo (Ex: Angelo Santos)
        const novoId = Math.floor(1000 + Math.random() * 9000);
        clientes.push({ 
            id: novoId.toString(), 
            nome: nome, 
            pasta: pasta 
        });
    }
    
    fecharModalCliente();
    renderTable();
}

function deletarCliente(index) {
    if (confirm("Deseja remover este cliente?")) {
        clientes.splice(index, 1);
        renderTable();
    }
}

// Funções de Modal
function abrirModalCliente() {
    document.getElementById('modalTitle').innerText = "Novo Cliente";
    document.getElementById('clienteId').value = "";
    document.getElementById('clienteNome').value = "";
    document.getElementById('clientePasta').value = "";
    document.getElementById('modalCliente').style.display = 'block';
}

function fecharModalCliente() {
    document.getElementById('modalCliente').style.display = 'none';
}

function editarCliente(index) {
    const cli = clientes[index];
    document.getElementById('modalTitle').innerText = "Editar Cliente";
    document.getElementById('clienteId').value = index;
    document.getElementById('clienteNome').value = cli.nome;
    document.getElementById('clientePasta').value = cli.pasta;
    document.getElementById('modalCliente').style.display = 'block';
}

// Inicialização
window.onload = renderTable;