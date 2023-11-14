FROM node:18-alpine


# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire server directory to the container
COPY . .

# Set environment variables using ARG and ENV
ARG DATABASE_URL
ARG PORT
ARG PLAID_SECRET
ARG PLAID_CLIENT_ID
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG KEY

ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}
ENV PLAID_SECRET=${PLAID_SECRET}
ENV PLAID_CLIENT_ID=${PLAID_CLIENT_ID}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV KEY=${KEY}

# Expose the port your app runs on
EXPOSE 8000

# Set the command to start the app
CMD ["npm", "start"]