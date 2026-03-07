import random
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from flask_mail import Message
from apps.extensions import db_serv, mail 
from apps.usuario.model_usuario import Usuario 

bd_usuario = Blueprint('usuario', __name__)

@bd_usuario.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    data = request.get_json()

    nome = data.get('nome')
    email = data.get('email')
    telefone = data.get('telefone')
    endereco = data.get('endereco') 
    senha = data.get('senha')

    if not all([nome, email, senha]):
        return jsonify({"erro": "Todos os campos (nome, email, senha) são obrigatórios"}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"erro": "Este email já está cadastrado."}), 409

    # Gera o código OTP de 6 dígitos
    codigo_otp = random.randint(100000, 999999)
    senha_hash = generate_password_hash(senha)

    # Cria o usuário (is_active=False garante que ele não logue sem verificar)
    novo_usuario = Usuario(
        nome=nome,
        email=email,
        telefone=telefone,
        endereco=endereco,
        senha_hash=senha_hash,
        otp_secret=codigo_otp,
        is_active=False 
    )

    try:
        db_serv.session.add(novo_usuario)
        db_serv.session.commit()

        # Envia o E-mail com o código
        msg = Message("Ative sua conta - Code Burger",
                      recipients=[email])
        msg.body = f"Olá {nome}! Seu código de ativação é: {codigo_otp}"
        mail.send(msg)

        return jsonify({"mensagem": "Usuário criado! Verifique seu e-mail para ativar."}), 201
        
    except Exception as e:
        db_serv.session.rollback()
        print(f"Erro no cadastro: {e}")
        return jsonify({"erro": "Erro interno ao criar usuário."}), 500

@bd_usuario.route('/verificar', methods=['POST'])
def verificar_codigo():
    data = request.get_json()
    email = data.get('email')
    codigo_recebido = data.get('codigo')

    if not email or not codigo_recebido:
        return jsonify({"erro": "Email e código são obrigatórios"}), 400

    # .populate_existing() garante que foi pego os dados reais do banco
    usuario = Usuario.query.filter_by(email=email).populate_existing().first()

    if usuario and usuario.otp_secret is not None:
        if str(usuario.otp_secret) == str(codigo_recebido):
            try:
                # Altera os dados
                usuario.is_active = True
                usuario.otp_secret = None
                
                # Força a atualização
                db_serv.session.add(usuario)
                db_serv.session.flush()  # Envia para o banco mas não finaliza
                db_serv.session.commit() # Finaliza a transação
                
                return jsonify({"mensagem": "Conta ativada com sucesso!"}), 200
            except Exception as e:
                db_serv.session.rollback()
                print(f"ERRO CRÍTICO NO COMMIT: {e}")
                return jsonify({"erro": f"Erro interno ao salvar: {str(e)}"}), 500
        else:
            return jsonify({"erro": "Código de verificação inválido."}), 400
    
    return jsonify({"erro": "Usuário não encontrado ou já ativado."}), 404