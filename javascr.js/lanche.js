
const urlAPI = 'http://localhost:5002/lanche';

async function buscarLanches() {
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
    }
}

function exibirLanchesNaPagina(lanches) {

    const container = document.getElementById('lista-lanches');

    container.innerHTML = '';

    lanches.forEach(lanche => {
        const divLanche = document.createElement('div');
        divLanche.classList.add('lanche-item');
        divLanche.innerHTML = `
            <h3>${lanche.nome}</h3>
            <p>Preço: R$ ${lanche.preco.toFixed(2)}</p>
            <p>Descrição: ${lanche.descricao}</p>
        `;
        container.appendChild(divLanche);
    });
}


buscarLanches();