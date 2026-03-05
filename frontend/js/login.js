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

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    if (!email || !password) {
        showToast('Erro', 'Por favor, preencha todos os campos');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Erro', 'Por favor, insira um email válido');
        return;
    }
    
    loginBtn.textContent = 'Entrando...';
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    fetch('http://127.0.0.1:5002/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            senha: password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            showToast('Login realizado!', data.mensagem);
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000);
        } else {
            showToast('Erro de Login', data.erro);
        }
    })
    .catch(error => {
        console.error('Erro de fetch:', error);
        showToast('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    })
    .finally(() => {
        loginBtn.textContent = 'Entrar';
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    });
});

document.addEventListener('click', function(e) {
    const toast = document.getElementById('toast');
    if (!toast.contains(e.target) && toast.classList.contains('show')) {
        hideToast();
    }
});

document.addEventListener('DOMContentLoaded'), function() {
    document.getElementById('email').focus();
    document.getElementById('email').addEventListener('keypress'), function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password')
            }
        }
    }
