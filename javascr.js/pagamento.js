document.addEventListener('DOMContentLoaded', () => {
    const total = localStorage.getItem('totalPedido');
    const subtotal = localStorage.getItem('subtotalPedido');
    if (total) {
        const totalFormatado = Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const subtotalFormatado = subtotal 
            ? Number(subtotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : totalFormatado;

        document.getElementById('summary-subtotal').textContent = subtotalFormatado;
        document.getElementById('summary-total').textContent = totalFormatado;
    }
    const submitButton = document.getElementById('submit-payment-btn');
    submitButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        const cardNumber = document.getElementById('card-number').value;
        const cardName = document.getElementById('card-name').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;

        if (cardNumber === '' || cardName === '' || cardExpiry === '' || cardCvc === '') {
            alert('Por favor, preencha todos os dados do cartão.');
            return;
        }
        submitButton.textContent = 'Processando...';
        submitButton.disabled = true;

        setTimeout(() => {
            localStorage.removeItem('carrinho');
            localStorage.removeItem('totalPedido');
            localStorage.removeItem('subtotalPedido');
            alert('Pedido realizado com sucesso! Obrigado por comprar conosco.');
            window.location.href = 'index.html'; 
        }, 2000); 
    });
});