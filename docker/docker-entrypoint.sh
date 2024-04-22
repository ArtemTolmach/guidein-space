#!/bin/sh

set -x

export ALLOWED_HOSTS=${ALLOWED_HOSTS:=127.0.0.1}

export SECRET_KEY=${SECRET_KEY:=secret}

export WORKERS_COUNT=${WORKERS_COUNT:=5}

export CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS:=http://localhost:3000}

export CORS_TRUSTED_ORIGINS=${CORS_TRUSTED_ORIGINS:=http://localhost:3000}

export CORS_TRUSTED_ORIGINS=${CORS_TRUSTED_ORIGINS:=True}

set +x

python3 manage.py migrate

gunicorn -b 0.0.0.0:8000 -w ${WORKERS_COUNT} conf.wsgi
