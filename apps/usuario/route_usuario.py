# apps/usuario/route_usuario.py

from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from apps.app import db_serv
from apps.usuario.model_usuario import Usuario 

bd_usuario = Blueprint('usuario', __name__)

@bd_usuario.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()

    nome = data.get('nome')
    email = data.get('email')
    telefone = data.get('telefone')
    endereco = data.get('endereco') 
    senha = data.get('senha')

    if not all([nome, email, senha]):
        return jsonify({"erro": "Todos os campos (nome, email, senha) são obrigatórios"}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"erro": "Este email já está cadastrado."}), 409

    senha_hash = generate_password_hash(senha)

    novo_usuario = Usuario(
        nome=nome,
        email=email,
        telefone=telefone,
        endereco=endereco,
        senha_hash=senha_hash
    )

    try:
        db_serv.session.add(novo_usuario)
        db_serv.session.commit()
        return jsonify({"mensagem": "Usuário criado com sucesso!"}), 201
    except Exception as e:
        db_serv.session.rollback()
        print(f"Erro ao salvar usuário: {e}")
        return jsonify({"erro": "Erro interno ao criar usuário."}), 500

@bd_usuario.route('/', methods=['GET'])
def listar_usuarios():
    try:
        usuarios = Usuario.query.all()
        lista_de_usuarios = [usuario.to_dict() for usuario in usuarios]
        return jsonify(lista_de_usuarios), 200
        
    except Exception as e:
        print(f"Erro ao listar usuários: {e}")
        return jsonify({"erro": "Erro interno ao buscar usuários."}), 500