let precoBaseLanche = 0;
let precoTotalAtual = 0;
const burgerPriceElement = document.getElementById('burger-price');

const extrasPorCategoria = {
    'Burger': [
        { nome: 'Molho Tasty', preco: 2.50, img: 'molho_tasty.png' },
        { nome: 'Cebola fresca', preco: 2.00, img: 'cebola.png' },
        { nome: 'Alface', preco: 2.00, img: 'alface.png' },
        { nome: 'Bacon', preco: 3.00, img: 'bacon.png' },
        { nome: 'Carne', preco: 8.00, img: 'carne.png' },
        { nome: 'Queijo', preco: 2.00, img: 'queijo.png' }
    ],
    'Pizza': [
        { nome: 'Borda de Catupiry', preco: 10.00, img: 'borda_catupiry.jpg' },
        { nome: 'Queijo Extra', preco: 5.00, img: 'queijo.png' },
        { nome: 'Azeitonas', preco: 2.00, img: 'azeitona.png' }
    ],
    'Vegetariano': [
        { nome: 'Alface Extra', preco: 1.50, img: 'alface.png' },
        { nome: 'Cebola Roxa', preco: 2.00, img: 'cebola_roxa.png' },
        { nome: 'Molho de Ervas', preco: 2.50, img: 'molho_ervas.png' }
    ],
    'Kids': [
        { nome: 'Batata Frita', preco: 5.00, img: 'batata_frita.png' },
        { nome: 'Maionese Kids', preco: 1.00, img: 'maionese.png' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tenta iniciar modo edição
    const modoEdicaoAtivado = iniciarModoEdicao();
    
    // 2. Se não for edição, carrega dados normais da home
    if (!modoEdicaoAtivado) {
        carregarDadosDoLanche();
    }

    // 3. Aplica validação visual nos botões
    verificarBotoesEdicao();
    inicializarContadoresAdicionais();

    const btnAdicionar = document.querySelector('.btn-add');
    const btnSalvar = document.querySelector('.btn-save');

    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', (e) => adicionarAoCarrinho('carrinho.html', e));
    }
    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => adicionarAoCarrinho('carrinho.html', e));
    }
});

function iniciarModoEdicao() {
    const itemJson = localStorage.getItem('itemParaEditar');
    if (!itemJson) return false;

    try {
        const item = JSON.parse(itemJson);

        // Preencher Dados Básicos
        document.getElementById('burger-name').textContent = item.nome;
        const imgElement = document.getElementById('burger-image');
        imgElement.src = item.imagem;
        imgElement.alt = item.nome;
        const campoDescricao = document.querySelector('.produto .descricao');
        if (campoDescricao) {
            campoDescricao.textContent = item.descricao || "Sua personalização salva!";
        }

        precoBaseLanche = parseFloat(item.precoBase);
        precoTotalAtual = parseFloat(item.precoTotalUnitario);
        if (burgerPriceElement) {
            burgerPriceElement.textContent = formatPrice(precoTotalAtual);
        }

        // Renderizar extras baseados na categoria correta do item salvo
        renderizarExtras(item.categoria || 'Burger');

        // Preencher quantidades dos extras com delay para o DOM carregar
        setTimeout(() => { 
            document.querySelectorAll(".extra").forEach(extraElement => {
                const extraName = extraElement.querySelector('.extra-name').textContent.trim();
                const extraSalvo = item.extras.find(e => e.nome === extraName);
                
                if (extraSalvo) {
                    const input = extraElement.querySelector('.quantity');
                    input.value = extraSalvo.quantidade;
                    input.setAttribute('data-raw-value', extraSalvo.quantidade);
                }
            });
            calcularTotalDoPedido();
        }, 150);

        const btnSalvar = document.querySelector('.btn-save');
        if (btnSalvar) btnSalvar.textContent = "Atualizar item";

        return true;
    } catch (error) {
        console.error("Erro ao carregar edição:", error);
        return false;
    }
}

function carregarDadosDoLanche() {
    const lancheJson = localStorage.getItem('lancheParaPersonalizar');
    if (lancheJson) {
        const lanche = JSON.parse(lancheJson);
        precoBaseLanche = parseFloat(lanche.preco);
        document.getElementById('burger-name').textContent = lanche.nome;
        document.getElementById('burger-image').src = lanche.imagem;
        document.getElementById('burger-image').alt = lanche.nome;

        const campoDescricao = document.querySelector('.produto .descricao');
            if (campoDescricao) {
                campoDescricao.textContent = lanche.descricao || "Experimente essa combinação irresistível!";
            }
        
        precoTotalAtual = precoBaseLanche;
        burgerPriceElement.textContent = formatPrice(precoTotalAtual);
        renderizarExtras(lanche.categoria);
    }
}

function renderizarExtras(categoria) {
    const listaUl = document.querySelector('.lista-extras');
    if (!listaUl) return;
    listaUl.innerHTML = '';

    const extras = extrasPorCategoria[categoria] || [];
    if (extras.length === 0) {
        listaUl.innerHTML = '<p style="text-align:center; color:#888; padding: 20px;">Sem adicionais específicos.</p>';
        return;
    }

    extras.forEach(extra => {
        const li = document.createElement('li');
        li.className = 'extra';
        li.setAttribute('data-price', extra.preco);
        li.innerHTML = `
            <img src="/frontend/assets/adicionais/${extra.img}" alt="${extra.nome}">
            <span class="extra-name">${extra.nome}</span>
            <span class="extra-price">+ ${formatPrice(0)}</span>
            <div class="contador">
                <button class="decrease">-</button>
                <input type="text" class="quantity" value="0" readonly>
                <button class="increase">+</button>
            </div>
        `;
        listaUl.appendChild(li);
    });
    inicializarContadoresAdicionais();
}

