import os
from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from apps.extensions import db_serv, mail 

app = Flask(__name__)
CORS(app)

# CONFIGURAÇÕES DE E-MAIL
app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USER")
app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = 'noreply@codeburger.com'

# CONFIGURAÇÃO DO BANCO DE DADOS
DB_USER = os.environ.get("MYSQL_USER_APP", "root")
DB_PASSWORD = os.environ.get("MYSQL_PASSWORD_APP", "12345")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# INICIALIZAÇÃO DAS EXTENSÕES 
db_serv.init_app(app)
mail.init_app(app)
swagger = Swagger(app)

# CONFIGURAÇÕES GERAIS
app.config['HOST'] = "0.0.0.0"
app.config['PORT'] = 5002
app.config['DEBUG'] = True

# REGISTRO DE BLUEPRINTS 
from apps.lanche.route_lanche import bd_Lanche
from apps.usuario.route_usuario import bd_usuario
from apps.login.route_login import bd_login

app.register_blueprint(bd_Lanche)
app.register_blueprint(bd_usuario, url_prefix='/usuario')
app.register_blueprint(bd_login)

if __name__ == "__main__":
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])