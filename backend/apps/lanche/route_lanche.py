from flask import Blueprint, request, jsonify
from apps.lanche.model_lanche import Lanche 
from apps.extensions import db_serv 

bd_Lanche = Blueprint('Lanche', __name__)

@bd_Lanche.route("/lanche", methods=["GET"])
@bd_Lanche.route("/admin/api/admin/produtos", methods=["GET"])
def listar_lanche():
    """
    Listar todos os lanches
    ---
    tags:
      - Lanches
    responses:
      200:
        description: Lista de lanches
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              nome:
                type: string
              preco:
                type: number
              descricao:
                type: string
      500:
        description: Erro interno do servidor
    """
    try:
        lanches_query = Lanche.query.all()
        lanches_lista = [lanche.to_dict() for lanche in lanches_query]
        return jsonify(lanches_lista), 200
    except Exception as e:
        return jsonify({"Erro": f"Erro interno do servidor: {str(e)}"}), 500


@bd_Lanche.route("/admin/api/admin/produtos", methods=["POST"]) 
def criar_lanche_admin():
    dados = request.get_json()
    
    if not dados or 'nome' not in dados or 'preco' not in dados:
        return jsonify({"Erro": "Nome e preço são obrigatórios."}), 400

    try:
        novo_lanche = Lanche(
            nome=dados['nome'],
            preco=float(dados['preco']),
            descricao=dados.get('descricao', ''),
            categoria=dados.get('categoria', 'Burgers') 
        )

        db_serv.session.add(novo_lanche)
        db_serv.session.commit()
        
        return jsonify({"Mensagem": "Lanche criado com sucesso!"}), 201

    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": str(e)}), 500


@bd_Lanche.route("/admin/api/admin/produtos/<int:id>", methods=["DELETE"])
def deletar_lanche(id_lanche):
    """
    Deletar um lanche pelo ID
    ---
    tags:
      - Lanches
    parameters:
      - in: path
        name: id_lanche
        type: integer
        required: true
        description: ID do lanche a ser deletado
    responses:
      200:
        description: Lanche deletado com sucesso
      404:
        description: Lanche não encontrado
      500:
        description: Erro interno do servidor
    """
    try:
        lanche_para_deletar = Lanche.query.get(id_lanche)

        if lanche_para_deletar is None:
            return jsonify({"Mensagem": "Lanche não encontrado."}), 404
        
        db_serv.session.delete(lanche_para_deletar)
        db_serv.session.commit()
        
        return jsonify({"Mensagem": "Lanche deletado com sucesso!"}), 200

    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": f"Erro interno do servidor: {str(e)}"}), 500
