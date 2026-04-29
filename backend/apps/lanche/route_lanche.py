import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from apps.lanche.model_lanche import Lanche 
from apps.extensions import db_serv 

# Definindo o Blueprint
bd_Lanche = Blueprint('Lanche', __name__)

# Configuração da pasta de destino dos lanches (caminho relativo ao root do projeto)
destinoPasta = os.path.join('frontend', 'assets', 'burgers')
extensoes = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    """Verifica se a extensão do arquivo é permitida."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensoes

@bd_Lanche.route("/lanche", methods=["GET"])
@bd_Lanche.route("/admin/api/admin/produtos", methods=["GET"])
def listar_lanche():
    """Lista todos os lanches para a Home e Admin."""
    try:
        lanches_query = Lanche.query.all()
        lanches_lista = [lanche.to_dict() for lanche in lanches_query]
        return jsonify(lanches_lista), 200
    except Exception as e:
        return jsonify({"Erro": f"Erro interno: {str(e)}"}), 500

@bd_Lanche.route("/admin/api/admin/produtos", methods=["POST"]) 
def criar_lanche_admin():
    """Cria um novo lanche processando o upload da imagem física."""
    # Como usamos FormData no JS, pegamos os textos via request.form
    nome = request.form.get('nome')
    preco = request.form.get('preco')
    descricao = request.form.get('descricao', '')
    categoria = request.form.get('categoria', 'Burgers')
    
    if not nome or not preco:
        return jsonify({"Erro": "Nome e preço são obrigatórios."}), 400

    try:
        # Processamento da Imagem (Sistema de Arquivos)
        arquivo = request.files.get('imagem')
        nome_arquivo = "default_burger.png" # Fallback caso não envie foto

        if arquivo and allowed_file(arquivo.filename):
            filename = secure_filename(arquivo.filename)
            
            # Garante que a pasta de assets existe no servidor/container
            if not os.path.exists(destinoPasta):
                os.makedirs(destinoPasta)
                
            # Salva o arquivo fisicamente na pasta
            arquivo.save(os.path.join(destinoPasta, filename))
            nome_arquivo = filename

        # Cria a instância do modelo com o nome do arquivo salvo
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

@bd_Lanche.route("/admin/api/admin/produtos/<int:id>", methods=["DELETE"])
def deletar_lanche(id):
    """Deleta o lanche do banco e remove o arquivo físico correspondente."""
    try:
        lanche_para_deletar = Lanche.query.get(id)

        if lanche_para_deletar is None:
            return jsonify({"Mensagem": "Lanche não encontrado."}), 404
        
        # Opcional: Remove a imagem da pasta assets para não acumular lixo
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