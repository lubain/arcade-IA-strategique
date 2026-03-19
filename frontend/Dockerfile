FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Vite a besoin de --host pour être accessible depuis l'extérieur du container
CMD ["npm", "run", "dev", "--", "--host"]