# Backend Dockerfile
FROM node:20-alpine

# Install OpenSSL for Prisma to work on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Expose port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 5002), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server and run migrations beforehand
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node scripts/create-admin.js && npm start"]
