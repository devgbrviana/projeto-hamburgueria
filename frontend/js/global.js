document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorCarrinho();
});

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contadorElement = document.getElementById('cart-counter');

    if (!contadorElement) {
        return;
    }
    const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contadorElement.textContent = quantidadeTotal;
    if (quantidadeTotal === 0) {
        contadorElement.classList.add('hidden');
    } else {
        contadorElement.classList.remove('hidden');
    }
}