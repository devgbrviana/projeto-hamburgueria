from flask import request, jsonify, Blueprint
from apps.usuario.model_usuario import Usuario
from apps.app import db_serv 

bd_login = Blueprint('login', __name__)

@bd_login.route('/login', methods=['POST'])
def logar():
    """
    Realizar login de usuário
    ---
    tags:
      - Login
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
            senha:
              type: string
    responses:
      200:
        description: Login bem-sucedido
        schema:
          type: object
          properties:
            mensagem:
              type: string
            usuario:
              type: object
              properties:
                id:
                  type: integer
                nome:
                  type: string
                email:
                  type: string
                telefone:
                  type: string
                endereco:
                  type: string
      400:
        description: Email e senha são obrigatórios
      401:
        description: Email ou senha incorretos
    """
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
