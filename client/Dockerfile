FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app/client

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project to the working directory
COPY . .

# Expose the port
EXPOSE 5173

# Start server
CMD ["npm", "run", "dev"]