const API_URL = "http://localhost:5002/admin/api/admin/stats";
const API_PRODUTOS = "http://localhost:5002/admin/api/admin/produtos";

async function carregarDadosDashboard() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do servidor");
        }

        const dados = await response.json();

        const cards = document.querySelectorAll('.card p');
        
        cards[0].innerText = `R$ ${dados.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        cards[1].innerText = dados.colaboradores;
        cards[2].innerText = dados.top_lanches[0].nome;

    } catch (error) {
        console.error("Erro no Dashboard:", error);
        alert("Não foi possível carregar os dados do painel.");
    }
}


async function carregarProdutos() {
    try {
        const response = await fetch(API_PRODUTOS);
        const produtos = await response.json();
        
        const tabela = document.getElementById("lista-produtos");
        tabela.innerHTML = "";

        produtos.forEach(p => {
            tabela.innerHTML += `
                <tr>
                    <td>#${p.id}</td>
                    <td><img src="https://img.icons8.com/fluency/48/hamburger.png" width="40"></td>
                    <td>${p.nome}</td>
                    <td>R$ ${Number(p.preco).toFixed(2)}</td>
                    <td>
                        <button class="btn-edit" onclick="editar(${p.id})">
                            <i class="fa-solid fa-pen"></i>
                        </button>

                        <button class="btn-delete" onclick="excluir(${p.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}


async function excluir(id) {
    const confirmacao = confirm(`Tem certeza que deseja excluir o lanche #${id}?`);
    
    if (!confirmacao) return;

    try {
        const response = await fetch(`${API_PRODUTOS}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("Lanche removido com sucesso!");
            carregarProdutos(); 
        } else {
            const erro = await response.json();
            alert(`Erro: ${erro.erro || "Não foi possível excluir"}`);
        }

    } catch (error) {
        console.error("Erro na deleção:", error);
    }
}

const modal = document.getElementById("modalLanche");
const formLanche = document.getElementById("formLanche");

function abrirModal(lanche = null) {
    modal.style.display = "block";
    formLanche.reset();
    document.getElementById("lancheId").value = "";

    if (lanche) {
        document.getElementById("modalTitle").innerText = "Editar Lanche";
        document.getElementById("lancheId").value = lanche.id;
        document.getElementById("lancheNome").value = lanche.nome;
        document.getElementById("lancheDescricao").value = lanche.descricao;
        document.getElementById("lanchePreco").value = lanche.preco;
        document.getElementById("lancheCategoria").value = lanche.categoria || "Burgers";
        document.getElementById("lancheImagem").value = lanche.imagem || "";
    } else {
        document.getElementById("modalTitle").innerText = "Novo Produto";
    }
}

function fecharModal() {
    modal.style.display = "none";
}

async function criar() {
    abrirModal();
}

async function editar(id) {
    try {
        const response = await fetch(`${API_PRODUTOS}/${id}`);
        const lanche = await response.json();
        abrirModal(lanche);
    } catch (error) {
        alert("Erro ao buscar dados do lanche");
    }
}

formLanche.onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById("lancheId").value;
    const dados = {
        nome: document.getElementById("lancheNome").value,
        descricao: document.getElementById("lancheDescricao").value,
        preco: Number(document.getElementById("lanchePreco").value),
        categoria: document.getElementById("lancheCategoria").value,
        imagem: document.getElementById("lancheImagem").value
    };

    const url = id ? `${API_PRODUTOS}/${id}` : API_PRODUTOS;
    const metodo = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            fecharModal();
            carregarProdutos();
            carregarDadosDashboard();
        } else {
            alert("Erro ao salvar o produto.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
};

formLanche.onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById("lancheId").value;
    
    const formData = new FormData();
    formData.append("nome", document.getElementById("lancheNome").value);
    formData.append("descricao", document.getElementById("lancheDescricao").value);
    formData.append("preco", document.getElementById("lanchePreco").value);
    formData.append("categoria", document.getElementById("lancheCategoria").value);

    const inputImagem = document.getElementById("lancheImagem");
    if (inputImagem.files[0]) {
        formData.append("imagem", inputImagem.files[0]);
    }

    const url = id ? `${API_PRODUTOS}/${id}` : API_PRODUTOS;
    const metodo = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: metodo,
            body: formData 
        });

        if (response.ok) {
            fecharModal();
            carregarProdutos();
            carregarDadosDashboard();
        } else {
            const erroData = await response.json();
            alert(`Erro: ${erroData.Erro || "Erro ao salvar o produto."}`);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha na comunicação com o servidor.");
    }
};


window.onclick = (event) => {
    if (event.target == modal) fecharModal();
};


window.onload = () => {
    carregarDadosDashboard();
    carregarProdutos(); 
};