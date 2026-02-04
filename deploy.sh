#!/bin/bash

if [[ $# == 0 ]]; then
  echo "Please input a tag"
  exit 1
fi

TAG=$1
REMOTE=git@github.com:Eplistical/mj-migration.git
BRANCH=main

set -x
rm -rf dist/
npm run build
cd dist
cp index.html 404.html
git init
git add .
git commit -m "deploy ${TAG}"
git tag $TAG
git push $REMOTE $BRANCH -f
git push $REMOTE $BRANCH --tag
cd ..
set +x
