# The build runner
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY . .
RUN yarn --immutable

# Build the app
RUN yarn build

# The prod runner
FROM node:18-alpine AS prod
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Copy all required files to the /app directory
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE $PORT

# Start the app
CMD ["node", "server.js"]
