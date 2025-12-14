FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./

FROM node:18-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend ./server
COPY --from=frontend-builder /app/frontend/dist ./server/public
RUN mkdir -p ./server/static/images
EXPOSE 5000
WORKDIR /app/server

# Start the application
CMD ["node", "index.js"]