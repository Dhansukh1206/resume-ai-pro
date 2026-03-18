# Stage 1: Building the app
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools for native modules (like canvas)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Running the app
FROM node:20-alpine AS runner
WORKDIR /app

# We need the runtime libraries in the runner stage too
RUN apk add --no-cache \
    pixman \
    cairo \
    pango \
    libjpeg-turbo \
    giflib

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]