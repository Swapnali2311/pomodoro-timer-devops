@'
# Use lightweight Nginx image
FROM nginx:alpine

# Copy all project files into Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command (runs Nginx)
CMD ["nginx", "-g", "daemon off;"]
'@ | Out-File -Encoding UTF8 Dockerfile
