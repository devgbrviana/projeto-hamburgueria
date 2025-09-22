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
    pass


@bd_Usuario.route("/usuario", methods=["POST"])
def criar_usuario():
    pass


@bd_Usuario.route("/usuario/<int:id>", methods=["DELETE"])
def deletar_usuario(id):
    pass


bd_Usuario.route("/usuario/<int:id>", methods=["PUT"])
def alterar_usuario(id):
    pass