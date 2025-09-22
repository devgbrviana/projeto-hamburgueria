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
    

def criarUsuario(nova_usuario):
    """
    Esta função tem como objetivo cadastrar um novo usuário no 
    Banco de dados, ela recebe um dicionário entregue através da rota,
    assim adiciona ao banco. Retornando True ou Falso a depender do caso.
    """
    try:
        db_serv.session.add(nova_usuario)
        db_serv.session.commit()
        return True
    except Exception as e:
        print(f"Erro ao cadastrar usuário: {e}")
        return False
    

def listarUsuarios():
    """
    Essa função faz uma requisição ao Banco de dados de todas os  usuários 
    cadastrados e armazenando em uma variável, assim através de um for ela
    itera sobre todos os dados e os retorna. 
    """
    usuarios = Usuario.query.all()
    return[usuario.to_dict() for usuario in usuarios]

def deletarUsuarioPorId(id_usuario):
    """
    Esta função deleta um usuário pelo seu id, tem como parâmetro o id do
    usuário, faz uma requisição ao Banco de Dados e remove esse usuário com o id
    correspondente, sem retornar nada.
    """
    Usuario = Usuario.query.get(id_usuario)
    db_serv.session.delete(Usuario)
    db_serv.session.commit()
    return