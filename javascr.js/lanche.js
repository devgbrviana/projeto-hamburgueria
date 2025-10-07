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
        // Criamos a URL da imagem baseada no ID (como você já estava fazendo)
        const imageUrl = `./assets/burgers/burger${lanche.id}.png`;

        // O 'a' agora só tem a classe e o onclick
        // O redirecionamento e salvamento de dados será feito na função 'selecionarLanche'
        const cardHTML = `
            <a href="#" class="product-item" 
               onclick="selecionarLanche('${lanche.nome}', '${imageUrl}', '${lanche.preco}')"> 
                <div class="photo">
                    <img src="${imageUrl}" alt="${lanche.nome}" />
                </div>
                <div class="info">
                    <div class="product-category">Tradicional</div>
                    <div class="product-name">${lanche.nome}</div>
                    <div class="product-description">${lanche.descricao}</div> 
                    <div class="product-price">${Number(lanche.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// **NOVA FUNÇÃO** para salvar os dados e redirecionar
function selecionarLanche(nome, imagemUrl, preco) {
    // 1. Cria um objeto com os dados do lanche
    const lancheSelecionado = {
        nome: nome,
        imagem: imagemUrl,
        preco: preco
        // Você pode adicionar lanche.descricao, lanche.id, etc., se precisar
    };

    // 2. Salva o objeto como uma string JSON no localStorage
    // 'lancheParaPersonalizar' é a chave que usaremos para recuperar depois
    localStorage.setItem('lancheParaPersonalizar', JSON.stringify(lancheSelecionado));

    // 3. Redireciona para a página de personalização
    window.location.href = 'personalizacao.html';
}