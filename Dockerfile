# Stage 1 — Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js project
RUN npm run build

# Stage 2 — Production
FROM node:22-alpine

WORKDIR /app

# Copy built project from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
