# Use official Node.js runtime as base image
FROM node:18-alpine as base

WORKDIR /usr/src/app

# Install dependencies based on the lock file and cache them
COPY package*.json ./
RUN npm install --frozen-lockfile || npm install

# Copy application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]