FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5002

CMD ["python", "run.py"]

#-------------------------------------------------------------------#
#                       Ordens dos comandos                         #
#-------------------------------------------------------------------#
# 1 - 'docker-compose build --no-cache api'
# 2 - 'docker-compose run -- api python apps/init_db.py'
# 3 - 'docker-compose up'
#-------------------------------------------------------------------#
