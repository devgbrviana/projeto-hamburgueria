from config import db_serv

class Lanche (db_serv.Model):
    __tablename__ = "lanches"
    __table_args__ = {'extend_existing': True}

    id = db_serv.Column(db_serv.Integer, primary_key=True)
    nome = db_serv.Column(db_serv.String(60), nullable=True)
    preco = db_serv.Column(db_serv.Float, nullable=False)
    descricao = db_serv.Column(db_serv.String(120), nullable=False)


    def __init__(self, id, nome, preco, descricao):
        self.id = id
        self.nome = nome
        self.preco = preco
        self.descricao = descricao

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "preco": self.preco,
            "descricao": self.descricao
        }
        
### ===== Classe de exceção ===== ###

class LancheJaExiste(Exception):
    def __init__(self, msg="Erro, o lanche já existe!"):
        self.msg = msg
        super().__init__(self.msg)

class LancheNaoExiste(Exception):
    def __init__(self, msg="Erro, o lanche não existe!"):
        self.msg = msg
        super().__init__(*msg)

class CadastroDeLancheFalhado(Exception):
    def __init__(self, msg="Erro ao processar o cadastro do lanche!"):
        self.msg = msg
        super().__init__(*msg)

class LancheSemId(Exception):
    def __init__(self, msg="Erro! Preencha o campo 'id' do lanche! "):
        self.msg = msg
        super().__init__(*msg)

class LancheSemNome(Exception):
    def __init__(self, msg="Erro! Preencha o campo 'nome' do lanche! "):
        self.msg = msg
        super().__init__(*msg)

class LancheSemPreco(Exception):
    def __init__(self, msg="Erro! Preencha o compo 'Preço' do lanche!"):
        self.msg = msg
        super().__init__(*msg)



### ===== Funções auxiliares ===== ###

def criarLanche(nv_dict):
    db_serv.session.add(nv_dict)
    db_serv.session.commit()
    return {"Descrição": "Lanche criado com êxito!"}, 200


def listarLanche():
    lanches = Lanche.query.all()
    print(lanches)
    return [lanches.to_dict() for lanche in lanches]


def lancheExiste(id):
    """
    Verifica se um lanche já existe, cujo argumento é o Id.
    Caso lanche retorne None então lanche is not None, receberá False, 
    caso o contrário True.
    """
    lanche = Lanche.query.get(id)
    return lanche is not None
        
