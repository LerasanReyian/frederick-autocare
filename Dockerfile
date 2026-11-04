FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3002
ENV API_HOST=0.0.0.0

EXPOSE 3002

CMD ["npm", "run", "server"]
