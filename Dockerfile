# Use the official Evolution API image
FROM atendai/evolution-api:v2.1.1

# Override environment variables for Render
ENV SERVER_PORT=8080
ENV NODE_ENV=production

# Disable all database features
ENV DATABASE_ENABLED=false
ENV DATABASE_PROVIDER=postgresql
ENV DATABASE_CONNECTION_URI=""

# Basic configuration
ENV DEL_INSTANCE=false
ENV LANGUAGE=pt-BR

EXPOSE 8080
