# Use Gradle image to build the application
FROM gradle:8.11.1-jdk21 AS build

WORKDIR /app

# Copy only the necessary files to leverage Docker's cache
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle build -x test --no-daemon || return 0  # Run a dummy build to download dependencies

# Copy the rest of the project
COPY . .

# Build the application
RUN gradle bootJar -x test --no-daemon

# Use a lightweight Java image to run the application
FROM openjdk:21-jdk-slim

# Copy the JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port 8081
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "/app.jar"]
