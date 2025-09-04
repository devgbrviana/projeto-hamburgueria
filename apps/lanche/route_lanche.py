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
    
@bd_Lanche.route("/lanche",methods=["POST"])
def criar_lanche():
    nv_dict = request.json
    nv_dict["id"] = int(nv_dict["id"])
    nv_dict["preco"] = float(nv_dict["preco"])

    try:
        if modLan.lancheExiste(nv_dict["id"]):
            return jsonify({
                "Erro": "Requisição inválida",
                "Detalhes": str(modLan.LancheJaExiste)
            }), 409
        
        modLan.criarLanche(nv_dict)

    except modLan.CadastroDeLancheFalhado as cdt:
        return jsonify({
            "Erro": "Falha ao cadastrar lancher",
            "Detalhes": str(cdt)
        }), 400