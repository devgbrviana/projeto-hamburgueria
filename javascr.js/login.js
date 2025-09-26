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

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Basic validation
    if (!email || !password) {
        showToast('Erro', 'Por favor, preencha todos os campos');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Erro', 'Por favor, insira um email válido');
        return;
    }
    
    // Loading state
    loginBtn.textContent = 'Entrando...';
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate login API call
    setTimeout(() => {
        // Reset button state
        loginBtn.textContent = 'Entrar';
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        // Show success message
        showToast('Login realizado!', 'Bem-vindo ao Code Burger!');
        
        // Here you would typically redirect or handle successful login
        console.log('Login successful:', { email });
        
        // Optional: Clear form
        document.getElementById('loginForm').reset();
        
    }, 1500);
});

// Close toast when clicking outside
document.addEventListener('click', function(e) {
    const toast = document.getElementById('toast');
    if (!toast.contains(e.target) && toast.classList.contains('show')) {
        hideToast();
    }
});

// Enhanced UX: Focus management
document.addEventListener('DOMContentLoaded', function() {
    // Focus first input on load
    document.getElementById('email').focus();
    
    // Enter key navigation
    document.getElementById('email').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('password').focus();
        }
    });
});