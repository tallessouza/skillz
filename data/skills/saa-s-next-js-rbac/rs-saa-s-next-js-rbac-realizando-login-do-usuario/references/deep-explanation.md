# Deep Explanation: Autenticacao com Cookies e Redirect no Next.js

## Por que cookies so funcionam em 3 lugares

O Next.js usa uma arquitetura onde server components sao renderizados no servidor mas de forma "read-only" em relacao a cookies. A funcao `cookies()` de `next/headers` so permite escrita (`.set()`) em contextos onde o Next.js tem controle sobre os headers HTTP da resposta:

1. **Server actions** — executam no servidor em resposta a uma acao do usuario
2. **Route handlers** — arquivos dentro da pasta `app/api/`
3. **Middleware** — `middleware.ts` na raiz do projeto

Voce pode manipular cookies no client-side tambem, mas esses nao serao HTTP-only, o que significa que JavaScript no browser pode le-los. Para tokens de autenticacao, HTTP-only e mais seguro.

## O problema do redirect dentro de try/catch

O instrutor descobriu isso em tempo real durante a aula. A funcao `redirect()` do Next.js internamente lanca um erro especial (um "throw") para interromper a execucao e sinalizar ao framework que deve redirecionar. Quando voce coloca redirect dentro de um try/catch, o catch captura esse "erro" de redirect e trata como erro comum.

A solucao e sempre colocar `redirect()` DEPOIS do bloco try/catch. Se o codigo chegar ate la (sem ter caido no catch), significa que deu tudo certo.

## Server action via form action vs via await

Existe uma diferenca fundamental:
- **Via form action** (`<form action={serverAction}>`): O Next.js gerencia todo o ciclo. O redirect interno funciona porque o framework intercepta o retorno.
- **Via await** (`await serverAction(data)`): Voce esta chamando a funcao como uma funcao normal. O redirect interno lanca um erro que chega no seu codigo como excecao, nao como redirecionamento.

O instrutor resolveu isso com um padrao elegante: a server action retorna `{ success: true }`, e o componente client-side faz o redirect usando `useRouter().push()` quando recebe sucesso. Ele criou um callback `onSuccess` no hook de formulario para desacoplar a logica.

## Protecao de rotas no layout

A abordagem do instrutor foi verificar autenticacao no layout do grupo de rotas `(auth)`. Como o layout e um server component, ele pode:
1. Chamar `isAuthenticated()` (que acessa cookies server-side)
2. Usar `redirect('/')` se o usuario ja estiver logado

Isso protege TODAS as rotas filhas (login, signup, etc.) automaticamente, sem precisar repetir a verificacao em cada page.

A funcao `isAuthenticated` e intencionalmente simples — apenas verifica se o cookie `token` existe e tem valor. Nao valida o token em si (isso seria feito pelo middleware ou pela API).

## Diferenca entre redirect e useRouter

- `redirect` (de `next/navigation`): funcao server-side, lanca erro para sinalizar redirecionamento, so funciona em server components, server actions (com ressalvas), e middleware
- `useRouter().push()`: hook client-side, faz navegacao SPA no browser, funciona em client components

Regra pratica: se o componente tem `'use client'`, use `useRouter`. Se nao tem, use `redirect`.