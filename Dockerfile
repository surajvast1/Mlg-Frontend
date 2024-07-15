FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --silent --progress=false --loglevel=error

COPY . .

RUN npm run build --verbose

EXPOSE 3000

CMD ["npm", "start"]
    