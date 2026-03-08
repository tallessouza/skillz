---
name: rs-full-stack-instalando-o-tailwind-css
description: "Configures Tailwind CSS installation and setup in Vite projects. Use when user asks to 'install Tailwind', 'setup Tailwind CSS', 'configure Tailwind with Vite', 'add Tailwind to project', or 'integrate Tailwind'. Covers package installation, Vite plugin config, and CSS import setup. Make sure to use this skill whenever setting up a new Vite + Tailwind project from scratch. Not for Tailwind class usage patterns, component styling, or non-Vite bundlers like Webpack or Parcel."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: tailwind-setup
  tags: [tailwind, css, vite, styling, frontend]
---

# Instalando o Tailwind CSS com Vite

> Configure Tailwind CSS em um projeto Vite com tres passos: instalar pacotes, registrar plugin, importar no CSS.

## Prerequisites

- Projeto Vite ja criado e funcional
- Node.js com npm disponivel
- Se o servidor dev estiver rodando: pare com `Ctrl+C` antes de configurar

## Steps

### Step 1: Instalar os pacotes

```bash
npm install tailwindcss @tailwindcss/vite
```

Aguarde a instalacao finalizar antes de prosseguir.

### Step 2: Configurar o plugin no Vite

Edite `vite.config.ts` — importe o plugin e adicione ao array de plugins:

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Step 3: Importar Tailwind no CSS

No arquivo CSS principal (ex: `index.css`), adicione no topo:

```css
@import "tailwindcss";
```

### Step 4: Verificar a instalacao

```bash
npm run dev
```

Abra o navegador, aplique uma classe Tailwind para confirmar:

```tsx
<h1 className="text-3xl text-red-500">Tailwind funcionando!</h1>
```

## Output format

Apos configuracao, o projeto deve:
- Compilar sem erros com `npm run dev`
- Aplicar classes utilitarias do Tailwind nos elementos JSX via `className`
- Refletir mudancas de classe em tempo real (hot reload)

## Error handling

- Se classes nao aplicam apos configuracao: verifique se `@import "tailwindcss"` esta no CSS correto e se o CSS esta importado no `main.tsx`
- Se o build falha: confirme que ambos pacotes (`tailwindcss` e `@tailwindcss/vite`) foram instalados

## Verification

1. Adicione `className="text-3xl text-blue-500"` a qualquer elemento
2. Salve e confirme que o texto muda de tamanho e cor no navegador
3. Teste intensidades diferentes (ex: `text-red-300` vs `text-red-700`) para confirmar que a escala funciona

## Notas sobre classes Tailwind

- Use `className` no JSX, nunca `class` (palavra reservada do JavaScript)
- Nao precisa decorar classes — o padrao e previsivel: `text-{cor}-{intensidade}`
- Intensidades vao de 50 a 950 (ex: `text-blue-50` ate `text-blue-950`)
- Consulte a documentacao com `Ctrl+K` no site do Tailwind para buscar cores e utilitarios

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Classes Tailwind nao aplicam | `@import "tailwindcss"` ausente no CSS | Adicionar `@import "tailwindcss"` no topo do CSS principal |
| Build falha apos instalacao | Pacote `@tailwindcss/vite` nao instalado | Instalar ambos: `npm install tailwindcss @tailwindcss/vite` |
| Hot reload nao funciona | Servidor dev nao reiniciado apos config | Parar e reiniciar com `npm run dev` |
| `className` nao aceito no JSX | Usando `class` ao inves de `className` | Substituir `class` por `className` em arquivos JSX/TSX |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a arquitetura do plugin Vite e como o Tailwind processa classes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de configuracao expandidos com variacoes