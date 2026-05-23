# =========================
# ETAPA DE CONSTRUCCIÓN
# =========================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copiar wrapper de Maven y archivos de configuración
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Dar permisos al wrapper
RUN chmod +x mvnw

# Descargar dependencias (cache eficiente)
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar proyecto
RUN ./mvnw clean package -DskipTests

# =========================
# ETAPA DE EJECUCIÓN
# =========================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar jar generado desde la etapa build
COPY --from=build /app/target/*.jar app.jar

# Puerto de Spring Boot
EXPOSE 8080

# Ejecutar aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]