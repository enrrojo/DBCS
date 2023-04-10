FROM openjdk:8-jdk-alpine
VOLUME /tmp
ARG JAVA_OPTS
ENV JAVA_OPTS=$JAVA_OPTS
COPY target/REST_Reservas-0.0.1-SNAPSHOT.jar REST_Reservas.jar
EXPOSE 8082
ENTRYPOINT exec java $JAVA_OPTS -jar REST_Reservas.jar