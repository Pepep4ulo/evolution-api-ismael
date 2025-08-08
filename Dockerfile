FROM node:20-alpine

WORKDIR /app

# Install git and other dependencies
RUN apk add --no-cache git

# Clone Evolution API repository
RUN git clone https://github.com/EvolutionAPI/evolution-api.git . && \
    git checkout v2.1.1

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Set environment variables for runtime
ENV NODE_ENV=production
ENV SERVER_PORT=8080
ENV SERVER_URL=https://evolution-api-ismael-v2.onrender.com
ENV DEL_INSTANCE=false
ENV DEL_TEMP_INSTANCES=true
ENV LANGUAGE=pt-BR
ENV LOG_LEVEL=ERROR
ENV STORE_CLEANING_INTERVAL=7200000
ENV STORE_MESSAGE_UP=true
ENV WEBHOOK_GLOBAL_ENABLED=true
ENV WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false

# Completely disable database
ENV DATABASE_ENABLED=false
ENV DATABASE_PROVIDER=""
ENV DATABASE_CONNECTION_URI=""
ENV DATABASE_SAVE_DATA_INSTANCE=false
ENV DATABASE_SAVE_DATA_NEW_MESSAGE=false
ENV DATABASE_SAVE_MESSAGE_UPDATE=false
ENV DATABASE_SAVE_DATA_CONTACTS=false
ENV DATABASE_SAVE_DATA_CHATS=false

# Expose port
EXPOSE 8080

# Start without database migrations
CMD ["node", "./dist/src/main.js"]
