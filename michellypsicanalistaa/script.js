document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('status');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de envio
            status.innerText = "Enviando...";
            
            setTimeout(() => {
                status.innerText = "Obrigado, Michelly recebeu sua mensagem. Em breve entrará em contato.";
                status.style.color = "green";
                form.reset();
            }, 1500);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('openLogin');
    const closeBtn = document.getElementById('closeLogin');
    const modal = document.getElementById('loginModal');

    if (loginBtn) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            modal.style.display = "block";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = "none";
        }
    }

    // Fecha o modal se clicar fora dele
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// Função para carregar clientes ou iniciar com uma lista vazia
let clientes = JSON.parse(localStorage.getItem('clientes_michelly')) || [];

function renderTable() {
    const tbody = document.getElementById('tabelaClientes');
    const totalDisplay = document.getElementById('totalClientes');
    
    if (!tbody) return; // Segurança caso o elemento não exista

    tbody.innerHTML = '';
    
    clientes.forEach((cliente, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>📁 ${cliente.pasta}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editarCliente(${index})">Editar</button>
                    <button class="btn-action btn-del" onclick="deletarCliente(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });

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