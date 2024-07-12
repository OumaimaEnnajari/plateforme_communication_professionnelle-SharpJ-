FROM openjdk:20-oracle
COPY *.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar","app.jar"]