FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma (Debian)
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY scripts ./scripts
COPY prisma ./prisma

# Skip postinstall during build to avoid type generation without DATABASE_URL
RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]

