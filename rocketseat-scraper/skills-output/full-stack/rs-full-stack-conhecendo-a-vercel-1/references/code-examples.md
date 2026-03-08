# Code Examples: Conhecendo a Vercel

## Verificando se a conta esta pronta

Apos criar a conta, verifique no terminal que o GitHub esta conectado:

```bash
# Verificar autenticacao no GitHub (pre-requisito)
gh auth status
```

Saida esperada:
```
✓ Logged in to github.com as seu-usuario
```

## Estrutura tipica de projeto React pronto para Vercel

```
meu-projeto/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── package.json
├── vite.config.ts       # ou next.config.js
└── tsconfig.json
```

## Scripts necessarios no package.json

A Vercel detecta automaticamente o framework, mas precisa que o `build` funcione:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## Testando build localmente antes do deploy

```bash
# Sempre teste o build antes de fazer deploy
npm run build

# Verificar se a pasta dist/ foi gerada
ls dist/
```

## Vercel CLI (alternativa ao dashboard)

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login via CLI
vercel login

# Deploy rapido (interativo)
vercel

# Deploy de producao
vercel --prod
```

## Configuracao opcional: vercel.json

Para projetos SPA com client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```