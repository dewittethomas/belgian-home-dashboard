# ---- BASE IMAGE ----
FROM node:20

# ---- CREATE APP DIR ----
WORKDIR /app

# ---- COPY FILES ----
COPY package*.json ./
RUN npm install

# ---- COPY APP CODE ----
COPY . .

# ---- EXPOSE PORT ----
EXPOSE 3000 

# ---- RUN APP ----
CMD [ "node", "src/server.js" ]
