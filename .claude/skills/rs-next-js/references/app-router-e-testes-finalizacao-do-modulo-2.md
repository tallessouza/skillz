---
name: rs-nextjs-app-router-react-vs-next
description: "Applies the distinction between React fundamentals and Next.js-specific features when building with App Router. Use when user asks to 'create a Next.js app', 'use server components', 'add caching', 'setup App Router', or discusses frontend architecture decisions. Ensures correct attribution of concepts to React vs Next.js, guiding portable code decisions. Make sure to use this skill whenever discussing or implementing App Router patterns. Not for API routes, database queries, or deployment configuration."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, react, server-components, client-components, portability, architecture]
---

# React Fundamentals vs Next.js Específicos

> Ao trabalhar com Next.js App Router, distinguir o que é React (portável) do que é Next.js (específico) para tomar decisões arquiteturais corretas.

## Key concept

O App Router do Next.js combina duas camadas: fundamentos do React (Server Components, memoização) e features específicas do Next.js (caching, roteamento por pastas, route groups). Essa distinção importa porque os fundamentos do React estão sendo adotados por todos os frameworks frontend — o investimento em aprendê-los é portável. Já as features do Next.js são específicas e podem mudar entre versões.

## Decision framework

| Conceito | Pertence a | Portabilidade |
|----------|-----------|---------------|
| Server Components | React | Alta — outros frameworks adotando |
| Client Components (`"use client"`) | React | Alta |
| Memoização (cache de componentes) | React | Alta |
| Roteamento por pastas (`app/`) | Next.js | Baixa — específico do framework |
| Caching (fetch cache, revalidate) | Next.js | Baixa |
| Route Groups `(grupo)` | Next.js | Baixa |
| Layouts aninhados | Next.js (implementação) | Média — conceito existe em outros |
| Server Actions | React | Alta — spec do React, Next implementa |

## How to think about it

### Ao escolher padrões de fetching
Server Components para fetch de dados é React, não Next.js. O padrão de buscar dados no servidor e enviar HTML pronto é a direção do frontend como um todo. Priorizar esse padrão porque reduz JavaScript enviado ao navegador.

### Ao configurar cache e revalidação
`revalidate`, `cache: 'force-cache'`, e ISR são Next.js. Ao documentar ou ensinar, deixar explícito que são APIs do framework, não do React.

### Ao avaliar migração futura
Código em Server Components (fetch, transformação de dados, renderização) migra facilmente. Configurações de roteamento, caching e middleware precisam ser reescritas.

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Server Components são do Next.js | São spec do React, Next.js foi o primeiro a implementar |
| Só o Next.js caminha para menos JS no client | É a direção de todo o frontend — Remix, Solid, Astro seguem o mesmo caminho |
| Server Actions são experimentais e irrelevantes | Já estão estáveis no React e implementados no Next.js |
| Memoização de fetch é do Next.js | A memoização de requisições duplicadas em Server Components é comportamento do React |

## When to apply

- Ao iniciar um projeto Next.js com App Router — separar mentalmente o que é portável
- Ao revisar código — verificar se algo marcado como "Next.js" é na verdade React
- Ao tomar decisões de arquitetura — priorizar padrões React (portáveis) sobre padrões Next.js quando possível
- Ao ensinar ou documentar — atribuir corretamente cada conceito

## Limitations

- A linha entre React e Next.js muda conforme o React estabiliza novas APIs
- Nem todo framework adota Server Components no mesmo ritmo
- Server Actions ainda estão em adoção inicial no mercado

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-finalizacao-do-modulo-2/references/deep-explanation.md) — O ponto mais importante da aula é que **o aprendizado de Server Components não é um investimento esp
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-finalizacao-do-modulo-2/references/code-examples.md) — // app/products/page.tsx
