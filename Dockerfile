# ---------- STAGE 1: BUILD ----------
FROM node:22.13.0-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Сборка TypeScript
RUN npm run build


# ---------- STAGE 2: RUN ----------
FROM node:22.13.0-alpine

WORKDIR /app

# Устанавливаем только прод-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранный build + необходимые файлы
COPY --from=builder /app/dist ./dist

# Экспонируем порт NestJS
EXPOSE 8080

# Команда запуска
CMD ["node", "dist/main.js"]
