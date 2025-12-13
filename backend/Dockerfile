# Simple Dockerfile for backend only (for Render/Railway)
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Create directory for uploaded images
RUN mkdir -p ./static/images

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
