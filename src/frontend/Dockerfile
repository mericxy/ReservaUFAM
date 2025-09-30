FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
RUN npm install react-router-dom
RUN npm install axios

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
