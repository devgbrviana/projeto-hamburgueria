function showToast(title, description) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDescription = document.getElementById('toastDescription');
    
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Esconde a notificação automaticamente após 3 segundos
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 300);
}

// Função para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Manipulação do formulário de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o recarregamento da página
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Validação básica dos campos
    if (!email || !password) {
        showToast('Erro', 'Por favor, preencha todos os campos');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Erro', 'Por favor, insira um email válido');
        return;
    }
    
    // Ativa o estado de "carregando" no botão
    loginBtn.textContent = 'Entrando...';
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // **CORREÇÃO:** A chamada fetch agora é imediata, sem o setTimeout
    fetch('http://127.0.0.1:5002/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            senha: password // O backend espera a chave 'senha'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            // Sucesso
            showToast('Login realizado!', data.mensagem);
            // Redireciona para a página principal após 2 segundos
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            // Erro retornado pelo servidor (ex: senha incorreta)
            showToast('Erro de Login', data.erro);
        }
    })
    .catch(error => {
        // Erro de rede ou de conexão com a API
        console.error('Erro de fetch:', error);
        showToast('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    })
    .finally(() => {
        // Este bloco executa sempre, resetando o botão
        loginBtn.textContent = 'Entrar';
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    });
});

// Fecha a notificação se clicar fora dela
document.addEventListener('click', function(e) {
    const toast = document.getElementById('toast');
    if (!toast.contains(e.target) && toast.classList.contains('show')) {
        hideToast();
    }
});

// Melhorias de usabilidade
document.addEventListener('DOMContentLoaded'), function() {
    // Foca no campo de email ao carregar a página
    document.getElementById('email').focus();
    
    // Permite navegar do email para a senha com a tecla Enter
    document.getElementById('email').addEventListener('keypress'), function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password')
            }
        }
    }
