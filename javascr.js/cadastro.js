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
    
    // Auto hide after 3 seconds
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

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
}

function validatePassword(password) {
    return password.length >= 6;
}

function formatPhone(phone) {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (cleanPhone.length >= 11) {
        return `(${cleanPhone.slice(0,2)}) ${cleanPhone.slice(2,7)}-${cleanPhone.slice(7,11)}`;
    } else if (cleanPhone.length >= 6) {
        return `(${cleanPhone.slice(0,2)}) ${cleanPhone.slice(2,7)}-${cleanPhone.slice(7)}`;
    } else if (cleanPhone.length >= 2) {
        return `(${cleanPhone.slice(0,2)}) ${cleanPhone.slice(2)}`;
    }
    return cleanPhone;
}

// Phone formatting on input
document.getElementById('telefone').addEventListener('input', function(e) {
    const formattedPhone = formatPhone(e.target.value);
    e.target.value = formattedPhone;
});

// Cadastro form handling
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const cadastroBtn = document.getElementById('cadastroBtn');
    
    // Validation
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
    
    // Loading state
    cadastroBtn.textContent = 'Criando conta...';
    cadastroBtn.classList.add('loading');
    cadastroBtn.disabled = true;
    
    // Simulate registration API call
    setTimeout(() => {
        // Reset button state
        cadastroBtn.textContent = 'Criar conta';
        cadastroBtn.classList.remove('loading');
        cadastroBtn.disabled = false;
        
        // Show success message
        showToast('Conta criada!', 'Bem-vindo ao Code Burger! Sua conta foi criada com sucesso.');
        
        // Here you would typically redirect or handle successful registration
        console.log('Registration successful:', { nome, email, telefone });
        
        // Optional: Clear form
        document.getElementById('cadastroForm').reset();
        
        // Optional: Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    }, 1500);
});

// Close toast when clicking outside
document.addEventListener('click', function(e) {
    const toast = document.getElementById('toast');
    if (!toast.contains(e.target) && toast.classList.contains('show')) {
        hideToast();
    }
});

// Enhanced UX: Focus management and Enter key navigation
document.addEventListener('DOMContentLoaded', function() {
    // Focus first input on load
    document.getElementById('nome').focus();
    
    // Enter key navigation between fields
    const inputs = ['nome', 'email', 'telefone', 'password', 'confirmPassword'];
    
    inputs.forEach((inputId, index) => {
        document.getElementById(inputId).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (index < inputs.length - 1) {
                    document.getElementById(inputs[index + 1]).focus();
                } else {
                    // Submit form on last input
                    document.getElementById('cadastroForm').dispatchEvent(new Event('submit'));
                }
            }
        });
    });
});

// Real-time password confirmation validation
document.getElementById('confirmPassword').addEventListener('input', function(e) {
    const password = document.getElementById('password').value;
    const confirmPassword = e.target.value;
    
    if (confirmPassword && password !== confirmPassword) {
        e.target.style.borderColor = '#ef4444';
    } else {
        e.target.style.borderColor = '';
    }
});