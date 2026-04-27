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
                    <button onclick="editarCliente(${index})">Editar</button>
                    <button onclick="deletarCliente(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
    localStorage.setItem('clientes_michelly', JSON.stringify(clientes));
    if(document.getElementById('totalClientes')) document.getElementById('totalClientes').innerText = clientes.length;
}

function salvarCliente() {
    const idIndex = document.getElementById('clienteId').value;
    const nome = document.getElementById('clienteNome').value.trim();
    const pasta = document.getElementById('clientePasta').value.trim();

    if (!nome || !pasta) return alert("Preencha tudo.");

    if (idIndex !== "") {
        clientes[idIndex].nome = nome;
        clientes[idIndex].pasta = pasta;
    } else {
        const novoId = Math.floor(1000 + Math.random() * 9000);
        clientes.push({ id: novoId.toString(), nome, pasta, financeiro: [], notas: "" });
        alert(`Cliente Criado!\nUsuário: ${pasta}\nSenha: ${novoId}`);
    }
    
    document.getElementById('modalCliente').style.display = 'none';
    renderTable();
}

function deletarCliente(index) {
    if (confirm("Excluir cliente?")) {
        clientes.splice(index, 1);
        renderTable();
    }
}

window.onload = renderTable;