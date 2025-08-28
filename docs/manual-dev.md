Antes de rodar o projeto, é necessário criar .env na raiz do projeto com as seguintes variáveis:

```
# Configurações do Django
SECRET_KEY = 'CHANGE-ME'
DEBUG=True # True para desenvolvimento, False para produção
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
LOGLEVEL=info

# Configurações do banco de dados
DB_ENGINE=django.db.backends.postgresql
DB_HOST=db           # Mantenha 'db' pois é o nome do serviço no docker-compose
DB_NAME=CHANGE-ME
DB_USER=CHANGE-ME
DB_PASSWORD=CHANGE-ME
DB_PORT=5432
```

Depois de criar o .env, rode o comando:

```
docker-compose up --build
```

Depois de subir o projeto, rode o comando:

```
docker-compose exec app python manage.py migrate
```

Depois de rodar o comando acima, rode o comando:

```
docker-compose exec app python manage.py runserver 0.0.0.0:8000
```

Depois de rodar o comando acima, rode o comando:

```
docker-compose exec app python manage.py createsuperuser
```



