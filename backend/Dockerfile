# Use official Node.js base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose backend port (usually 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
