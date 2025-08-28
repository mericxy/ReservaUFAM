# Dockerfile para React com Vite

# Usa a imagem oficial do Node.js
FROM node:23-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./

RUN npm install
RUN npm install react-router-dom
RUN npm install axios

# Copia o restante do código
COPY . .

# Expõe a porta do servidor do frontend
EXPOSE 5173

# Comando para rodar a aplicação no vite
CMD ["npm", "run", "dev"]
