# Arquivo Seed

from config import app, db_serv
from lanche.model_lanche import Lanche

def seed_database():
    lanches_de_exemplo = [
    {
        "descricao": "Pão com gergelim, um suculento hambúrguer de pura carne bovina, cheddar fatiado, molho barbecue, 6 deliciosas onion rings, tomate, alface e maionese.",
        "id": 1,
        "nome": "Java Burguer",
        "preco": 31.99
    },
    {
        "descricao": "Pão com gergelim, dois suculentos hambúrgueres de pura carne bovina, duas fatias de cheddar, quatro fatias de picles, alface, tomate, cebola, maionese e ketchup.",
        "id": 2,
        "nome": "Kotlin Burguer",
        "preco": 36.5
    },
     {
        "descricao": "Pão com gergelim, um saboroso hambúrguer de pura carne bovina, uma fatia de queijo cheddar, duas fatias de picles, ketchup e molho mostarda.",
        "id": 3,
        "nome": "Python Burguer",
        "preco": 33.99
    },
    {
        "descricao": "Um hambúrguer (carne 100% bovina), bacon, alface americana, cebola, queijo processado sabor cheddar, tomate, maionese, ketchup, mostarda e pão com gergelim.",
        "id": 4,
        "nome": "SQL Burguer",
        "preco": 39.99
    },
    {
        "descricao": "Dois hambúrgueres (carne 100% bovina), queijo processado sabor cheddar, cebola, fatias de bacon, ketchup, mostarda e pão com gergelim.",
        "id": 5,
        "nome": "PHP Burguer",
        "preco": 30.99
    },
    {
        "descricao": "Os novos sanduíches contêm dois hambúrgueres de carne 100% bovina, com um peso total de 227,6g. Além da carne, a receita inclui a exclusiva maionese com sabor de carne defumada, fatias de bacon, queijo processado, molho especial e cebola ao molho shoyu. Todos os ingredientes vêm no pão tipo brioche, garantindo uma explosão de sabores.",
        "id": 6,
        "nome": "JS Burguer",
        "preco": 36.99
    }
       
    ]

    for dados_lanche in lanches_de_exemplo:
        if not Lanche.query.get(dados_lanche["id"]):
            novo_lanche = Lanche(
                id=dados_lanche["id"],
                nome=dados_lanche["nome"],
                preco=dados_lanche["preco"],
                descricao=dados_lanche["descricao"]
            )
            db_serv.session.add(novo_lanche)

    db_serv.session.commit()
    print("Dados de exemplo OK")

with app.app_context():
    db_serv.create_all()

    seed_database()