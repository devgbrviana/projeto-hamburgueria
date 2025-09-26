# apps/lanche/route_lanche.py

from flask import Blueprint, request, jsonify
from apps.lanche.model_lanche import Lanche # Importa o Modelo
# Se você tiver exceções customizadas no seu modelo, importe-as também. Ex:
# from apps.lanche.model_lanche import LancheSemId, LancheNaoExiste
from apps.app import db_serv # Importa a instância do banco de dados

bd_Lanche = Blueprint('Lanche', __name__)

@bd_Lanche.route("/lanche", methods=["GET"])
def listar_lanche():
    try:
        # Pega todos os lanches do banco de dados
        lanches_query = Lanche.query.all()
        # Converte a lista de objetos para uma lista de dicionários
        lanches_lista = [lanche.to_dict() for lanche in lanches_query]
        return jsonify(lanches_lista), 200
    except Exception as e:
        return jsonify({"Erro": f"Erro interno do servidor: {str(e)}"}), 500

@bd_Lanche.route("/lanche", methods=["POST"])
def criar_lanche():
    dados = request.get_json()

    # Validação dos campos de entrada
    if not dados or 'id' not in dados or 'nome' not in dados or 'preco' not in dados:
        return jsonify({"Erro": "Campos 'id', 'nome' e 'preco' são obrigatórios."}), 400

    # Verifica se o lanche já existe pelo ID
    if Lanche.query.get(dados['id']):
        return jsonify({"Erro": f"Lanche com ID {dados['id']} já existe."}), 409

    try:
        # Cria um novo objeto Lanche
        novo_lanche = Lanche(
            id=int(dados['id']),
            nome=dados['nome'],
            preco=float(dados['preco']),
            descricao=dados.get('descricao', '') # .get() é mais seguro
        )

        # Adiciona ao banco de dados
        db_serv.session.add(novo_lanche)
        db_serv.session.commit()
        
        return jsonify({"Mensagem": "Lanche criado com sucesso!"}), 201

    except ValueError:
        return jsonify({"Erro": "Requisição inválida. 'id' e 'preco' devem ser números."}), 400
    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": f"Erro interno do servidor: {str(e)}"}), 500

@bd_Lanche.route("/lanche/<int:id_lanche>", methods=["DELETE"])
def deletar_lanche(id_lanche):
    try:
        # Busca o lanche pelo ID fornecido na URL
        lanche_para_deletar = Lanche.query.get(id_lanche)

        if lanche_para_deletar is None:
            return jsonify({"Mensagem": "Lanche não encontrado."}), 404
        
        # Deleta o lanche do banco de dados
        db_serv.session.delete(lanche_para_deletar)
        db_serv.session.commit()
        
        return jsonify({"Mensagem": "Lanche deletado com sucesso!"}), 200

    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": f"Erro interno do servidor: {str(e)}"}), 500