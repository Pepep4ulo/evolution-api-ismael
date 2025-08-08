FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

# Create package.json with Baileys dependencies
RUN echo '{"name":"evolution-lite","version":"1.0.0","dependencies":{"@whiskeysockets/baileys":"^6.7.8","express":"^4.18.2","cors":"^2.8.5","qrcode":"^1.5.3","qrcode-terminal":"^0.12.0"}}' > package.json

# Install dependencies
RUN npm install

# Copy the enhanced server
COPY evolution-lite.js server.js

ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server.js"]
