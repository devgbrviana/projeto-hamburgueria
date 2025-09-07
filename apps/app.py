import os
from flask import Flask
from flask_cors import CORS
from apps.extensions import db_serv
from apps.lanche.route_lanche import bd_Lanche

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['HOST'] = "0.0.0.0"
    app.config['PORT'] = 5002
    app.config['DEBUG'] = True
    app.config['JSON_AS_ASCII'] = False
    DB_USER = os.environ.get("DB_USER")
    DB_PASWORD = os.environ.get("DB_PASSWORD")
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = os.environ.get("DB_PORT")
    DB_NAME = os.environ.get("DB_NAME")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    db_serv.init_app(app)
    app.register_blueprint(bd_Lanche)
    return app
app = create_app()

if __name__ == '__main__':
    app.run(host=app.config["HOST"], port=app.config['PORT'], debug=app.config['DEBUG'])