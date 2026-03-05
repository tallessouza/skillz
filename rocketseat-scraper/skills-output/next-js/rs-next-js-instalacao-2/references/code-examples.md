# Code Examples: Instalacao Next.js com Pages Router

## Comando de instalacao completo

```bash
npx create-next-app@latest site-blog
```

Respostas do CLI para Pages Router com TypeScript e Tailwind:

```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? … No
✔ Would you like to use Turbopack for next dev? … No
✔ Would you like to customize the import alias? … Yes (default @/*)
```

## index.tsx minimo (Hello World)

O instrutor limpou todo o conteudo padrao do `index.tsx` e substituiu por:

```tsx
export default function Home() {
  return (
    <h2>Hello World</h2>
  )
}
```

## Rodar o projeto

```bash
npm run dev
```

Saida esperada:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Estrutura de arquivos apos instalacao

```
site-blog/
├── src/
│   ├── pages/
│   │   ├── _app.tsx        # Componente wrapper global
│   │   ├── _document.tsx   # Customizacao do HTML base
│   │   ├── index.tsx       # Rota "/" — porta de entrada
│   │   └── api/
│   │       └── hello.ts    # API route de exemplo
│   └── styles/
│       └── globals.css     # Estilos globais + Tailwind directives
├── public/
│   ├── next.svg
│   └── vercel.svg
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── package.json
└── postcss.config.mjs
```

## Dependencias instaladas

**Producao:**
- `react`
- `react-dom`
- `next`

**Desenvolvimento:**
- `typescript`
- `@types/react`
- `@types/react-dom`
- `@types/node`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`
- `eslint-config-next`