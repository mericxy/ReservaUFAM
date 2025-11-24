# Mapa de Stacks Tecnológicas - Sistema ReservaUFAM

Este documento detalha as tecnologias utilizadas no desenvolvimento do sistema ReservaUFAM, abrangendo o frontend, backend e infraestrutura, com links para suas respectivas documentações oficiais.

## Frontend

<img src="..\imgs\stack-frontend.png" alt="Stack Tecnológica Frontend ReservaUFAM">

A interface do usuário foi construída utilizando a biblioteca React, com Vite como ferramenta de build e desenvolvimento. A estilização é feita com Tailwind CSS, e o gerenciamento de rotas é realizado pelo React Router. Para comunicação com o backend, utiliza-se a biblioteca Axios. Diversas outras bibliotecas complementam o desenvolvimento, como date-fns para manipulação de datas, react-day-picker e react-datepicker para seleção de datas, e lucide-react e react-icons para ícones.

* **Linguagem:** [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* **Runtime/Build:** [Node.js v23](https://nodejs.org/dist/v23.0.0/docs/api/) (no Docker), [Vite](https://vitejs.dev/guide/)
* **Framework Principal:** [React v18](https://react.dev/blog/2022/03/29/react-v18)
* **Roteamento:** [React Router v7](https://reactrouter.com/en/main) (Nota: v7 está em pré-lançamento, link para a v6 estável se preferir: [v6](https://reactrouter.com/en/v6.22.3))
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/docs/installation) (Nota: v4 está em alpha/beta, link para a v3 estável: [v3](https://v3.tailwindcss.com/docs/installation)), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
* **Comunicação API:** [Axios](https://axios-http.com/docs/intro)
* **Componentes UI/Ícones:** [lucide-react](https://lucide.dev/guide/packages/lucide-react), [react-icons](https://react-icons.github.io/react-icons/)
* **Gerenciamento de Datas:** [date-fns](https://date-fns.org/docs/Getting-Started), [react-day-picker](https://react-day-picker.js.org/), [react-datepicker](https://reactdatepicker.com/)

## Backend

<img src="..\imgs\stack-backend.png" alt="Stack Tecnológica Backend ReservaUFAM">

O backend da aplicação foi desenvolvido em Python, utilizando o framework Django. A API RESTful é construída com o Django REST Framework (DRF). A autenticação é gerenciada através de tokens JWT, com as bibliotecas djangorestframework_simplejwt e PyJWT. O banco de dados utilizado é o PostgreSQL, com o driver psycopg2-binary. O envio de e-mails é integrado com o SendGrid através da biblioteca django-sendgrid-v5. Testes automatizados são realizados com pytest e pytest-django.

* **Linguagem:** [Python 3.10+](https://docs.python.org/3.10/) (definido pela imagem base do Docker)
* **Framework Principal:** [Django v5.1](https://docs.djangoproject.com/en/5.1/)
* **Framework de API:** [Django REST Framework (DRF) v3.15](https://www.django-rest-framework.org/)
* **Autenticação:** [djangorestframework_simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/), [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
* **Banco de Dados:** [PostgreSQL v15](https://www.postgresql.org/docs/15/index.html), [psycopg2-binary](https://www.psycopg.org/docs/)
* **E-mail:** [django-sendgrid-v5](https://github.com/sklarsa/django-sendgrid-v5) (Integração com [SendGrid](https://sendgrid.com/docs/))
* **Utilitários:** [python-dotenv](https://pypi.org/project/python-dotenv/), [asgiref](https://pypi.org/project/asgiref/)
* **Testes:** [pytest](https://docs.pytest.org/en/latest/), [pytest-django](https://pytest-django.readthedocs.io/en/latest/)

## Infraestrutura

<img src="..\imgs\stack-infra.png" alt="Stack Tecnológica Infraestrutura ReservaUFAM">

A infraestrutura do sistema é baseada em contêineres Docker, orquestrados pelo Docker Compose. O ambiente de desenvolvimento inclui contêineres para o frontend, backend, banco de dados PostgreSQL e um contêiner dedicado para execução de testes.

* **Contêineres:** [Docker](https://www.docker.com/) (Instalador Oficial: [Docker Desktop](https://www.docker.com/products/docker-desktop/))
* **Orquestração:** [Docker Compose](https://docs.docker.com/compose/)
* **Banco de Dados:** [PostgreSQL v15 (Imagem Docker Oficial)](https://hub.docker.com/_/postgres)
* **Serviços:** Frontend (porta 5173), Backend API (porta 8000), Banco de Dados (porta 5432), Testes