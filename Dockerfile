FROM node:slim
WORKDIR /ws-chat
EXPOSE 3000:3000
COPY static ./static
COPY package*.json ./
COPY server.js .
RUN npm install --omit=dev
CMD ["node", "server.js"]