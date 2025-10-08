#!/bin/bash

if [ -e deploy ]; then
    rm -r deploy
fi

mkdir -p deploy

cp dist/kratong/3rdpartylicenses.txt dist/kratong/prerendered-routes.json deploy/

cp -r dist/kratong/browser/* deploy/

cp deploy/index.html deploy/404.html