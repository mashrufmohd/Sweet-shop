# Multi-stage Docker build for Sweet Spot Manager

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy server package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy server source
COPY backend/ ./

# Stage 3: Production
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY --from=backend-builder /app/backend ./server

# Copy built frontend to server's static directory
COPY --from=frontend-builder /app/frontend/dist ./server/public

# Create uploads directory
RUN mkdir -p ./server/static/images

# Expose port
EXPOSE 5000

# Set working directory to server
WORKDIR /app/server

# Start the application
CMD ["node", "index.js"]