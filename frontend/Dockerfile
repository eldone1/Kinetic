# =========================
# ETAPA 1: BUILD ANGULAR
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Compilar aplicación Angular en producción
RUN npm run build -- --configuration production

# =========================
# ETAPA 2: NGINX
# =========================
FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

# Limpiar contenido default de nginx
RUN rm -rf ./*

# Copiar build compilado de Angular
COPY --from=build /app/dist/kinetic-rehab-frontend/browser .

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]