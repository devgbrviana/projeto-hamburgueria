# apps/app.py

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# 1. Cria a instância do Flask
app = Flask(__name__)
CORS(app)
# 2. Copia todas as configurações do seu antigo config.py para cá
app.config['HOST'] = "0.0.0.0"
app.config['PORT'] = 5002
app.config['DEBUG'] = True
app.config['JSON_AS_ASCII'] = False

# Configuração do Banco de Dados
DB_USER = os.environ.get("DB_USER")
DB_PASWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# 3. Cria a instância do SQLAlchemy e a conecta ao app
db_serv = SQLAlchemy(app)

# 4. IMPORTANTE: Importa os blueprints DEPOIS que 'app' e 'db_serv' foram criados
from apps.lanche.route_lanche import bd_Lanche
from apps.usuario.route_usuario import bd_usuario
from apps.login.route_login import bd_login

# 5. Registra os blueprints
app.register_blueprint(bd_Lanche)
app.register_blueprint(bd_usuario, url_prefix='/usuario')
app.register_blueprint(bd_login)

# 6. O bloco if __name__ == '__main__' foi REMOVIDO daqui
# Ele será colocado no arquivo run.py