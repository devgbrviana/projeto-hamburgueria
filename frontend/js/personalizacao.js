let precoBaseLanche = 0;
let precoTotalAtual = 0;
const burgerPriceElement = document.getElementById('burger-price');

document.addEventListener('DOMContentLoaded', () => {
    const modoEdicaoAtivado = iniciarModoEdicao();
    if (!modoEdicaoAtivado) {
        carregarDadosDoLanche();
    }
    
    inicializarContadoresExtras();

    const btnAdicionar = document.querySelector('.btn-add');
    const btnSalvar = document.querySelector('.btn-save'); 

    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => adicionarAoCarrinho('carrinho.html'));
    } else {
        console.error("Botão 'Adicionar ao carrinho' (.btn-add) não foi encontrado!");
    }
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => adicionarAoCarrinho('index.html'));
    } else {
        console.error("Botão 'Salvar' (.btn-save) não foi encontrado!");
    }
});

function iniciarModoEdicao() {
    const itemJson = localStorage.getItem('itemParaEditar');
    if (!itemJson) {
        return false;
    }
    try {
        const item = JSON.parse(itemJson);
        precoBaseLanche = parseFloat(item.precoBase);
        document.getElementById('burger-name').textContent = item.nome;
        document.getElementById('burger-image').src = item.imagem;
        document.getElementById('burger-image').alt = `Imagem de ${item.nome}`;
        document.querySelectorAll(".extra").forEach(extraElement => {
            const extraName = extraElement.querySelector('.extra-name').textContent;
            const extraSalvo = item.extras.find(e => e.nome === extraName);
            if (extraSalvo) {
                const quantityInput = extraElement.querySelector('.quantity');
                quantityInput.value = extraSalvo.quantidade;
            }
        });
        localStorage.removeItem('itemParaEditar');
        return true;
    } catch (error) {
        console.error("Erro ao iniciar modo de edição:", error);
        localStorage.removeItem('itemParaEditar');
        return false;
    }
}

function formatPrice(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function carregarDadosDoLanche() {
    const lancheJson = localStorage.getItem('lancheParaPersonalizar');
    if (lancheJson) {
        try {
            const lanche = JSON.parse(lancheJson);
            precoBaseLanche = parseFloat(lanche.preco);
            document.getElementById('burger-name').textContent = lanche.nome;
            document.getElementById('burger-image').src = lanche.imagem;
            document.getElementById('burger-image').alt = `Imagem de ${lanche.nome}`;
            precoTotalAtual = precoBaseLanche;
            burgerPriceElement.textContent = formatPrice(precoTotalAtual);
        } catch (error) {
            console.error("Erro ao carregar dados do lanche:", error);
        }
    } else {
        console.warn("Nenhum lanche encontrado no localStorage.");
        precoBaseLanche = 0;
        precoTotalAtual = 0;
        burgerPriceElement.textContent = formatPrice(0);
    }
}

function calcularTotalDoPedido() {
    let custoTotalExtras = 0;
    document.querySelectorAll(".extra").forEach(extra => {
        const unitPrice = parseFloat(extra.getAttribute("data-price"));
        const quantity = parseInt(extra.querySelector(".quantity").value, 10);
        custoTotalExtras += unitPrice * quantity;
    });
    precoTotalAtual = precoBaseLanche + custoTotalExtras;
    burgerPriceElement.textContent = formatPrice(precoTotalAtual);
}

function inicializarContadoresExtras() {
    document.querySelectorAll(".extra").forEach(extra => {
        const decreaseBtn = extra.querySelector(".decrease");
        const increaseBtn = extra.querySelector(".increase");
        const quantityInput = extra.querySelector(".quantity");
        const priceLabel = extra.querySelector(".extra-price");
        const unitPrice = parseFloat(extra.getAttribute("data-price"));
        let quantity = parseInt(quantityInput.value, 10) || 0;

        function updateExtraDisplay() {
            const total = unitPrice * quantity;
            priceLabel.textContent = `+ ${formatPrice(total)}`;
            quantityInput.value = quantity;
            calcularTotalDoPedido();
        }
        updateExtraDisplay();
        decreaseBtn.addEventListener("click", () => {
            if (quantity > 0) {
                quantity--;
                updateExtraDisplay();
            }
        });
        increaseBtn.addEventListener("click", () => {
            quantity++;
            updateExtraDisplay();
        });
    });
}

function adicionarAoCarrinho(redirectUrl) {
    const lancheBase = {
        nome: document.getElementById('burger-name').textContent,
        imagem: document.getElementById('burger-image').src,
        precoBase: precoBaseLanche
    };

    const extrasSelecionados = [];
    document.querySelectorAll(".extra").forEach(extra => {
        const quantidade = parseInt(extra.querySelector(".quantity").value, 10);
        if (quantidade > 0) {
            extrasSelecionados.push({
                nome: extra.querySelector('.extra-name').textContent,
                quantidade: quantidade,
                precoUnitario: parseFloat(extra.getAttribute('data-price'))
            });
        }
    });

    const itemCarrinho = {
        id: Date.now(),
        ...lancheBase,
        extras: extrasSelecionados,
        quantidade: 1,
        precoTotalUnitario: precoTotalAtual
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(itemCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    window.location.href = redirectUrl;
}