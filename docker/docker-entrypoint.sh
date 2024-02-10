#!/bin/sh

set -x

export ALLOWED_HOSTS=${ALLOWED_HOSTS:=127.0.0.1}

export SECRET_KEY=${SECRET_KEY:=secret}

set +x

python3 manage.py migrate

gunicorn conf.wsgi
