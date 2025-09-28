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

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

function validatePassword(password) {
    return password.length >= 6;
}

function formatPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 11) {
        return `(${cleanPhone.slice(0,2)}) ${cleanPhone.slice(2,7)}-${cleanPhone.slice(7,11)}`;
    } else if (cleanPhone.length >= 2) {
        return `(${cleanPhone.slice(0,2)}) ${cleanPhone.slice(2)}`;
    }
    return cleanPhone;
}

document.getElementById('telefone').addEventListener('input', function(e) {
    e.target.value = formatPhone(e.target.value);
});

document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const cadastroBtn = document.getElementById('cadastroBtn');
    
   
    if (!nome || !email || !telefone || !password || !confirmPassword) {
        showToast('Erro', 'Por favor, preencha todos os campos');
        return;
    }
    if (nome.length < 2) {
        showToast('Erro', 'Nome deve ter pelo menos 2 caracteres');
        return;
    }
    if (!validateEmail(email)) {
        showToast('Erro', 'Por favor, insira um email válido');
        return;
    }
    if (!validatePhone(telefone)) {
        showToast('Erro', 'Por favor, insira um telefone válido');
        return;
    }
    if (!validatePassword(password)) {
        showToast('Erro', 'Senha deve ter pelo menos 6 caracteres');
        return;
    }
    if (password !== confirmPassword) {
        showToast('Erro', 'As senhas não coincidem');
        return;
    }
    
    
    cadastroBtn.textContent = 'Criando conta...';
    cadastroBtn.classList.add('loading');
    cadastroBtn.disabled = true;
    
    fetch('http://127.0.0.1:5002/usuario/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
            endereco: endereco,
            senha: password 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            showToast('Conta criada!', data.mensagem);
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showToast('Erro no Cadastro', data.erro);
        }
    })
    .catch(error => {
        console.error('Erro de fetch:', error);
        showToast('Erro de Conexão', 'Não foi possível conectar ao servidor.');
    })
    .finally(() => {
        cadastroBtn.textContent = 'Criar conta';
        cadastroBtn.classList.remove('loading');
        cadastroBtn.disabled = false;
    });
});


document.addEventListener('click', function(e) {
    const toast = document.getElementById('toast');
    if (!toast.contains(e.target) && toast.classList.contains('show')) {
        hideToast();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('nome').focus();
    
    const inputs = ['nome', 'email', 'telefone', 'password', 'confirmPassword'];
    inputs.forEach((inputId, index) => {
        document.getElementById(inputId).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    document.getElementById(inputs[index + 1]).focus();
                } else {
                    document.getElementById('cadastroForm').dispatchEvent(new Event('submit'));
                }
            }
        });
    });
});

document.getElementById('confirmPassword').addEventListener('input', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    e.target.style.borderColor = (confirmPassword && password !== confirmPassword) ? '#ef4444' : '';
});