# Code Examples: Setup Inicial Next.js

## Comando de criacao do projeto

```bash
# Copiar da documentacao oficial: https://nextjs.org/docs (Installation)
npx create-next-app@latest pet-shop
```

Saida interativa esperada:

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for next dev? … No
✔ Would you like to customize the default import alias (@/*)? … Yes
✔ What import alias would you like configured? … @/*
```

## Pagina inicial limpa

```typescript
// src/app/page.tsx — DEPOIS da limpeza
export default function Home() {
  return (
    <div>
      <h2>Rocket Git</h2>
    </div>
  )
}
```

O instrutor usou "Rocket Git" como placeholder. Em projetos reais, substituir pelo nome do projeto.

## Estrutura de arquivos apos setup

```
pet-shop/
├── node_modules/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css        # Contem @tailwind base/components/utilities
│       ├── layout.tsx         # Root layout (html + body tags)
│       └── page.tsx           # Pagina inicial (limpa)
├── .eslintrc.json
├── .gitignore
├── docker-compose.yaml        # Criado manualmente na raiz
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Criando o docker-compose.yaml

No VS Code, o instrutor:
1. Clicou na raiz do projeto no explorer
2. Clicou em "New File"
3. Nomeou como `docker-compose.yaml`

O conteudo do arquivo sera explicado na proxima aula. O instrutor ja tinha um arquivo pronto para colar, evitando perda de tempo com digitacao ao vivo.

## Abrindo o projeto no VS Code

```bash
# Apos criar o projeto, abrir no VS Code
code pet-shop
```

Ou navegar ate a pasta e abrir:

```bash
cd pet-shop
code .
```