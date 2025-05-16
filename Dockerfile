FROM node:16.3

WORKDIR /app
COPY package*.json .

RUN npm install

COPY . .
EXPOSE 4200
CMD ["npm", "start"]
