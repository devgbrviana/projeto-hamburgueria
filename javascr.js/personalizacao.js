// personalizacao.js

// 1. Variável Global para armazenar o preço base do lanche e o preço total atual
let precoBaseLanche = 0; 
let precoTotalAtual = 0; 
const burgerPriceElement = document.getElementById('burger-price');

document.addEventListener('DOMContentLoaded', () => {
    // Primeiro, carregamos os dados do lanche, incluindo o preço base
    carregarDadosDoLanche();
    
    // Depois, inicializamos a lógica dos botões de extras
    inicializarContadoresExtras();
});


// Função de formatação de preço (útil para toda a aplicação)
function formatPrice(value) {
    // Garante que o valor é um número e formata para BRL
    return Number(value).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}


// **FUNÇÃO DE CARREGAMENTO DO LANCHE (Atualizada)**
function carregarDadosDoLanche() {
    const lancheJson = localStorage.getItem('lancheParaPersonalizar');

    if (lancheJson) {
        try {
            const lanche = JSON.parse(lancheJson);
            
            // ⭐️ ATUALIZAÇÃO CHAVE: Salva o preço base na variável global
            precoBaseLanche = parseFloat(lanche.preco); 
            
            document.getElementById('burger-name').textContent = lanche.nome;
            document.getElementById('burger-image').src = lanche.imagem;
            document.getElementById('burger-image').alt = `Imagem de ${lanche.nome}`;
            
            // Inicializa o preço total com o preço base
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


// **2. FUNÇÃO CENTRAL DE CÁLCULO**
function calcularTotalDoPedido() {
    let custoTotalExtras = 0;

    // Itera sobre todos os itens extras na lista
    document.querySelectorAll(".extra").forEach(extra => {
        const unitPrice = parseFloat(extra.getAttribute("data-price"));
        // Pega a quantidade atualizada do input
        const quantity = parseInt(extra.querySelector(".quantity").value, 10); 
        
        custoTotalExtras += unitPrice * quantity;
    });

    // Calcula o novo preço total do lanche
    precoTotalAtual = precoBaseLanche + custoTotalExtras;

    // 3. Atualiza o valor do lanche no DOM
    burgerPriceElement.textContent = formatPrice(precoTotalAtual);
}


// **4. LÓGICA DE CONTADORES E PREÇOS DOS EXTRAS**
function inicializarContadoresExtras() {
    document.querySelectorAll(".extra").forEach(extra => {
        const decreaseBtn = extra.querySelector(".decrease");
        const increaseBtn = extra.querySelector(".increase");
        const quantityInput = extra.querySelector(".quantity");
        const priceLabel = extra.querySelector(".extra-price");

        const unitPrice = parseFloat(extra.getAttribute("data-price")); 
        // Recupera a quantidade inicial do input (que deve ser 0)
        let quantity = parseInt(quantityInput.value, 10) || 0; 

        function updateExtraDisplay() {
            const total = unitPrice * quantity;
            
            // Atualiza o preço do extra individualmente
            priceLabel.textContent = `+ ${formatPrice(total)}`;
            
            // Atualiza o input de quantidade
            quantityInput.value = quantity;
            
            // ⭐️ CHAMADA CHAVE: Recalcula o preço total do lanche
            calcularTotalDoPedido(); 
        }
        
        // Inicializa o display do extra
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