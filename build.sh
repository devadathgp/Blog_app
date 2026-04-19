#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r Blog_app/requirements.txt
python Blog_app/manage.py collectstatic --no-input
python Blog_app/manage.py migrate
