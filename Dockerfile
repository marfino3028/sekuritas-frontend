# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json .
RUN npm install

# Copy source
COPY . .

# API base URL di-bake saat build (SPA statis: runtime env Koyeb TIDAK berlaku).
# Override saat deploy: docker build --build-arg NUXT_PUBLIC_API_BASE=https://api.domain/api
ARG NUXT_PUBLIC_API_BASE=https://api.hamztech.my.id/api
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# Build as SPA (generates .output/public folder)
RUN npm run generate

# Production stage: serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Nginx config for SPA routing
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
