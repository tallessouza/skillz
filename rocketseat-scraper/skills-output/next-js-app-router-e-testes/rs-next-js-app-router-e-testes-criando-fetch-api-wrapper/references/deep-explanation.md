# Deep Explanation: Fetch API Wrapper no Next.js

## Por que nao Axios?

O instrutor explica que o Axios e um wrapper sobre a **XMLHttpRequest**, que e a API antiga dos navegadores para requisicoes HTTP. A XMLHttpRequest funciona bem, mas o Next.js **estende especificamente a Fetch API** (a Web Fetch API moderna) para adicionar funcionalidades como caching e revalidation.

Quando voce usa Axios no Next.js, voce esta ignorando todas essas extensoes porque o Axios nao passa pela Fetch API — ele usa XMLHttpRequest diretamente. Isso significa que:
- `revalidate` nao funciona
- `cache: 'force-cache'` nao funciona
- O sistema de deduplicacao de requests do Next.js nao se aplica

O instrutor menciona que existem bibliotecas como **GOT** que sao baseadas em Fetch API, mas que nao ha necessidade — a propria Fetch API funciona perfeitamente.

## O conceito de Base URL

Uma das funcionalidades que o instrutor mais sente falta na Fetch API comparada ao Axios e a **base URL** — a capacidade de definir um prefixo de URL que todas as requisicoes usam automaticamente.

No Axios, voce faz `axios.create({ baseURL: '...' })`. Na Fetch API, voce tem que escrever o endereco inteiro toda vez. A solucao e criar um wrapper que usa o constructor `new URL(path, base)` do JavaScript.

### Como o constructor URL funciona

```typescript
new URL('/products', 'http://localhost:3000/api')
// Resultado: http://localhost:3000/products
```

O constructor `URL` e um global disponivel em qualquer ambiente JavaScript (browser, Node, Edge Runtime). Ele concatena o path com a base URL corretamente, lidando com barras duplicadas e encoding.

## Variaveis de ambiente no Next.js

O instrutor destaca uma regra critica: **toda variavel de ambiente que precisa estar disponivel no client-side deve comecar com `NEXT_PUBLIC_`**.

Sem esse prefixo, a variavel so fica visivel no server-side (Route Handlers, Server Components, middleware). Se voce tentar acessar no client, ela sera `undefined`.

## Validacao com Zod — safeParse

O instrutor usa `safeParse` ao inves de `parse` porque:
- `parse` lanca um erro automaticamente (menos controle)
- `safeParse` retorna um objeto `{ success, data, error }` que permite tratar o erro de forma customizada

O metodo `error.flatten().fieldErrors` transforma os erros do Zod em um formato mais legivel, mostrando exatamente quais variaveis falharam e por que.

### Por que lancar erro?

O `throw new Error('Invalid environment variables')` e intencional: se as variaveis de ambiente estao incorretas, a aplicacao **nao deve continuar executando**. Deixar continuar so geraria erros mais confusos em outros lugares do codigo.

## Estrutura de pastas

O instrutor cria:
- `src/data/api.ts` — o wrapper de fetch
- `src/env.ts` — validacao de variaveis de ambiente
- `.env.local` — arquivo de variaveis de ambiente

A pasta `data` e onde fica a logica de data fetching, separada dos componentes.