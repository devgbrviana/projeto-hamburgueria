let todosOsLanches = [];

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
        todosOsLanches = await response.json(); 
        console.log('Dados recebidos da API:', todosOsLanches);
        filtrarPorCategoria('Burgers');

    } catch (error) {
        console.error('Ocorreu um erro ao buscar os lanches:', error);
        const container = document.getElementById('lista-lanches');
        if (container) {
            container.innerHTML = "<p>Desculpe, não foi possível carregar o cardápio. Tente novamente mais tarde.</p>";
        }
    }
}

function filtrarPorCategoria(categoriaDesejada) {
    const lanchesFiltrados = todosOsLanches.filter(lanche => 
        lanche.categoria.toLowerCase() === categoriaDesejada.toLowerCase()
    );
    exibirLanchesNaPagina(lanchesFiltrados);
}

function exibirLanchesNaPagina(lanches) {
    const container = document.getElementById('lista-lanches');
    if (!container) {
        console.error("Elemento 'lista-lanches' não encontrado no HTML.");
        return;
    }
    container.innerHTML = '';

    if (lanches.length === 0) {
        container.innerHTML = '<p style="color:white; text-align:center;">Nenhum item encontrado nesta categoria.</p>';
        return;
    }

    lanches.forEach(lanche => {
        
        let pasta = '';
        let prefixo = '';

        switch (lanche.categoria) {
            case 'Burgers':
                pasta = 'burgers';
                prefixo = 'burger'; // Ex: burger1.png
                break;
            case 'Pizza':
                pasta = 'pizza';
                prefixo = 'pizza'; // Ex: pizza10.png
                break;
            case 'Vegetariano':
                pasta = 'vegetariano'; //
                prefixo = 'vegetariano'; // Ex: vegetariano20.png
                break;
            case 'Kids':
                pasta = 'kids'; 
                prefixo = 'kids'; // Ex: kids30.png
                break;
            default:
                pasta = 'burgers';
                prefixo = 'burger';
        }

        const imageUrl = `./assets/${pasta}/${prefixo}${lanche.id}.png`;

        const cardHTML = `
            <a href="#" class="product-item" 
               onclick="selecionarLanche('${lanche.nome}', '${imageUrl}', '${lanche.preco}')"> 
                <div class="photo">
                    <img src="${imageUrl}" alt="${lanche.nome}" onerror="this.src='./assets/burgers/burger1.png'"/>
                </div>
                <div class="info">
                    <div class="product-category">${lanche.categoria}</div>
                    <div class="product-name">${lanche.nome}</div>
                    <div class="product-description">${lanche.descricao}</div> 
                    <div class="product-price">${Number(lanche.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}


function selecionarLanche(nome, imagemUrl, preco) {
    const lancheSelecionado = {
        nome: nome,
        imagem: imagemUrl,
        preco: preco
    };

    localStorage.setItem('lancheParaPersonalizar', JSON.stringify(lancheSelecionado));

    window.location.href = 'personalizacao.html';
}
