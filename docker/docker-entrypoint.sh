#!/bin/sh

set -x

export ALLOWED_HOSTS=${ALLOWED_HOSTS:=127.0.0.1}

export SECRET_KEY=${SECRET_KEY:=secret}

export WORKERS_COUNT=${WORKERS_COUNT:=5}

set +x

python3 manage.py migrate

gunicorn -b 0.0.0.0:8000 -w ${WORKERS_COUNT} conf.wsgi
