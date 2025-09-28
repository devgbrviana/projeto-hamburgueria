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

// Funções de validação
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

// Formatação do telefone enquanto digita
document.getElementById('telefone').addEventListener('input', function(e) {
    e.target.value = formatPhone(e.target.value);
});

// Manipulação do formulário de cadastro
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o recarregamento da página
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const cadastroBtn = document.getElementById('cadastroBtn');
    
    // Validações dos campos
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
    
    // Ativa o estado de "carregando" no botão
    cadastroBtn.textContent = 'Criando conta...';
    cadastroBtn.classList.add('loading');
    cadastroBtn.disabled = true;
    
    // **CORREÇÃO:** A chamada fetch agora é imediata, sem o setTimeout
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
            senha: password // Envia a chave 'senha' para o backend
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensagem) {
            showToast('Conta criada!', data.mensagem);
            // Redireciona para o login após o sucesso
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
        // Este bloco executa sempre, resetando o botão
        cadastroBtn.textContent = 'Criar conta';
        cadastroBtn.classList.remove('loading');
        cadastroBtn.disabled = false;
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

// Validação em tempo real da confirmação de senha
document.getElementById('confirmPassword').addEventListener('input', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    e.target.style.borderColor = (confirmPassword && password !== confirmPassword) ? '#ef4444' : '';
});