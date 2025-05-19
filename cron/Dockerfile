FROM alpine:latest

RUN apk add --no-cache curl bash

COPY crontab.txt /etc/crontabs/root

CMD ["crond", "-f", "-L", "/dev/stdout"]