# Usa a imagem oficial do Python
FROM python:3.11  

WORKDIR /app  

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt  

# Instala o cliente do PostgreSQL
RUN apt-get update && apt-get install -y postgresql-client

COPY . /app/

EXPOSE 8000  

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
