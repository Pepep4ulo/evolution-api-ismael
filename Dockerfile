FROM node:20

WORKDIR /app

# Clone and install Evolution API v2
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/EvolutionAPI/evolution-api.git .
RUN npm install --force
RUN npm run build

# Environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=8080

# Disable database completely
ENV DATABASE_ENABLED=false

EXPOSE 8080

CMD ["npm", "start"]
