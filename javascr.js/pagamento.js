document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.getElementById('card-number');
    const cardNameInput = document.getElementById('card-name');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvcInput = document.getElementById('card-cvc');
    const submitButton = document.getElementById('submit-payment-btn');

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


    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '') 
                     .replace(/(\d{4})(?=\d)/g, '$1 ')
                     .trim();
        e.target.value = value;
    });

    cardNameInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/[^a-zA-Z\sÀ-ÖØ-öø-ÿ']/g, '');
        e.target.value = value;
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value;
        let digits = value.replace(/\D/g, '');
        let mes = digits.substring(0, 2);
        let ano = digits.substring(2, 4);

        if (mes.length === 1 && mes[0] > '1') {
            mes = '0' + mes;
        }
        
        if (mes.length === 2) {
            if (parseInt(mes) > 12) {
                mes = mes[0]; 
            }
        }
       
        let finalValue = mes;
        if (ano.length > 0) {
            finalValue += '/' + ano;
        }
        
        e.target.value = finalValue;
    }); 

    cardCvcInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        e.target.value = value;
    });

    
    submitButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        const cardNumber = cardNumberInput.value.trim();
        const cardName = cardNameInput.value.trim();
        const cardExpiry = cardExpiryInput.value.trim();
        const cardCvc = cardCvcInput.value.trim();
        const errors = [];
        const regexCardNumber = /^\d{16}$/;
        const regexCardName = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ']+$/;
        const regexCardExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const regexCardCvc = /^\d{3,4}$/;
        
        if (!regexCardNumber.test(cardNumber.replace(/\s/g, ''))) {
            errors.push('Número do Cartão: deve conter 16 dígitos.');
        }

        if (cardName.length < 3 || !regexCardName.test(cardName)) {
            errors.push('Nome no Cartão: inválido (use apenas letras e espaços).');
        }

        if (!regexCardExpiry.test(cardExpiry)) {
            errors.push('Validade: deve estar no formato MM/AA (ex: 12/25).');
        } else {
            const [mes, ano] = cardExpiry.split('/');
            const expiryLastDay = new Date(`20${ano}`, mes, 0); 
            const hoje = new Date();
            if (expiryLastDay < hoje) {
                errors.push('Validade: o cartão está expirado.');
            }
        }

        if (!regexCardCvc.test(cardCvc)) {
            errors.push('CVC: deve conter 3 ou 4 dígitos.');
        }

        if (errors.length > 0) {
            alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
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