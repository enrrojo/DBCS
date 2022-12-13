FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/REST_Autentification-0.0.1-SNAPSHOT.jar REST_Autentification.jar
EXPOSE 8081
ENTRYPOINT exec java $JAVA_OPTS -jar REST_Autentification.jar