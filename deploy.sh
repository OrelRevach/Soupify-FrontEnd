#!/bin/bash

# abort on errors
set -e

npm run build

cd dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/uspeit/webenv-assignment3-client-dist.git master:gh-pages
cd -