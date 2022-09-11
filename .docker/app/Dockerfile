# The builder runner
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Build the app
COPY . .
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
ENV TZ "Pacific/Auckland"
CMD ["node", "server.js"]
