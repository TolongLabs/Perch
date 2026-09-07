FROM oven/bun:1.3-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
# v1 is the mockup v2 replaced. It ships alongside so a reviewer can open both from one URL.
COPY v1/ /usr/share/nginx/html/v1/
EXPOSE 8080
