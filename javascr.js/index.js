const url = 'https://go-wash-api.onrender.com/api/user';

async function cadastroUsuario() {
    try {
        let nome = document.getElementById('nome').value.trim();
        let email = document.getElementById('email').value.trim();
        let senha = document.getElementById('senha').value.trim();
        let cpf = document.getElementById('cpf').value.trim();
        let data_nascimento = document.getElementById('data_nascimento').value;
        let termos = document.getElementById('aceito').checked;

        let api = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                "name": nome,
                "user_type_id": 1,
                "password": senha,
                "cpf_cnpj": cpf,
                "terms": termos ? 1 : 0,
                "birthday": data_nascimento
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (api.ok) {
            let response = await api.json();
            console.log("Cadastro realizado com sucesso:", response);
            alert("Cadastro realizado com sucesso!");
            window.location.assign("../view/modelos.html");
        } else {
            let responseError = await api.json();
            console.error("Erro no Cadastro", responseError);

            let mensagemErro = "Erro no cadastro: ";
            if (responseError?.data?.errors) {
                if (responseError.data.errors.email) {
                    mensagemErro += "\n- O email já está cadastrado.";
                }
                if (responseError.data.errors.cpf_cnpj) {
                    mensagemErro += "\n- O CPF já está cadastrado.";
                }
            } else {
                mensagemErro += "\n- Erro desconhecido.";
            }
            alert(mensagemErro);
        }
    } catch (error) {
        console.error("Erro ao tentar se conectar com a API:", error);
        alert("Não foi possível concluir o cadastro no momento. Verifique sua conexão e tente novamente.");
    }
}
