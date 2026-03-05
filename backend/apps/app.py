import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flasgger import Swagger  

app = Flask(__name__)
CORS(app)

# Configurações do Flask
app.config['HOST'] = "0.0.0.0"
app.config['PORT'] = 5002
app.config['DEBUG'] = True
app.config['JSON_AS_ASCII'] = False

# Configuração do banco de dados
DB_USER = os.environ.get("DB_USER")
DB_PASWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializa o SQLAlchemy
db_serv = SQLAlchemy(app)

# Configuração mínima do Flasgger
swagger = Swagger(app)

# Importa e registra os Blueprints
from apps.lanche.route_lanche import bd_Lanche
from apps.usuario.route_usuario import bd_usuario
from apps.login.route_login import bd_login

app.register_blueprint(bd_Lanche)
app.register_blueprint(bd_usuario, url_prefix='/usuario')
app.register_blueprint(bd_login)

# Roda o app
if __name__ == "__main__":
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])
