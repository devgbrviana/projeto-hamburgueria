from flask import jsonify, request, Blueprint
import login.model_login as modLog
import usuario.model_usuario as modUso


bd_Login = Blueprint("Login", __name__)

@bd_Login.route("/login", methods=["POST"])
def logar():
    try:
        data = request.get_json()
        email = data.get('email')
        senha = data.get('senha')

        usuario_logado = modUso.loginUsuario(email, senha)

        if usuario_logado is None:
            return jsonify ({"erro": modLog.CampoIncorreto().msg}), 400
        else:
            return jsonify ({
                "mensagem": "Login bem-sucedido",
                "usuario": usuario_logado.to_dict()
                }), 200
    
    except Exception as e:
        print(f"Erro no processo de login {e}")
        return jsonify({"erro": "Erro interno no servidor"}), 500