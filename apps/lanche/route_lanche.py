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