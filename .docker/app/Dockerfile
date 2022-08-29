# The dependencies runner
FROM node:18-alpine AS installer
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# The builder runner
FROM node:18-alpine AS builder
WORKDIR /app

# Build the app
COPY . .
COPY --from=installer /app/node_modules ./node_modules
RUN npx next build

# The production runner
FROM node:18-alpine AS production
WORKDIR /app

# Copy project files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE $PORT

# Start the server
CMD ["node", "server.js"]
