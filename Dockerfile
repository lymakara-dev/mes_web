FROM node:18-alpine AS build
WORKDIR /app

# Install deps first for cache
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build Next.js app
RUN npm run build

# ---------- Production Stage ----------
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.js ./
COPY --from=build /app/.env.production .env

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
