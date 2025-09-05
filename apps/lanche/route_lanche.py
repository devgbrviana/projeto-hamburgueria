from flask import Blueprint, request, jsonify
import lanche.model_lanche as modLan

bd_Lanche = Blueprint('Lanche', __name__)

@bd_Lanche.route("/lanche", methods=["GET"])
def listar_lanche():
    try:
        lanche = modLan.listarLanche()
        return jsonify(lanche)
    except Exception as e:
        return {"Erro": str(e)},400
    
@bd_Lanche.route("/lanche",methods=["POST"])
def criar_lanche():
    try:
        dados_lanche = request.get_json()
        
        if not dados_lanche or 'id' not in dados_lanche:
            return jsonify ({"Erro": modLan.LancheSemId().msg}), 400
        
        if not dados_lanche or 'nome' not in dados_lanche:
            return jsonify({"Erro": str(modLan.LancheSemNome().msg)}), 400
        
        if not dados_lanche or 'descricao' not in dados_lanche:
            return jsonify ({"Erro": modLan.LancheSemDescricao().msg}), 400
        
        if not dados_lanche or 'preco' not in dados_lanche:
            return jsonify ({"Erro": modLan.LancheSemPreco().msg}), 400
        
        lanche_id = int(dados_lanche["id"])

        if modLan.lancheExiste(lanche_id):
            return jsonify ({
                "Erro": "Conflito",
                "Descrição": modLan.LancheJaExiste().msg
            }), 409
        
        novo_lanche = modLan.Lanche(
            id=lanche_id,
            nome=dados_lanche["nome"],
            preco=float(dados_lanche["preco"]),
            descricao=dados_lanche["descricao"]
        )

        modLan.criarLanche(novo_lanche)
        return jsonify ({"Mensagem": "Lanche criado com sucesso!"}), 201
    
    except ValueError:
        return jsonify ({"Erro": "Requisição inválida", "Detalhes": "O 'id' ou 'preco' deve ser um número válido."}), 400
    
    except Exception as e:
        return jsonify({
            "Erro": "Erro interno do servidor",
            "Detalhes": str(e)
            }), 500

    except modLan.CadastroDeLancheFalhado as cdt:
        return jsonify({
            "Erro": "Falha ao cadastrar lancher",
            "Detalhes": str(cdt)
        }), 400
    
@bd_Lanche.route("/lanche/<int:id_lanche>", methods=["DELETE"])
def deletar_lanche(id_lanche):
    try:
        modLan.deletarLanche(id_lanche)
        return jsonify ({"Mensagem": "Lanche deletado com sucesso!"}),200
    except modLan.LancheNaoExiste as lne:
        return jsonify({"Erro": str(lne)}), 404