import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['HOST'] = "0.0.0.0"
app.config['PORT'] = 5002
app.config['DEBUG'] = True

DB_USER = os.environ.get("DB_USER")
DB_PASWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{DB_USER}:{DB_PASWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
db_serv = SQLAlchemy(app)