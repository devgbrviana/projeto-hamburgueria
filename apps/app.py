from config import app, db_serv
from lanche.route_lanche import bd_Lanche
from usuario.route_usuario import bd_Usuario
from login.route_login import bd_Login
from flask_sqlalchemy import SQLAlchemy




app.register_blueprint(bd_Lanche)
app.register_blueprint(bd_Usuario)
app.register_blueprint(bd_Login)

app.config['JSON_AS_ASCII'] = False
if __name__ == '__main__':
    app.run(host=app.config["HOST"], port = app.config['PORT'],debug=app.config['DEBUG'] )