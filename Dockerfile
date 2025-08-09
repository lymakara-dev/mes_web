# ---------- Base Stage ----------
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Default env (override with ARG if needed)
ARG ENV_FILE=.env.production
COPY ${ENV_FILE} .env

# ---------- Development Stage ----------
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000

# Use host volume for hot reload
CMD ["npm", "run", "dev"]

# ---------- Build Stage ----------
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# ---------- Production Stage ----------
FROM node:18-alpine AS production
WORKDIR /app

# Copy only necessary files from build
COPY --from=build /app/.next .next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
COPY --from=build /app/.env .env

RUN npm ci

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]