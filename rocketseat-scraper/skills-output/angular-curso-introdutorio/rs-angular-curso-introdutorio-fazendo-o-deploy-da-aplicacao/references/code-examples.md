# Code Examples: Deploy Angular no Netlify

## netlify.toml completo da aula

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/gerador-certificado/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Verificando o outputPath no angular.json

```json
{
  "projects": {
    "gerador-certificado": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/gerador-certificado"
          }
        }
      }
    }
  }
}
```

O valor em `outputPath` define a base. Angular adiciona `/browser` automaticamente para o conteudo do client-side.

## Comando de build de producao

```bash
ng build --configuration production
```

Saida esperada:
```
dist/
└── gerador-certificado/
    └── browser/
        ├── index.html
        ├── main.js
        ├── polyfills.js
        ├── styles.css
        └── assets/
```

## Variacao: projeto com nome diferente

Se o projeto se chama `minha-app`:

```toml
[build]
  command = "ng build --configuration production"
  publish = "dist/minha-app/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Variacao: monorepo com subdiretorio

Se o Angular esta em um subdiretorio (ex: `frontend/`):

```toml
[build]
  base = "frontend"
  command = "ng build --configuration production"
  publish = "frontend/dist/minha-app/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Comandos Git usados na aula

```bash
# Adicionar todos os arquivos (incluindo netlify.toml)
git add .

# Commit com mensagem descritiva
git commit -m "Preparando para o deploy"

# Push para o GitHub (dispara deploy automatico no Netlify)
git push
```