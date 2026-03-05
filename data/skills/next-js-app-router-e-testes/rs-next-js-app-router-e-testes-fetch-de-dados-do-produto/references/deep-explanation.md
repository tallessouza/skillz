# Deep Explanation: Fetch de Dados no Produto

## Por que usar colchetes no file system

No Next.js App Router, a estrutura de pastas define as rotas. Quando voce cria `api/products/[slug]/route.ts`, o Next entende que `slug` e um parametro dinamico. Isso funciona tanto para `page.tsx` (paginas) quanto para `route.ts` (route handlers). A diferenca e que route handlers usam `route.ts` e paginas usam `page.tsx`.

## O segundo parametro do route handler

O instrutor destaca que a funcao GET recebe dois parametros:
1. `request` — detalhes da requisicao (body, headers, etc.)
2. Um objeto com `params` — todos os parametros dinamicos da URL

Ele demonstra isso fazendo `console.log` do segundo parametro, que mostra:
```
{ params: { slug: 'moletom' } }
```

Quando nao usa o `request`, o pattern e nomear como `_` (underscore), indicando que o parametro existe mas nao e utilizado.

## Parse vs SafeParse no Zod

O instrutor faz uma distincao importante:

- **`parse()`**: Se a validacao falhar, dispara um `throw` automaticamente. O codigo abaixo nao executa. Ideal para route handlers onde voce quer interromper a execucao imediatamente.

- **`safeParse()`**: Faz a validacao mas NAO dispara erro. Retorna um objeto `{ success: boolean, data?, error? }` que voce pode checar com `if`. Foi usado antes nas variaveis de ambiente da aplicacao.

A escolha entre um e outro depende do fluxo: se voce quer fail-fast, use `parse`. Se precisa de tratamento condicional, use `safeParse`.

## Status 400 vs 404

O instrutor inicialmente pensa em retornar 404, mas corrige: a rota existe (o endpoint esta la), o que nao existe e o produto. Entao o correto e 400 Bad Request — o client enviou um slug invalido ou inexistente.

## Os 4 tipos de cache do Next.js

O instrutor referencia a pagina de Caching do Next.js como "uma das melhores documentacoes" e explica os tipos:

### 1. Request Memoization (React)
Se dois componentes diferentes fazem a mesma chamada HTTP durante a renderizacao de uma mesma pagina, o React deduplica automaticamente. Isso significa que voce nao precisa passar dados via props entre componentes — pode fazer fetch nos dois que a requisicao so acontece uma vez.

### 2. Data Cache (Next.js)
Quando voce faz uma chamada fetch, por padrao ela e cacheada. Todos os usuarios que acessarem a mesma pagina nao vao gerar uma nova requisicao. Voce controla a revalidacao com `next: { revalidate: seconds }` ou desabilita com `cache: 'no-store'`.

### 3. Router Cache (Browser)
O Next faz cache automatico das rotas ja visitadas. Se voce acessa um produto, volta pra home e clica no mesmo produto, ele nao carrega de novo. E por isso que durante desenvolvimento, usar DevTools > Network > Disable Cache + Ctrl+Shift+R ajuda a testar o comportamento real.

### 4. Full Route Cache
Cache da rota completa renderizada no servidor. Junto com o Router Cache, forma o sistema completo de caching do Next.js.

## O cache e por URL completa

Ponto importante: quando voce usa `revalidate: 3600` na funcao `getProduct(slug)`, o cache e feito por URL completa. Ou seja, `/api/products/camiseta` e `/api/products/moletom` sao caches independentes. Nao e que todos vao ver o mesmo produto — vao ver o mesmo produto se tiver o mesmo slug.

## Ausencia de loading.tsx

O instrutor nota que a pagina de produto nao tem `loading.tsx` como a home. Por isso, quando clica num produto que ainda nao foi carregado, a tela fica em branco por um segundo (o delay da API). Isso contrasta com a home que tem um loading state. E uma observacao implicita de que loading.tsx deveria ser adicionado.