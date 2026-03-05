# Deep Explanation: Error Boundary no Next.js (error.tsx)

## O que e por baixo dos panos

O arquivo `error.tsx` do Next.js utiliza a **Error Boundary API do React** por baixo dos panos. Isso nao e algo exclusivo do Next.js — o Next apenas facilita o uso criando uma convencao de arquivo especial.

Error Boundaries sao componentes React que capturam erros JavaScript em qualquer lugar da arvore de componentes filhos, logam esses erros e exibem uma UI de fallback ao inves de crashar toda a aplicacao.

## Por que precisa ser Client Component

O instrutor enfatiza que error boundaries **precisam** ser client components (`"use client"`). A razao tecnica e que Error Boundaries dependem de lifecycle methods do React (como `componentDidCatch`) e hooks como `useEffect` para capturar e logar erros durante a montagem dos componentes. Esse tipo de comportamento so acontece no cliente, nao no servidor.

Isso contrasta com o `loading.tsx`, que **pode ou nao** ser um client component.

## Granularidade por segmento

Um dos pontos mais interessantes da App Router, segundo o instrutor, e a capacidade de composicao. Voce pode ter:

- `app/error.tsx` — captura global, qualquer erro em qualquer pagina
- `app/dashboard/error.tsx` — captura apenas erros dentro do segmento dashboard

A regra e: **o error boundary mais proximo sempre captura primeiro**. Se nao existir um error boundary especifico para o segmento, o global captura.

## Props do Error Boundary

O componente recebe duas props:

1. **`error: Error`** — o objeto de erro com a mensagem (`error.message`) e stack trace
2. **`reset: () => void`** — funcao que tenta re-renderizar o segmento. Util quando o erro e transitorio (ex: API temporariamente fora do ar). Se o problema foi resolvido, o reset faz a pagina voltar ao normal

## Relacao com outros arquivos especiais

O instrutor posiciona o `error.tsx` dentro do conjunto de arquivos especiais da App Router:

| Arquivo | Funcao | Base React |
|---------|--------|------------|
| `page.tsx` | Cria a rota | — |
| `layout.tsx` | Layout compartilhado | — |
| `loading.tsx` | UI de carregamento | Suspense API |
| `error.tsx` | UI de erro | Error Boundary API |

Esses quatro sao os mais importantes e serao usados em praticamente qualquer aplicacao Next.js com App Router.

## O comportamento sem error boundary

O instrutor demonstra o que acontece quando nao existe um `error.tsx`: toda a aplicacao crasha com uma tela branca/erro. Com o error boundary, o erro e "contido" — ele segura o erro e exibe o fallback, mantendo o resto da aplicacao funcional.