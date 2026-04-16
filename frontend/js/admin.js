const API_URL = "http://localhost:5002/admin/api/admin/stats";
const API_PRODUTOS = "http://localhost:5002/admin/api/admin/produtos";

// 🔥 DASHBOARD
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


// 🔥 LISTAR PRODUTOS
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


// 🔥 EXCLUIR
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


// 🔥 EDITAR (AGORA FUNCIONANDO)
async function editar(id) {
    try {
        const nome = prompt("Novo nome do lanche:");
        const descricao = prompt("Nova descrição:");
        const preco = prompt("Novo preço:");

        if (!nome || !descricao || !preco) {
            alert("Preencha todos os campos!");
            return;
        }

        const response = await fetch(`${API_PRODUTOS}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                descricao,
                preco: Number(preco)
            })
        });

        if (response.ok) {
            alert("Lanche atualizado com sucesso!");
            carregarProdutos();
        } else {
            const erro = await response.json();
            alert(`Erro: ${erro.erro || "Erro ao atualizar"}`);
        }

    } catch (error) {
        console.error("Erro ao editar:", error);
    }
}


// 🚀 INIT
window.onload = () => {
    carregarDadosDashboard();
    carregarProdutos(); 
};