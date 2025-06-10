FROM node:18

# Create app directory
WORKDIR /app

# Expose dev server port
EXPOSE 4200

# Create entry point script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Start Angular app with entry point script
ENTRYPOINT ["entrypoint.sh"]
