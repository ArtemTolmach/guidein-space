# syntax=docker/dockerfile:1
FROM python:3.12-alpine3.19

COPY . /var/www/guidein-space

RUN --mount=type=cache,mode=0777,target=/root/.cache/pip pip3 install -r /var/www/guidein-space/requirements.txt

COPY docker/docker-entrypoint.sh /entrypoint.sh

WORKDIR /var/www/guidein-space

ENTRYPOINT ["/entrypoint.sh"]
