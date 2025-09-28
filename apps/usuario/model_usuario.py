from apps.app import db_serv
from werkzeug.security import check_password_hash, generate_password_hash

class Usuario(db_serv.Model):
    __tablename__ = 'usuarios' # Nome da tabela no banco
    id = db_serv.Column(db_serv.Integer, primary_key=True)
    nome = db_serv.Column(db_serv.String(100), nullable=False)
    email = db_serv.Column(db_serv.String(100), unique=True, nullable=False)
    telefone = db_serv.Column(db_serv.String(20), nullable=True)
    endereco = db_serv.Column(db_serv.String(200), nullable=True)
    senha_hash = db_serv.Column(db_serv.String(256), nullable=False) # Coluna para senha

    # Método para facilitar a conversão para dicionário/JSON
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'endereco': self.endereco
        }

    # Método para verificar a senha na hora do login
    def verificar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)