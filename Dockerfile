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

# Install Redis and MongoDB
RUN apt-get update && \
    apt-get install -y redis-server mongodb && \
    mkdir -p /data/db

# Expose ports 3000 for the React application, 6379 for Redis, and 27017 for MongoDB
EXPOSE 3000 6379 27017

# Start Redis and MongoDB
CMD service redis-server start && mongod --bind_ip_all && npm start