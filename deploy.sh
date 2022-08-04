#!usr/bin/env sh

set -e

pnpm run docs:build

cd docs/.vitepress/dist

git init 
git add -A
git commit -m "github action 自动部署"
git push -f https://github.com/chengengwei625/My-Blog.git master:gh-pages

cd -
rm -rf docs/.vitepress/dist