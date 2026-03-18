# 1. Start with Node 20 Alpine
FROM node:20-alpine

# 2. Install system dependencies needed for 'canvas' and building native modules
# These are the "missing pieces" that caused your error
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

# 3. Create app directory
WORKDIR /app

# 4. Copy package files
COPY package*.json ./

# 5. Install dependencies
# (Note: we removed --production for a moment to ensure build tools work)
RUN npm install

# 6. Copy the rest of your server code
COPY . .

# 7. Expose your port
EXPOSE 5050

# 8. Start the app
CMD ["node", "server.js"]