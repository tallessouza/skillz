# Deep Explanation: Abstraindo Client Components

## Por que async em Client Components e problematico

O instrutor Diego demonstra o problema com um exemplo pratico. Quando voce coloca `async` em um Client Component, o codigo inteiro daquele componente e re-executado a cada re-renderizacao. Isso inclui:

- Mudanca de estado (`useState`)
- Execucao de hooks
- Re-renderizacao do componente pai

No exemplo, ele adiciona um `console.log` dentro do componente e mostra que, ao clicar no botao "Adicionar ao carrinho", o log aparece varias vezes no console. Isso prova que todo o codigo do componente executa novamente — e se houver um `await fetch()` ali dentro, o fetch tambem executaria a cada clique.

### Server Component vs Client Component — modelo mental

**Server Component:**
- HTML gerado uma unica vez no servidor
- O codigo executa uma unica vez
- O HTML devolvido ao usuario e estatico, nao reativo
- Por isso `async`/`await` funciona perfeitamente — so executa uma vez

**Client Component:**
- JavaScript e enviado ao navegador
- Componente reativo — re-executa em cada renderizacao
- Funciona como React tradicional (pre-Server Components)
- `async` no corpo causaria fetches repetidos e indesejados

### A analogia do "10%"

Diego faz uma observacao importante: em muitos componentes marcados como `use client`, apenas ~10% do codigo realmente precisa de JavaScript no navegador. Uma div estatica, um paragrafo, uma imagem — nada disso precisa de JS. Apenas elementos com interatividade (onClick, estado) precisam.

Ao marcar o componente inteiro como Client Component, voce esta enviando 100% do JavaScript ao navegador quando apenas 10% era necessario.

## Como identificar o que precisa ser Client Component

Diego propoe duas perguntas:

1. **Tem EventListener?** — onClick, onSubmit, onMouseOver, onHover, onFocus = precisa de Client Component
2. **Tem estado ou hooks?** — useState, useEffect, useRef = precisa de Client Component

A regra geral: "Esse componente vai ser estatico ou vai ter interatividade? Se tem interatividade, Client Component."

## Fetch de dados em Client Components

Quando voce precisa fazer fetch em um Client Component, volte as estrategias pre-Server Components:

- **useEffect** — a forma classica do React
- **React Query (TanStack Query)** — gerenciamento robusto de cache e estado
- **SWR** — solucao da Vercel, similar ao React Query
- **URQL** — para projetos com GraphQL

Diego enfatiza: "Nao e porque o Next traz novas possibilidades que a gente vai esquecer tudo que ja fazia no React."

## O principio da abstracao maxima

A recomendacao principal: abstraia ao maximo os Client Components. Isso significa:

- Nao marque paginas inteiras como `use client`
- Extraia cada pedaco interativo para seu proprio componente
- O componente Client deve ser o menor possivel
- O pai permanece como Server Component, podendo usar `async`/`await`

Resultado: menos JavaScript enviado ao navegador = aplicacao mais rapida para o usuario final.

## Observacao sobre ESLint

O warning que aparece ao usar `async` em Client Components vem do ESLint. Se o ESLint nao estiver configurado no editor, o warning nao aparece — mas o problema continua existindo. O componente vai "funcionar" mas causa problemas de performance.