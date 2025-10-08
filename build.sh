#!/bin/bash

if [ ! -d deploy ]
then
  mkdir -p deploy
fi

cp dist/kratong/3rdpartylicenses.txt dist/kratong/prerendered-routes.json deploy/

cp -r dist/kratong/browser/* deploy/

cp deploy/index.html deploy/404.html