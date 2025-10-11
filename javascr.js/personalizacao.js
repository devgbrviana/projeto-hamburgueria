let precoBaseLanche = 0; 
let precoTotalAtual = 0; 
const burgerPriceElement = document.getElementById('burger-price');

document.addEventListener('DOMContentLoaded', () => {
    carregarDadosDoLanche();
    
    inicializarContadoresExtras();
});


function formatPrice(value) {
    // Garante que o valor é um número e formata para BRL
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
        console.warn("Nenhum lanche encontrado no localStorage. Usando R$ 0,00 como base.");
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
            
            // Atualiza o input de quantidade
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
