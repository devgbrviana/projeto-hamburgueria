import random
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash
from flask_mail import Message
from apps.extensions import db_serv, mail 
from apps.usuario.model_usuario import Usuario 

bd_usuario = Blueprint('usuario', __name__)

@bd_usuario.route('/cadastro', methods=['POST'])
def cadastrar_usuario():
    dados = request.get_json()
    email_cliente = dados.get('email')
    nome_cliente = dados.get('nome')

    try:
        msg = Message(
            subject=f"Bem-vindo à Code Burger, {nome_cliente}!",
            recipients=[email_cliente],
            body=f"Olá {nome_cliente}, seu cadastro foi realizado com sucesso!\n\nAgora você já pode fazer seus pedidos em nossa plataforma."
        )
        mail.send(msg)
        print(f"E-mail enviado para {email_cliente}")
    except Exception as e:
        print(f"Falha ao enviar e-mail: {str(e)}")

    return jsonify({"message": "Usuário cadastrado com sucesso!"})

@bd_login.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    dados = request.get_json()
    email_usuario = dados.get('email')

    #código aleatório de 6 dígitos
    codigo_recuperacao = ''.join(random.choices(string.digits, k=6))

    #Lógica de Negócio 

    try:
        # Criar e enviar a mensagem
        msg = Message(
            subject="Recuperação de Senha - Code Burger",
            recipients=[email_usuario],
            body=f"Olá!\n\nRecebemos uma solicitação de recuperação de senha.\n"
                 f"Seu código de segurança é: {codigo_recuperacao}\n\n"
                 f"Se você não solicitou isso, ignore este e-mail."
        )
        mail.send(msg)
        
        return jsonify({
            "message": "Código de recuperação enviado com sucesso!",
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "message": "Erro ao enviar e-mail de recuperação.",
            "error": str(e)
        }), 500

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