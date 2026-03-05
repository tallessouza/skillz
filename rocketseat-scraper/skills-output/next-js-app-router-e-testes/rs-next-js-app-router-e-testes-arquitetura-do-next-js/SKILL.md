---
name: rs-nextjs-app-router-arquitetura
description: "Applies Next.js architecture mental model when designing or explaining React applications with SSR. Use when user asks to 'create a Next.js app', 'explain SSR', 'compare SPA vs SSR', 'set up server-side rendering', or 'understand Next.js server components'. Guides decisions about client vs server rendering, BFF layer, and page-level code splitting. Make sure to use this skill whenever discussing Next.js architecture or choosing between SPA and SSR approaches. Not for API route implementation, database queries, or CSS styling."
---

# Arquitetura do Next.js

> Entenda que Next.js nao e apenas um framework frontend — e uma arquitetura com servidor Node intermediario que monta HTML antes de entregar ao usuario.

## Key concept

Next.js introduz uma camada de servidor Node.js (BFF — Backend for Frontend) entre o usuario e o codigo React. Diferente de uma SPA tradicional onde o navegador baixa TODO o JavaScript para montar a interface, o servidor Next.js intercepta a requisicao, identifica QUAL pagina o usuario quer acessar, busca APENAS os assets necessarios para aquela pagina, monta o HTML no servidor e devolve pronto.

## Decision framework

| Quando encontrar | Aplicar |
|-----------------|---------|
| Aplicacao React nova | Considerar Next.js para SSR, code splitting automatico e Server Components |
| Tela branca no carregamento inicial | Sintoma classico de SPA sem SSR — o HTML depende do JS carregar primeiro |
| Pagina precisa de dados da API para renderizar | Servidor Next.js busca dados ANTES de montar o HTML, eliminando loading states iniciais |
| Funcionalidade reativa (animacao, clique, estado) | Precisa de JavaScript no cliente — Server Components nao cobrem isso |
| SEO e performance de primeira carga sao criticos | SSR entrega HTML pronto, indexavel e rapido |

## How to think about it

### SPA Tradicional (React puro)

```
Usuario → Frontend React (5MB JS inteiro)
                ↓
         Tela branca enquanto JS carrega
                ↓
         JS carregado → monta HTML → busca API → renderiza
```

O usuario precisa baixar TODO o JavaScript da aplicacao (todas as paginas, todos os componentes) antes de ver qualquer coisa. Desabilitar JS = tela branca.

### Next.js com SSR

```
Usuario → Servidor Node (Next.js BFF)
                ↓
         Identifica: usuario quer /signin
                ↓
         Busca APENAS JS/CSS/HTML de /signin (~200KB vs 5MB)
                ↓
         Monta HTML no servidor (Node interpreta React)
                ↓
         Se precisa dados da API → busca no servidor
                ↓
         Retorna HTML pronto ao usuario
```

O servidor Node interpreta codigo React (React e JavaScript, Node executa JavaScript) e devolve HTML montado. Desabilitar JS no navegador = interface continua aparecendo.

### O que e o BFF (Backend for Frontend)

O servidor Node que o Next.js cria NAO e uma API. Nao serve nativamente para comunicar com banco de dados ou criar endpoints REST. E um intermediario que:

1. Recebe a requisicao do usuario
2. Identifica qual pagina renderizar
3. Busca os assets minimos necessarios
4. Monta o HTML pelo servidor
5. Opcionalmente busca dados da API
6. Devolve HTML pronto

### Server Components

React introduziu Server Components em dezembro de 2020 (Dan Abramov et al.). Essa arquitetura so funciona em frameworks com servidor Node integrado — por isso Next.js e o framework recomendado pelo proprio React. Server Components permitem fetch de dados diretamente no componente, no servidor, sem useEffect ou loading states no cliente.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| Next.js e so React com rotas | Next.js adiciona uma camada de servidor Node que muda fundamentalmente como HTML e entregue |
| SSR significa que JS nao roda no cliente | JS ainda roda no cliente para interatividade (animacoes, eventos, estado reativo) |
| O servidor Next.js substitui a API | O BFF NAO e a API — e um intermediario que monta HTML e opcionalmente busca dados da API |
| SPA carrega so a pagina acessada | SPA tradicional carrega TODO o bundle JS de TODAS as paginas |
| Server Components eliminam JavaScript no cliente | Apenas componentes de servidor rodam sem JS no cliente — componentes interativos ainda precisam |

## When to apply

- Ao decidir entre criar uma SPA pura ou usar Next.js
- Ao explicar por que Next.js e recomendado pelo time do React
- Ao debugar tela branca em carregamento inicial
- Ao arquitetar separacao entre server e client components
- Ao justificar a escolha de Next.js para SEO ou performance

## Limitations

- Este modelo mental cobre a arquitetura geral — nao detalha App Router, file-based routing ou configuracao especifica
- Server Components tem suas proprias regras (sem useState, sem useEffect) que nao sao cobertas aqui
- O BFF do Next.js PODE ser usado como API (API Routes), mas nao e o proposito primario descrito aqui

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
