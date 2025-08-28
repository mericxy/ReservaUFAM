[![Generic badge](https://img.shields.io/badge/status-BUILDING-yellow.svg)](https://shields.io/)
[![PyPI license](https://img.shields.io/pypi/l/ansicolortags.svg)](https://pypi.python.org/pypi/ansicolortags/)
[![GitHub commits](https://badgen.net/github/commits/Cromablue/ReservaUFAM/development)](https://GitHub.com/Cromablue/ReservaUFAM/commit/)
[![GitHub latest commit](https://badgen.net/github/last-commit/Cromablue/ReservaUFAM/development)](https://GitHub.com/Cromablue/ReservaUFAM/commit/)
[![GitHub watchers](https://img.shields.io/github/watchers/Cromablue/ReservaUFAM?style=social&label=Watch&maxAge=2592000)](https://GitHub.com/Cromablue/ReservaUFAM/watchers/)

<h1 align="center">
    <img src="./docs/img/banner-reserve.png" alt="Reserve" title="Reserve">
</h1>

<h4 align="center"> 
	🚧  Reserve 🌱 Em desenvolvimento...  🚧
</h4>

## 💻 Sobre o projeto
O **Reserve** tem como objetivo substituir o processo manual de agendamento de salas, auditórios e veículos na UFAM.  
Projeto desenvolvido para a disciplina de Engenharia de Aplicações Web do curso de Engenharia de Software da UFAM.

## Funcionalidades  
- Reserva de salas, auditórios e veículos  
- Gerenciamento de eventos e atividades acadêmicas  
- Autenticação de usuários com CPF ou SIAPE  
- Envio de e-mails de confirmação de reserva  
- Responsividade para acesso via dispositivos móveis  
- Tempo de resposta inferior a 3 segundos 

## 🛠️ Tecnologias Utilizadas
![Docker](https://img.shields.io/badge/-Docker-black?style=flat-square&logo=docker)
![Python](https://img.shields.io/badge/-Python-black?style=flat-square&logo=python)
![Django](https://img.shields.io/badge/-Django-black?style=flat-square&logo=django)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-black?style=flat-square&logo=postgresql)
![Nodejs](https://img.shields.io/badge/-Nodejs-black?style=flat-square&logo=Node.js)
![npm](https://img.shields.io/badge/-npm-black?style=flat-square&logo=npm)
![React](https://img.shields.io/badge/-React-black?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-black?style=flat-square&logo=tailwindcss)


- **Backend:** Django (REST API)  
- **Frontend:** React   
- **Banco de Dados:** PostgreSQL  
- **Autenticação:** (a definir)  
- **Containerização:** Docker 

## 🚀 Como Executar o Projeto  

### 📌 Pré-requisitos  
Antes de começar, certifique-se de ter instalado:  
**Versionamento e gerenciamento de conteiners**
   - [Git](https://git-scm.com/)  
   - [Docker](https://www.docker.com/)

**Linguagens e frameworks**
   - [Python](https://www.python.org/)  
   - [PostgreSQL](https://www.postgresql.org/)
   - [Node.js](https://nodejs.org/)  
   - [npm](https://www.npmjs.com/)  

### 🔧 Instalação e Execução  
1. Clone o repositório:  
   ```bash
   git clone https://github.com/Cromablue/ReservaUFAM.git
   cd ReservaUFAM
   ```

2. Inicie o ambiente:  
   ```bash
   docker-compose up --build -d
   ```
   Aguarde a inicialização dos containers.
   
   Caso dê um erro e queira parar o ambiente: 
   ```bash
   docker-compose down -v
   ```

3. Acesse a aplicação no navegador:  
   ```bash
   # Django
   http://localhost:8000
   # React
   http://localhost:5173
   ```
4. Para manipular as imagens do projeto
   
   **Django**
   ```bash
   cd backend
   docker exec -it reservaufam_backend bash
   ```

   **React**
   ```bash
   cd frontend
   docker exec -it reservaufam_frontend bash
   ```
5. Para sair do container
   ```bash
   exit
   ```

# Configuração

1. Configure o arquivo `.env` com as variáveis de ambiente necessárias.  
2. Configure o banco de dados **PostgreSQL**.

# Dependências

- Django  
- PostgreSQL  
- React  
- Node.js  
- Docker  

# Requisitos

- Python 3.11  
- PostgreSQL 12  
- Node.js 14  
- Docker 20  

# Público-alvo

- Alunos e professores da **UFAM**  
- Funcionários da **UFAM**  

# Casos de uso

- Reserva de sala para evento acadêmico  
- Reserva de veículo para viagem de campo  
- Gerenciamento de eventos e atividades acadêmicas  

## 📜 Licença
Este projeto é de código aberto e distribuído sob a licença MIT.
