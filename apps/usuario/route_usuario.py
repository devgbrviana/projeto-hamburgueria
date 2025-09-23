from flask import request, jsonify, Blueprint
import usuario.model_usuario as ModUso

bd_Usuario = Blueprint("Usuario", __name__)

@bd_Usuario.route("/usuario", methods=["GET"])
def listar_usuario():
    try:
        usuarios = ModUso.listarUsuarios()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify ({"Erro": str(e)}), 400


@bd_Usuario.route("/usuario/<int:id>", methods=["GET"])
def listar_usuario_id(id):
    try:
        return ModUso.listarUsuarioPorId(id), 200
    except Exception as e:
        return jsonify ({
            "Erro": "Não foi possível fazer a requisição",
            "Descrição": str(e)
        }), 500


@bd_Usuario.route("/usuario", methods=["POST"])
def criar_usuario():
    try:
        dict_usuario = request.get_json()

        if not dict_usuario or 'nome' not in dict_usuario:
            return jsonify ({"Erro": ModUso.UsuarioSemNome().msg}),400
        if not dict_usuario or 'email' not in dict_usuario:
            return jsonify({"Erro": ModUso.UsuarioSemEmail().msg}),400
        if not dict_usuario or 'senha' not in dict_usuario:
            return jsonify({"Erro": ModUso.UsuarioSemSenha().msg}), 400
        if not dict_usuario or 'endereco' not in dict_usuario:
            return jsonify({"Erro": ModUso.UsuarioSemEndereco().msg}), 400
        if not dict_usuario or 'telefone' not in dict_usuario:
            return jsonify({"Erro": ModUso.UsuarioSemTelefone().msg}), 400
        
        novo_usuario = ModUso.Usuario(
            nome=dict_usuario["nome"],
            email=dict_usuario["email"],
            senha=dict_usuario["senha"],
            telefone=dict_usuario["telefone"],
            endereco=dict_usuario["endereco"]
        )

        ModUso.criarUsuario(novo_usuario)
        return jsonify({"Mensagem": "Usuário cadastrado com sucesso!"}),201

    except Exception as e:
        return jsonify ({
            "Erro": "Não foi possível executar a requisição",
            "Detalhes": str(e)
        }), 500


@bd_Usuario.route("/usuario/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    try:
        ModUso.deletarUsuarioPorId(id)
        return jsonify ({"Mensagem":"Empresa deletada com sucesso!"}),200
    except ModUso.UsuarioNaoEncontrado as Enc:
        return jsonify ({"Requisição Inválida": str(Enc)}), 400
    except Exception as e:
        return jsonify ({"Requisição Inválida": str(e)}), 500


bd_Usuario.route("/usuario/<int:id>", methods=["PUT"])
def alterar_usuario(id):
    pass