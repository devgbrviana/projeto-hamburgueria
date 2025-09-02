from config import app, db_serv
from lanche.route_lanche import bd_Lanche
from flask_sqlalchemy import SQLAlchemy

app.register_blueprint(bd_Lanche)


if __name__ == '__main__':
    app.run(host=app.config["HOST"], port = app.config['PORT'],debug=app.config['DEBUG'] )