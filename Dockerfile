
FROM node:22.15.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ ! -f .env ]; then cp .env.example .env; fi

EXPOSE 3000

CMD ["npm", "run", "dev"]