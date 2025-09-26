# apps/login/route_login.py

from flask import request, jsonify, Blueprint
from apps.usuario.model_usuario import Usuario
from apps.app import db_serv # <-- Adicionado por consistência

bd_login = Blueprint('login', __name__)

@bd_login.route('/login', methods=['POST'])
def logar():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and usuario.verificar_senha(senha):
        return jsonify({
            "mensagem": "Login bem-sucedido",
            "usuario": usuario.to_dict()
        }), 200
    else:
        return jsonify({"erro": "Email ou senha incorretos"}), 401