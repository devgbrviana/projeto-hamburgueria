from config import db_serv

class Lanche (db_serv.Model):
    __tablename__ = "lanches"
    __table_args__ = {'extend_existing': True}

    id = db_serv.Column(db_serv.Integer, primary_key=True)
    nome = db_serv.Column(db_serv.String(60), nullable=True)
    preco = db_serv.Column(db_serv.Float, nullable=False)
    descricao = db_serv.Column(db_serv.Sting(120), nullable=False)


    
    

