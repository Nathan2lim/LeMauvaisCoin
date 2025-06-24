FROM node:18

# Create app directory
WORKDIR /app

# Copy package files for better Docker layer caching
COPY package*.json ./

# Install dependencies in the image (will be overridden by volume in development)
RUN npm install

# Expose dev server port
EXPOSE 4200

# Create entry point script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy the rest of the application
COPY . .

# Start Angular app with entry point script
ENTRYPOINT ["entrypoint.sh"]
