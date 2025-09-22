from config import db_serv

class Usuario(db_serv.Model):
    __tablename__ = "usuarios"
    __table_args__ = {'extend_existing': True}

    id = db_serv.Column(db_serv.Integer, primary_key=True)
    nome = db_serv.Column(db_serv.String(60), nullable=True)
    email = db_serv.Column(db_serv.String(120), unique=True, nullable=False)
    senha = db_serv.Column(db_serv.String(130), nullable=True)
    endereco = db_serv.Column(db_serv.String(130), nullable=True)
    telefone = db_serv.Column(db_serv.String(16), nullable=True, unique=True)
    

    def __init__(self, id, nome, email, senha, telefone, endereco):
        self.id = id
        self.nome = nome
        self.email = email
        self.senha = senha
        self.telefone = telefone
        self.endereco = endereco

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "senha": self.senha,
            "telefone": self.telefone,
            "endereco": self.endereco
        }
    

# ===== Classes de Exceção para Usuários ===== #

class UsuarioNaoEncontrado(Exception):
    def __init__(self, msg="Erro, Usuário não encontrado! "):
        self.msg = msg
        super().__init__(self.msg)

class UsuarioSemNome(Exception):
    def __init__(self, msg="Não é possível cadastrar um usuário sem Nome!"):
        self.msg = msg
        super().__init__(self.msg)

class UsuarioSemEmail(Exception):
    def __init__(self, msg="Não é possível cadastra um usuário sem Email!"):
        self.msg = msg
        super().__init__(self.msg)

class UsuarioSemSenha(Exception):
    def __init__(self, msg="Não é possível cadastra um usuário sem Senha!"):
        self.msg = msg
        super().__init__(self.msg)

class UsuarioSemEndereco(Exception):
    def __init__(self, msg="Não é possível cadastra um usuário sem o Endereço!"):
        self.msg = msg
        super().__init__(self.msg)

class UsuarioSemTelefone(Exception):
    def __init__(self, msg="Não é possível cadastra um usuário sem Telefone!"):
        self.msg = msg
        super().__init__(self.msg)

# ===== Funções auxiliares para Usuários ===== #

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


def listarUsuarioPorId(id_usuario):
    """
    Procura um usuário no banco de dados por ID.
    Retorna o objeto da empresa se encontrada, ou levanta uma exceção.
    """
    usuario = Usuario.query.get(id_usuario)
    if usuario is None:
        raise UsuarioNaoEncontrado()
    return usuario.to_dict()


def procurarUsuario(id_usuario):
    """
    Procura um usuário no banco de dados pelo seu id, verifica se
    o id/usuario realmente existe, retornando True ou Falso a depender
    da situação.
    """
    usuario = Usuario.query.get(id_usuario)
    if usuario is None:
        return False
    else:
        return True
    

def alterarUsuario(id_usuario, dados_atualizados):
    """
    Busca e atualiza os dados de uma empresca no banco de dados,
    caso a mesma não seja encontrada, é levantada uma exceção
    """
    
    usuario = Usuario.query.get(id_usuario)
    if usuario is None:
        raise UsuarioNaoEncontrado()
        
    usuario.nome = dados_atualizados.get('razao_social', usuario.nome)
    usuario.email = dados_atualizados.get('email', usuario.email)
    usuario.senha = dados_atualizados.get('senha', usuario.senha)
    usuario.endereco = dados_atualizados.get('endereco', usuario.endereco)
    usuario.telefone = dados_atualizados.get('telefone', usuario.telefone)

    db_serv.session.commit()
    return usuario.to_dict()