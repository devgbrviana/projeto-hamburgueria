import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from apps.lanche.model_lanche import Lanche 
from apps.extensions import db_serv 

bd_Lanche = Blueprint('Lanche', __name__)

destinoPasta = os.path.join('frontend', 'assets', 'burgers')
extensoes = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    """Verifica se a extensão do arquivo é permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensoes

@bd_Lanche.route("/lanche", methods=["GET"])
@bd_Lanche.route("/admin/api/admin/produtos", methods=["GET"])
def listar_lanche():
    try:
        lanches_query = Lanche.query.all()
        lanches_lista = [lanche.to_dict() for lanche in lanches_query]
        return jsonify(lanches_lista), 200
    except Exception as e:
        return jsonify({"Erro": f"Erro interno: {str(e)}"}), 500

@bd_Lanche.route("/admin/api/admin/produtos", methods=["POST"]) 
def criar_lanche_admin():
    nome = request.form.get('nome')
    preco = request.form.get('preco')
    descricao = request.form.get('descricao', '')
    categoria = request.form.get('categoria', 'Burgers')
    
    if not nome or not preco:
        return jsonify({"Erro": "Nome e preço são obrigatórios."}), 400

    try:
        arquivo = request.files.get('imagem')
        nome_arquivo = "default_burger.png" 

        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            if not os.path.exists(destinoPasta):
                os.makedirs(destinoPasta)
            arquivo.save(os.path.join(destinoPasta, filename))
            nome_arquivo = filename

        novo_lanche = Lanche(
            nome=nome,
            preco=float(preco),
            descricao=descricao,
            categoria=categoria,
            imagem=nome_arquivo 
        )

        db_serv.session.add(novo_lanche)
        db_serv.session.commit()
        return jsonify({"Mensagem": "Lanche criado com sucesso!"}), 201
    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": str(e)}), 500

@bd_Lanche.route("/admin/api/admin/produtos/<int:id>", methods=["GET"])
def buscar_lanche(id):
    try:
        lanche = db_serv.session.get(Lanche, id)
        if lanche:
            return jsonify(lanche.to_dict()), 200
        return jsonify({"Erro": "Lanche não encontrado"}), 404
    except Exception as e:
        return jsonify({"Erro": str(e)}), 500

@bd_Lanche.route("/admin/api/admin/produtos/<int:id>", methods=["PUT"])
def atualizar_lanche(id):
    try:
        lanche = db_serv.session.get(Lanche, id)
        if not lanche:
            return jsonify({"Erro": "Lanche não encontrado"}), 404

        lanche.nome = request.form.get('nome', lanche.nome)
        lanche.preco = float(request.form.get('preco', lanche.preco))
        lanche.descricao = request.form.get('descricao', lanche.descricao)
        lanche.categoria = request.form.get('categoria', lanche.categoria)

        arquivo = request.files.get('imagem')
        if arquivo and allowed_file(arquivo.filename):
            if lanche.imagem and lanche.imagem != "default_burger.png":
                caminho_antigo = os.path.join(destinoPasta, lanche.imagem)
                if os.path.exists(caminho_antigo):
                    os.remove(caminho_antigo)
            
            filename = secure_filename(arquivo.filename)
            arquivo.save(os.path.join(destinoPasta, filename))
            lanche.imagem = filename

        db_serv.session.commit()
        return jsonify({"Mensagem": "Lanche atualizado com sucesso!"}), 200
    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": str(e)}), 500

@bd_Lanche.route("/admin/api/admin/produtos/<int:id>", methods=["DELETE"])
def deletar_lanche(id):
    try:
        lanche_para_deletar = db_serv.session.get(Lanche, id)

        if lanche_para_deletar is None:
            return jsonify({"Mensagem": "Lanche não encontrado."}), 404
        
        if lanche_para_deletar.imagem and lanche_para_deletar.imagem != "default_burger.png":
            caminho_imagem = os.path.join(destinoPasta, lanche_para_deletar.imagem)
            if os.path.exists(caminho_imagem):
                os.remove(caminho_imagem)

        db_serv.session.delete(lanche_para_deletar)
        db_serv.session.commit()
        return jsonify({"Mensagem": "Lanche deletado com sucesso!"}), 200
    except Exception as e:
        db_serv.session.rollback()
        return jsonify({"Erro": f"Erro interno: {str(e)}"}), 500