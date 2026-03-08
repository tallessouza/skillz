---
name: rs-next-js-estrutura-do-cabecalho
description: "Enforces Next.js component colocation and header structure patterns when building layouts with Tailwind CSS. Use when user asks to 'create a header', 'build a layout', 'organize components in Next.js', 'add search input with icon', or 'structure a dashboard shell'. Applies rules: colocate components near usage, avoid bloated components folder, use route-based organization, position icons inside inputs with pointer-events-none. Make sure to use this skill whenever creating Next.js layout components or organizing component files. Not for API routes, server actions, data fetching, or backend logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: componentes-e-organizacao
  tags: [header, colocation, component-organization, search-input, tailwind, tw-merge, next-js]
---

# Estrutura de Componentes e Header no Next.js

> Componentes vivem perto de onde sao usados — a estrutura de rotas do Next.js ja organiza a aplicacao, use isso para organizar componentes tambem.

## Rules

1. **Colocalize componentes junto ao uso** — se o header so e usado no layout do dashboard, crie-o dentro da pasta do dashboard, porque manter longe dificulta navegacao e cria uma pasta components inchada
2. **Use a pasta components/ apenas para componentes globais** — componentes usados em muitas paginas vao em components/, componentes de escopo limitado ficam na pasta da rota que os usa
3. **Agrupe por rota, nao por tipo** — o Next.js ja separa em pastas por rota, use essa mesma subdivisao para organizar componentes, porque senao a pasta components vira um "trambolhao"
4. **Extraia componentes reutilizaveis quando o padrao se repete** — se voce vai ter multiplos inputs na aplicacao, crie um componente Input base com estilos compartilhados
5. **Use div relative + absolute para icones dentro de inputs** — com pointer-events-none no icone para que cliques passem para o input, porque e a forma mais limpa de posicionar icones

## How to write

### Organizacao de componentes por escopo

```
app/
├── (dashboard)/
│   ├── layout.tsx          # Usa o Header
│   ├── header.tsx          # Componente colocado aqui (so dashboard usa)
│   ├── sidebar.tsx         # Se sidebar so aparece no dashboard
│   └── board/
│       └── page.tsx
├── (auth)/
│   └── login/
│       └── page.tsx        # Header NAO aparece aqui
└── components/
    ├── button.tsx          # Usado em MUITAS paginas
    └── input.tsx           # Usado em MUITAS paginas
```

### Header com Tailwind

```tsx
import { LogIn, Search } from "lucide-react"
import { Input } from "@/components/input"

export function Header() {
  return (
    <header className="max-w-[900px] mx-auto w-full flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="font-semibold text-xl">ProductRoadmap</h1>
        <p className="text-sm text-navy-100">
          Follow the development progress of our entire platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for..."
            className="w-[270px] pl-8"
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-navy-200 pointer-events-none"
          />
        </div>

        <button className="size-8 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center hover:bg-navy-600 transition-colors duration-150 cursor-pointer">
          <LogIn className="size-3.5 text-navy-200" />
        </button>
      </div>
    </header>
  )
}
```

### Input base reutilizavel

```tsx
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={twMerge(
        "bg-navy-900 border border-navy-500 h-10 flex items-center placeholder:text-navy-200 px-3 rounded-lg text-sm focus:border-navy-400 transition-colors duration-150",
        className
      )}
      {...props}
    />
  )
}
```

## Example

**Before (componentes todos em components/):**
```
components/
├── header.tsx        # Usado so no dashboard
├── sidebar.tsx       # Usado so no dashboard
├── login-form.tsx    # Usado so na pagina de login
├── button.tsx        # Usado em tudo
└── input.tsx         # Usado em tudo
```

**After (colocalizados por rota):**
```
app/
├── (dashboard)/
│   ├── header.tsx      # Perto de quem usa
│   └── sidebar.tsx     # Perto de quem usa
├── (auth)/
│   └── login-form.tsx  # Perto de quem usa
└── components/
    ├── button.tsx       # Global
    └── input.tsx        # Global
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente usado em 1 pagina/layout | Crie no mesmo diretorio |
| Componente usado em paginas de um grupo de rotas | Crie na pasta do route group |
| Componente usado em toda a aplicacao | Crie em components/ |
| Input que sera reutilizado | Extraia componente base com twMerge para extensibilidade |
| Icone dentro de input | div relative + icone absolute + pointer-events-none |
| overflow-y em containers de conteudo | Use `auto` em vez de `scroll` para evitar scrollbar permanente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Jogar tudo em `components/` | Colocar perto da rota que usa |
| Criar input inline sem componente quando havera mais inputs | Extrair componente Input base |
| Colocar icone como child do input | Usar div relative + icone absolute |
| `overflow-y: scroll` sempre visivel | `overflow-y: auto` para mostrar so quando necessario |
| Escrever classe Tailwind completa toda vez | Usar prefixo parcial (ex: `bgn9` autocompleta `bg-navy-900`) |

## Troubleshooting

### Server Action nao executa ao submeter formulario
**Symptom:** Formulario submete mas nada acontece, sem erros no console
**Cause:** Action nao esta sendo passada corretamente ao form, ou falta "use server" no topo do arquivo de action
**Fix:** Garantir que a funcao de action tem `"use server"` no topo. Passar a action via atributo `action` do form: `<form action={minhaAction}>`

### Validacao de formulario nao mostra erros
**Symptom:** Dados invalidos sao submetidos sem feedback ao usuario
**Cause:** Validacao esta no servidor mas o retorno nao e tratado no cliente
**Fix:** Usar `useActionState` (React 19) para capturar o retorno da server action e exibir erros. Adicionar validacao client-side com Zod para feedback instantaneo

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-estrutura-do-cabecalho/references/deep-explanation.md) — O instrutor explica uma filosofia clara: **a estrutura de pastas do Next.js ja organiza a aplicacao 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-estrutura-do-cabecalho/references/code-examples.md) — // app/(dashboard)/layout.tsx
