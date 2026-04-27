// TESTE DE CONEXÃO
alert("O arquivo script.js foi carregado com sucesso!");

function executarLogin() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === "admin@michelly.com" && pass === "123456") {
        window.location.href = "adm.html";
    } else {
        alert("Usuário: " + user + " | Senha: " + pass);
    }
}