document.addEventListener('DOMContentLoaded', () => {
    buscarLanches();
});
async function buscarLanches() {
    const urlAPI = 'http://localhost:5002/lanche';
    try {
        const response = await fetch(urlAPI);

        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const lanches = await response.json();     
        console.log('Dados recebidos da API:', lanches);
        exibirLanchesNaPagina(lanches);

    } catch (error) {
        console.error('Ocorreu um erro ao buscar os lanches:', error);
        const container = document.getElementById('lista-lanches');
        if (container) {
            container.innerHTML = "<p>Desculpe, não foi possível carregar o cardápio. Tente novamente mais tarde.</p>";
        }
    }
}
function exibirLanchesNaPagina(lanches) {
    const container = document.getElementById('lista-lanches');
    if (!container) {
        console.error("Elemento 'lista-lanches' não encontrado no HTML.");
        return;
    }
    container.innerHTML = '';
    lanches.forEach(lanche => {
        const cardHTML = `
            <a href="#" class="product-item">
                <div class="photo">
                    <img src="./assets/burgers/burger${lanche.id}.png" alt="${lanche.nome}" />
                </div>
                <div class="info">
                    <div class="product-category">Tradicional</div>
                    <div class="product-name">${lanche.nome}</div>
                    
                    <!-- LINHA NOVA ADICIONADA AQUI -->
                    <div class="product-description">${lanche.descricao}</div> 

                    <div class="product-price">${Number(lanche.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}