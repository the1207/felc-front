FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist/felc-front/browser ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
