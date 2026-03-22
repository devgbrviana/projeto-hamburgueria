from flask import Blueprint, jsonify, request
from apps.lanche.model_lanche import Lanche,listarLanche
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_stats():
    return jsonify({
        "faturamento": 1500.50,
        "colaboradores": 8,
        "top_lanches": [{"nome": "Double Bacon", "vendas": 45}]
    })
    
@admin_bp.route('/api/admin/produtos', methods=['GET'])
def listar_produtos_admin():
    try:
        lanches = listarLanche()
        return jsonify(lanches), 200
    except Exception as e:
        print(f"ERRO NO BACKEND: {e}")
        return jsonify({"erro": str(e)}), 500