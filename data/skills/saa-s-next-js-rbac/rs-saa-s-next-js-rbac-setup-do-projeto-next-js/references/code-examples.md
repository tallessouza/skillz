# Code Examples: Setup do Projeto Next.js em Monorepo

## Comando de criacao

```bash
# No diretorio apps/
npx create-next-app@latest web
# Ou para versao RC especifica:
npx create-next-app@rc web
```

## Limpeza pos-scaffold

```bash
cd apps/web
rm -rf node_modules package-lock.json
rm -rf src/app/fonts/
rm -f public/*.svg
cd ../..
pnpm install
```

## tsconfig compartilhado: nextjs.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  }
}
```

## tsconfig.json local (apps/web)

```json
{
  "extends": "@saas/tsconfig/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## package.json do tsconfig atualizado

```json
{
  "name": "@saas/tsconfig",
  "files": ["base.json", "node.json", "nextjs.json"]
}
```

## Layout limpo com Inter

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## Page limpa

```typescript
export default function Home() {
  return <h1>Hello World</h1>
}
```

## globals.css limpo

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## .eslintrc.json

```json
{
  "extends": ["@saas/eslint-config/next"]
}
```

## devDependencies adicionadas ao apps/web

```json
{
  "devDependencies": {
    "@saas/eslint-config": "workspace:*",
    "@saas/prettier": "workspace:*",
    "@saas/tsconfig": "workspace:*"
  }
}
```

## Verificacao final

```bash
pnpm install
pnpm --filter web run dev
# Acessar http://localhost:3000 — deve mostrar "Hello World"
```