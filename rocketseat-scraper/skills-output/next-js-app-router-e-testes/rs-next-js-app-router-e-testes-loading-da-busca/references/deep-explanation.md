# Deep Explanation: Loading da Busca

## Por que loading pages nao recebem searchParams

No Next.js App Router, arquivos `loading.tsx` sao renderizados automaticamente pelo framework como fallback de Suspense. Diferente de `page.tsx`, que recebe `params` e `searchParams` como props do servidor, `loading.tsx` nao tem acesso a essas props — o Next.js simplesmente nao passa essa informacao.

O instrutor destaca que isso e uma limitacao atual do framework: "infelizmente eu nao consigo acessar, pelo menos nao ainda, o Next ainda nao colocou essa opcao de acessar os parametros ou os search params como props".

### O workaround: client component

A solucao e transformar a loading page em um client component (`'use client'`) e usar o hook `useSearchParams()` do `next/navigation`. Esse hook le os parametros da URL diretamente no browser, sem depender de props do servidor.

**Importante:** `useSearchParams()` retorna um objeto `URLSearchParams`, nao um objeto JavaScript plain. Por isso, voce usa `.get('q')` em vez de desestruturacao.

O instrutor cometeu esse erro ao vivo: primeiro tentou desestruturar e obteve `null`, depois corrigiu para `searchParams.get('q')`.

## Principio do espelhamento de layout

O loading deve espelhar a estrutura da pagina real. O instrutor construiu o loading com:
- Mesma `div` wrapper com `flex flex-col gap-4`
- Mesmo paragrafo de "Resultados para: {query}"
- Mesma grid (`grid grid-cols-3 gap-6`)
- Skeletons no lugar dos cards

Isso garante que quando o conteudo real carrega, nao ha "pulo" no layout (layout shift).

## Ajuste fino de altura dos skeletons

O instrutor fez varias iteracoes ao vivo para encontrar a altura correta dos skeletons:
- 380px → muito pequeno
- 440px → muito grande
- 420px → ainda grande
- 400px → ficou adequado

Esse processo mostra que nao existe formula magica — voce precisa testar visualmente ate o skeleton coincidir com o componente real. O objetivo e que a transicao loading → conteudo seja imperceptivel em termos de layout.

## Quantidade de skeletons

O instrutor escolheu 6 skeletons para uma grid de 3 colunas: "vou botar seis deles que vai ficar multiplo de tres, vai ficar bonitinho". Usar um numero que nao e multiplo das colunas deixaria a ultima linha incompleta durante o loading, o que parece inacabado.

## Teste com delay artificial

Para validar o loading, o instrutor aumentou o delay da API para 3 segundos e usou `Ctrl+Shift+F5` (hard refresh sem cache) para ver o loading do zero. Essa tecnica e util durante desenvolvimento para testar estados de carregamento que normalmente passam rapido demais.