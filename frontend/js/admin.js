const API_URL = "http://localhost:5002/admin/api/admin/stats";

async function carregarDadosDashboard() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do servidor");
        }

        const dados = await response.json();

        // Preenchendo os cards do html com os dados do Flask
        const cards = document.querySelectorAll('.card p');
        
        cards[0].innerText = `R$ ${dados.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        cards[1].innerText = dados.colaboradores;
        cards[2].innerText = dados.top_lanches[0].nome;

        console.log("Dashboard atualizado com sucesso!");

    } catch (error) {
        console.error("Erro no Dashboard:", error);
        alert("Não foi possível carregar os dados do painel.");
    }
}


async function carregarProdutos() {
    const response = await fetch("http://localhost:5002/admin/api/admin/produtos");
    const produtos = await response.json();
    
    const tabela = document.getElementById("lista-produtos");
    tabela.innerHTML = ""; // Limpa a linha de exemplo

    produtos.forEach(p => {
    tabela.innerHTML += `
        <tr>
            <td>#${p.id}</td>
            <td><img src="https://img.icons8.com/fluency/48/hamburger.png" width="40"></td>
            <td>${p.nome}</td>
            <td>R$ ${p.preco.toFixed(2)}</td>
            <td>
                <button class="btn-edit" onclick="editar(${p.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete" onclick="excluir(${p.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `;
});
}

async function excluir(id) {
    const confirmacao = confirm(`Tem certeza que deseja excluir o lanche #${id}?`);
    
    if (confirmacao) {
        try {
            const response = await fetch(`http://localhost:5002/admin/api/admin/produtos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Lanche removido com sucesso!");
                carregarProdutos(); 
            } else {
                const erro = await response.json();
                alert(`Erro: ${erro.Mensagem || "Não foi possível excluir"}`);
            }
        } catch (error) {
            console.error("Erro na deleção:", error);
        }
    }
}

function editar(id) {
    console.log("Abrindo edição do lanche:", id);
    alert("Funcionalidade de edição em breve!");
}

window.onload = () => {
    carregarDadosDashboard();
    carregarProdutos(); 
};