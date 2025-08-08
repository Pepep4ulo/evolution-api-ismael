FROM node:20-alpine
WORKDIR /evolution
# Install Evolution API
RUN npm install -g @evolution/api
# Create necessary directories
RUN mkdir -p /evolution/instances /evolution/store
# Set environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=10000
ENV DEL_INSTANCE=false
ENV DEL_TEMP_INSTANCES=true
ENV LANGUAGE=pt-BR
# Expose port
EXPOSE 10000
# Start the application
CMD ["evolution-api"]
