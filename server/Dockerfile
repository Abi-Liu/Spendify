FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire server directory to the container
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Set the command to start the app
CMD ["npm", "run", "dev"]