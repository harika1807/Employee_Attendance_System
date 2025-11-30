# backend/Dockerfile - production-ish Node image
FROM node:18-alpine

WORKDIR /app

# copy only package files first for caching
COPY package*.json ./
RUN npm ci --only=production

# copy rest of backend
COPY . .

# expose port and start
EXPOSE 5000
CMD [ "node", "server.js" ]
