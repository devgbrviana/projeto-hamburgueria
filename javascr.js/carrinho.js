document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
    adicionarEventListenersGlobais();
});

function formatPrice(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function saveCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function renderizarCarrinho() {
    const carrinho = getCarrinho();
    const container = document.getElementById('lista-itens');
    container.innerHTML = ''; 

    if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio.</p>';
        atualizarResumo(0);
        return;
    }

    let subtotal = 0;

    carrinho.forEach(item => {
        const extrasHtml = item.extras.map(extra =>
            `<li>+ ${extra.nome} (${extra.quantidade})</li>`
        ).join('');

        const itemHtml = `
            <div class="item-carrinho" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="info">
                    <p class="nome-produto">${item.nome}</p>
                    <ul class="lista-extras-item">${extrasHtml}</ul>
                    <p class="preco-unitario">${formatPrice(item.precoTotalUnitario)}</p>
                </div>
                <div class="acoes">
                    <div class="contador">
                        <button class="decrease">-</button>
                        <input type="text" class="quantity" value="${item.quantidade}" readonly>
                        <button class="increase">+</button>
                    </div>
                    <div class="botoes-acao">
                        <button class="btn-editar"><i class="fas fa-pencil-alt"></i> Editar</button>
                        <button class="btn-excluir"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
        subtotal += item.precoTotalUnitario * item.quantidade;
    });

    atualizarResumo(subtotal);
    
}

function atualizarResumo(subtotal) {
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(subtotal);
}

function adicionarEventListenersGlobais() {
    const container = document.getElementById('lista-itens');

    container.addEventListener('click', (event) => {
        const target = event.target;
        const itemElement = target.closest('.item-carrinho');
        if (!itemElement) return;

        const itemId = Number(itemElement.getAttribute('data-id'));

        if (target.closest('.increase')) {
            atualizarQuantidade(itemId, 1);
        } else if (target.closest('.decrease')) {
            atualizarQuantidade(itemId, -1);
        } else if (target.closest('.btn-excluir')) {
            removerItem(itemId);
        } else if (target.closest('.btn-editar')) { 
            editarItem(itemId);
        }
    });
}


function editarItem(itemId) {
    let carrinho = getCarrinho();
    const itemParaEditar = carrinho.find(item => item.id === itemId);

    if (itemParaEditar) {
        localStorage.setItem('itemParaEditar', JSON.stringify(itemParaEditar));
        const novoCarrinho = carrinho.filter(item => item.id !== itemId);
        saveCarrinho(novoCarrinho);
        window.location.href = 'personalizacao.html';
    }
}


function atualizarQuantidade(itemId, mudanca) {
    let carrinho = getCarrinho();
    const itemIndex = carrinho.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        carrinho[itemIndex].quantidade += mudanca;
        if (carrinho[itemIndex].quantidade <= 0) {
            carrinho.splice(itemIndex, 1);
        }
        saveCarrinho(carrinho);
        renderizarCarrinho();
    }
}

function removerItem(itemId) {
    let carrinho = getCarrinho().filter(item => item.id !== itemId);
    saveCarrinho(carrinho);
    renderizarCarrinho();
}