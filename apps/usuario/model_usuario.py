from config import db_serv

class Usuario(db_serv.Model):
    __tablename__ = "usuarios"
    __table_args__ = {'extend_existing': True}

    id = db_serv.Column(db_serv.Integer, primary_key=True)
    nome = db_serv.Column(db_serv.String(60), nullable=True)
    email = db_serv.Column(db_serv.String(120), unique=True, nullable=False)
    senha = db_serv.Column(db_serv.String(130), nullable=True)
    telefone = db_serv.Column(db_serv.String(16), nullable=True, unique=True)

    def __init__(self, id, nome, email, senha, telefone):
        self.id = id
        self.nome = nome
        self.email = email
        self.senha = senha
        self. telefone = telefone

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "senha": self.senha,
            "telefone": self.telefone
        }