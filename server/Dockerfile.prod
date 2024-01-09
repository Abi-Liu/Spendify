# Multi-stage docker build

FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire server directory to the container
COPY . .

# Build server
RUN npm run build

# Production stage:
FROM node:18-alpine AS final

WORKDIR /app/server

# Copy built files from the previous stage
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Expose the port your app runs on
EXPOSE 8000

# Set the command to start the app
CMD ["npm", "start"]