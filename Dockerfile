# --- Stage 1: Build the application ---
    FROM node:20-alpine AS builder

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the application for production
    # Pass the VITE_GEMINI_API_KEY as a build argument
    ARG VITE_GEMINI_API_KEY
    ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
    RUN npm run build
    
    # --- Stage 2: Serve the application with Nginx ---
    FROM nginx:1.25-alpine
    
    # Copy the built static files from the 'builder' stage
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy a custom Nginx configuration file
    # This is important for single-page applications (SPAs) to handle routing correctly.
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose port 80
    EXPOSE 80
    
    # The default Nginx command will start the server
    CMD ["nginx", "-g", "daemon off;"]
    