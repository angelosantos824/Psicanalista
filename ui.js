function escapeHTML(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? '';
}

function abrirLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = modal.classList.contains('login-modal') ? 'flex' : 'block';
}

function fecharLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function abrirNoticia(titulo, texto) {
    const modal = document.getElementById('noticiaModal');
    const tituloEl = document.getElementById('noticiaTitulo');
    const textoEl = document.getElementById('noticiaTexto');

    if (!modal || !tituloEl || !textoEl) return;

    tituloEl.textContent = titulo;
    textoEl.textContent = texto;
    modal.style.display = 'flex';
}

function fecharNoticia() {
    const modal = document.getElementById('noticiaModal');
    if (modal) modal.style.display = 'none';
}

function fecharPopup() {
    const popup = document.getElementById('popupCta');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('popupExibido', 'true');
    }
}

function abrirPopup() {
    const popup = document.getElementById('popupCta');
    if (!popup || sessionStorage.getItem('popupExibido')) return;

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const popupContent = popup.querySelector('.popup-content');
    if (popupContent) popupContent.focus();
}

function criarCelula(texto, className) {
    const td = document.createElement('td');
    if (className) td.className = className;
    td.textContent = texto ?? '';
    return td;
}

function criarMensagemTabela(tbody, colunas, mensagem) {
    tbody.textContent = '';
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = colunas;
    td.style.textAlign = 'center';
    td.style.padding = '20px';
    td.style.color = '#999';
    td.textContent = mensagem;
    tr.appendChild(td);
    tbody.appendChild(tr);
}

function valorPermitido(valor, permitidos) {
    return permitidos.includes(String(valor || '').trim());
}

function moedaValida(moeda) {
    return valorPermitido(String(moeda || '').toUpperCase(), ['BRL', 'EUR', 'USD']);
}

function statusPagamentoValido(status) {
    return valorPermitido(status, ['Pago', 'Pendente']);
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function urlValida(url, opcional = true) {
    const valor = String(url || '').trim();
    if (!valor) return opcional;

    try {
        const parsed = new URL(valor);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginHeader = document.getElementById('openLogin');
    const loginFooter = document.getElementById('openLoginFooter');
    const closeLogin = document.getElementById('closeLogin');
    const popup = document.getElementById('popupCta');
    const popupPrimary = popup ? popup.querySelector('.btn-popup-primary') : null;

    if (loginHeader) {
        loginHeader.addEventListener('click', (event) => {
            event.preventDefault();
            abrirLogin();
        });
    }

    if (loginFooter) {
        loginFooter.addEventListener('click', (event) => {
            event.preventDefault();
            abrirLogin();
        });
    }

    if (closeLogin) closeLogin.addEventListener('click', fecharLogin);

    if (popupPrimary) {
        popupPrimary.addEventListener('click', () => {
            document.body.style.overflow = '';
            sessionStorage.setItem('popupExibido', 'true');
        });
    }

    document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('visible');
    });

    if (popup && !sessionStorage.getItem('popupExibido')) {
        setTimeout(() => {
            abrirPopup();
        }, 5000);
    }

    window.addEventListener('click', (event) => {
        const loginModal = document.getElementById('loginModal');
        const noticiaModal = document.getElementById('noticiaModal');
        const popupCta = document.getElementById('popupCta');

        if (event.target === loginModal) fecharLogin();
        if (event.target === noticiaModal) fecharNoticia();
        if (event.target === popupCta) fecharPopup();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const popupCta = document.getElementById('popupCta');
            if (popupCta && popupCta.style.display === 'flex') fecharPopup();
        }
    });
});
