```
git init 
git add -A
git commit -m "github action 自动部署"
git push -f https://github.com/chengengwei625/My-Blog.git master:gh-pages

pnpm docs:build
pnpm docs:dev
```

