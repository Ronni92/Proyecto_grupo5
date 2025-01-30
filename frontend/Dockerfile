# Usa Node.js para construir el frontend
FROM node:18-alpine AS build

# Define el directorio de trabajo
WORKDIR /app

# Copia el package.json e instala dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copia el resto del código del frontend
COPY . .

# Construye el frontend
RUN npm run build

# Usa Nginx para servir el frontend
FROM nginx:alpine

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la build al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
