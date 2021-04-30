FROM adoptopenjdk/maven-openjdk11

ADD Backend /Backend
WORKDIR "/Backend"
CMD ["mvn", "spring-boot:run"]