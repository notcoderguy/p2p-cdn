# Use the official Node.js runtime as a parent image
FROM node:18.14.2

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 for the React application
EXPOSE 3000

# Install Redis
RUN apt-get update && \
    apt-get install -y redis-server

# Expose port 6379 for Redis
EXPOSE 6379

# Start Redis and the React application
CMD service redis-server start && npm start
