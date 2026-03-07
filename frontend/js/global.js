document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();

    document.addEventListener('click', function(e) {
        const toast = document.getElementById('toast');
        if (toast && !toast.contains(e.target) && toast.classList.contains('show')) {
            hideToast();
        }
    });
});

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contadorElement = document.getElementById('cart-counter');
    if (!contadorElement) return;

    const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadorElement.textContent = quantidadeTotal;
    
    if (quantidadeTotal === 0) {
        contadorElement.style.display = 'none';
    } else {
        contadorElement.style.display = 'flex';
    }
}

function showToast(title, description) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastDescription = document.getElementById('toastDescription');
    
    if(!toast) return;

    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('show'), 10);
    
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => hideToast(), 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
}