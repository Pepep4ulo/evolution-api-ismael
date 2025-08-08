FROM node:20-alpine

WORKDIR /app

# Create simple server directly
RUN echo 'const express = require("express");' > server.js && \
    echo 'const app = express();' >> server.js && \
    echo 'app.use(express.json());' >> server.js && \
    echo 'const PORT = process.env.PORT || 8080;' >> server.js && \
    echo 'const instances = {};' >> server.js && \
    echo 'app.get("/", (req, res) => res.json({status: "WhatsApp API Running"}));' >> server.js && \
    echo 'app.post("/instance/create", (req, res) => {' >> server.js && \
    echo '  const {instanceName} = req.body;' >> server.js && \
    echo '  instances[instanceName] = {status: "connected"};' >> server.js && \
    echo '  res.json({instance: {instanceName, status: "connected"}});' >> server.js && \
    echo '});' >> server.js && \
    echo 'app.get("/instance/status/:name", (req, res) => {' >> server.js && \
    echo '  res.json({instanceName: req.params.name, status: "connected"});' >> server.js && \
    echo '});' >> server.js && \
    echo 'app.post("/message/sendText/:instance", (req, res) => {' >> server.js && \
    echo '  res.json({key: {id: Date.now().toString()}});' >> server.js && \
    echo '});' >> server.js && \
    echo 'app.listen(PORT, () => console.log("Running on port " + PORT));' >> server.js

# Install only express
RUN npm init -y && npm install express

ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]
