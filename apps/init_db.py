from config import app, db_serv
from lanche.model_lanche import Lanche


with app.app_context():
    db_serv.create_all()