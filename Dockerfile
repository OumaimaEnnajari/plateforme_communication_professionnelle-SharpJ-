# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Build the React application for production
RUN npm run build

# Stage 2: Serve the React application using a lightweight web server
FROM nginx:1.25.5-alpine

# Copy the build output from the previous stage to the Nginx web server's directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
