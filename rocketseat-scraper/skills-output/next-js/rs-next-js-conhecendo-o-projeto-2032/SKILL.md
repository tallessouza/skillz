---
name: rs-next-js-conhecendo-o-projeto-2032
description: "Applies Next.js project setup conventions when initializing a landing page with blog using Pages Router. Use when user asks to 'create a landing page', 'start a Next.js project', 'setup a blog with Next', or 'clean up a Next.js starter'. Enforces component-based section architecture, responsive design structure, and proper project cleanup before development. Make sure to use this skill whenever scaffolding a new Next.js Pages Router project with landing page and blog sections. Not for App Router projects, API-only backends, or existing project refactoring."
---

# Setup de Projeto Next.js: Landing Page + Blog

> Ao iniciar um projeto Next.js com landing page e blog, limpe o boilerplate e estabeleca a arquitetura de secoes componentizadas antes de escrever qualquer feature.

## Rules

1. **Limpe o boilerplate primeiro** — remova `console.log`, arquivos de exemplo e imports nao utilizados antes de comecar, porque codigo residual contamina o projeto desde o inicio
2. **Index = Landing Page** — `pages/index.tsx` e sempre a landing page principal, porque o Next.js Pages Router usa file-based routing e `/` mapeia para index
3. **Componentize por secao** — cada secao visual da landing page (header, hero, CTA, feedbacks, footer) e um componente isolado, porque facilita manutencao e responsividade
4. **Responsividade desde o inicio** — estruture componentes pensando em mobile-first, porque retroadaptar responsividade e mais custoso que planejar desde o comeco
5. **Blog como rota separada** — o blog vive em `pages/blog/` com sua propria estrutura, porque landing page e blog tem layouts e necessidades diferentes
6. **Siga o design como referencia** — use o Figma como fonte de verdade para componentes, espacamentos e hierarquia visual, porque decisoes arbitrarias geram retrabalho

## Estrutura do projeto

```
src/
├── pages/
│   ├── index.tsx              # Landing page principal
│   ├── blog/
│   │   ├── index.tsx          # Lista de posts
│   │   └── [slug].tsx         # Post individual
│   └── _app.tsx               # Layout global
├── components/
│   ├── Header/
│   ├── Hero/
│   ├── Features/
│   ├── CallToAction/
│   ├── Testimonials/
│   └── Footer/
└── styles/
```

## Steps para iniciar

### Step 1: Limpar o projeto
Remova todo codigo de exemplo do boilerplate Next.js:
- `console.log` de aulas/testes anteriores
- Pastas e arquivos nao utilizados
- Imports orfaos
- Conteudo placeholder do `index.tsx`

### Step 2: Definir a index como landing page
```typescript
// pages/index.tsx
export default function Home() {
  return (
    <main>
      {/* Secoes serao adicionadas como componentes */}
    </main>
  )
}
```

### Step 3: Criar estrutura de componentes por secao
Cada secao do design vira um componente independente com sua propria pasta.

## Secoes tipicas de uma landing page

| Secao | Componente | Proposito |
|-------|-----------|-----------|
| Header | `Header` | Navegacao e branding |
| Hero | `Hero` | Primeira impressao, proposta de valor |
| Features | `Features` | Icones e beneficios do produto |
| CTA | `CallToAction` | Chamada para acao (conversao) |
| Testimonials | `Testimonials` | Feedbacks de usuarios |
| Footer | `Footer` | Links, contato, redes sociais |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Comecar a codar sem limpar boilerplate | Limpe tudo primeiro, commit limpo |
| Colocar toda landing page em um unico arquivo | Componentize por secao |
| Ignorar mobile no inicio | Estruture mobile-first desde o primeiro componente |
| Misturar blog e landing page no mesmo layout | Separe rotas e layouts |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