function adicionarAoCarrinho(redirectUrl, event) {
    const itemSendoEditadoJson = localStorage.getItem('itemParaEditar');
    const itemSendoEditado = itemSendoEditadoJson ? JSON.parse(itemSendoEditadoJson) : null;

    const target = event.currentTarget || event.target;
    const clicouEmAtualizar = target.classList.contains('btn-save');
    
    // Validação do botão cinza
    if (clicouEmAtualizar && !itemSendoEditado) {
        if (typeof showToast === 'function') {
            showToast('Ops!', 'Para lanches novos, use "Incluir como novo".');
        } else {
            alert('Lanche novo! Use o botão "Incluir como novo".');
        }
        return; 
    }

    const lancheBase = {
        nome: document.getElementById('burger-name').textContent,
        imagem: document.getElementById('burger-image').src,
        precoBase: precoBaseLanche
    };

    const extrasSelecionados = [];
    document.querySelectorAll(".extra").forEach(extra => {
        const qInput = extra.querySelector(".quantity");
        const quantidade = parseInt(qInput.getAttribute('data-raw-value') || qInput.value, 10);
        if (quantidade > 0) {
            extrasSelecionados.push({
                nome: extra.querySelector('.extra-name').textContent.trim(),
                quantidade: quantidade,
                precoUnitario: parseFloat(extra.getAttribute('data-price'))
            });
        }
    });

    const lancheInfoOriginal = JSON.parse(localStorage.getItem('lancheParaPersonalizar')) || {};
    
    const itemFinal = {
        ...lancheBase,
        categoria: itemSendoEditado ? itemSendoEditado.categoria : lancheInfoOriginal.categoria,
        extras: extrasSelecionados,
        precoTotalUnitario: precoTotalAtual
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (itemSendoEditado && clicouEmAtualizar) {
        const index = carrinho.findIndex(i => String(i.id) === String(itemSendoEditado.id));
        if (index !== -1) {
            carrinho[index] = { ...itemFinal, id: itemSendoEditado.id, quantidade: itemSendoEditado.quantidade };
        }
    } else {
        carrinho.push({ ...itemFinal, id: Date.now(), quantidade: 1 });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.removeItem('itemParaEditar');
    window.location.href = redirectUrl;
}

function verificarBotoesEdicao() {
    const itemSendoEditado = localStorage.getItem('itemParaEditar');
    const btnSalvar = document.querySelector('.btn-save');
    if (!itemSendoEditado && btnSalvar) {
        btnSalvar.style.opacity = '0.4';
        btnSalvar.style.cursor = 'not-allowed';
        btnSalvar.style.filter = 'grayscale(100%)';
        btnSalvar.title = 'Disponível apenas para edições de itens do carrinho';
    }
}

function formatPrice(value) {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotalDoPedido() {
    let custoTotalExtras = 0;
    document.querySelectorAll(".extra").forEach(extra => {
        const unitPrice = parseFloat(extra.getAttribute("data-price"));
        const qInput = extra.querySelector(".quantity");
        const quantity = parseInt(qInput.getAttribute('data-raw-value') || qInput.value, 10);
        custoTotalExtras += unitPrice * quantity;
    });
    precoTotalAtual = precoBaseLanche + custoTotalExtras;
    burgerPriceElement.textContent = formatPrice(precoTotalAtual);
}

function inicializarContadoresAdicionais() {
    // Seleciona cada item da lista de adicionais
    document.querySelectorAll(".extra").forEach(itemAdicional => {
        const botaoDiminuir = itemAdicional.querySelector(".decrease");
        const botaoAumentar = itemAdicional.querySelector(".increase");
        const campoQuantidade = itemAdicional.querySelector(".quantity");
        const etiquetaPreco = itemAdicional.querySelector(".extra-price");
        const precoUnitario = parseFloat(itemAdicional.getAttribute("data-price"));

        // Função interna para atualizar o que o cliente vê na tela
        function atualizarVisualizacao() {
            // Pega a quantidade atual (prioriza o atributo raw ou o valor do input)
            let quantidadeAtual = parseInt(campoQuantidade.getAttribute('data-raw-value') || campoQuantidade.value, 10);
            
            // Calcula o total desse adicional específico e formata o preço
            etiquetaPreco.textContent = `+ ${formatPrice(precoUnitario * quantidadeAtual)}`;
            
            // Recalcula o total geral do lanche
            calcularTotalDoPedido();
        }

        // Ação ao clicar no botão de menos (-)
        botaoDiminuir.onclick = () => {
            let quantidade = parseInt(campoQuantidade.getAttribute('data-raw-value') || campoQuantidade.value, 10);
            if (quantidade > 0) {
                quantidade--;
                campoQuantidade.value = quantidade;
                campoQuantidade.setAttribute('data-raw-value', quantidade);
                atualizarVisualizacao();
            }
        };

        // Ação ao clicar no botão de mais (+)
        botaoAumentar.onclick = () => {
            let quantidade = parseInt(campoQuantidade.getAttribute('data-raw-value') || campoQuantidade.value, 10);
            quantidade++;
            campoQuantidade.value = quantidade;
            campoQuantidade.setAttribute('data-raw-value', quantidade);
            atualizarVisualizacao();
        };
    });
}