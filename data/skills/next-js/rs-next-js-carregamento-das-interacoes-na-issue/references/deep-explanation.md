# Deep Explanation: Carregamento de Interacoes na Issue

## Por que uma unica rota para single e batch?

O instrutor explica que a API ja tem uma unica rota que recebe um array de IDs das issues para carregar o numero de likes. Quando voce quer carregar de uma unica issue, basta enviar um unico ID. Nao ha necessidade de duas rotas separadas. Isso simplifica o codigo HTTP — uma funcao serve para o detalhe da issue (1 ID) e para o board (N IDs).

Os IDs sao enviados como search params separados por virgula: `issueIds=id1,id2,id3`.

## Autenticacao via cookies: client-side vs server-side

### Client-side (navegador faz o fetch)

O BetterAuth salva o token de autenticacao nos cookies. Cookies sao informacoes transicionadas atraves dos headers. Para chamadas client-side (fetch que acontece no navegador, nao no server component do Next), basta adicionar `credentials: 'include'` no fetch. Isso inclui automaticamente todos os headers, incluindo cookies, na requisicao para o back-end.

### Server-side (server component faz o fetch)

Se a requisicao for feita dentro de um server component, os cookies nao sao enviados automaticamente. E necessario:

```typescript
import { headers } from 'next/headers'

const response = await fetch(url, {
  headers: await headers(), // repassa todos os headers incluindo cookies
})
```

O instrutor menciona que "daqui a pouco" terao requisicoes server-side, entao essa distincao e importante.

## Por que useSuspenseQuery ao inves de useQuery?

O instrutor expressa uma preferencia clara: "Depois que a gente tem o Suspense do React, eu prefiro usar Suspense para quase tudo."

Com `useQuery`, voce precisa lidar com `isLoading` e `data` possivelmente undefined:
- Verificar isLoading
- Verificar se data existe
- Muitos condicionais no JSX

Com `useSuspenseQuery`:
- O componente so renderiza quando o data existe
- O TypeScript ja sabe que data nao e undefined
- O loading state e delegado ao `<Suspense fallback>` no componente pai
- O componente fica mais limpo e declarativo

## Por que o prefixo "initial" nas props?

O instrutor explica: "Eu to colocando initial na frente porque quer dizer o numero de likes na hora que eu carreguei esse botao. Porque inicial? Porque pode mudar depois quando o usuario clicar para dar like."

Isso e um pattern de naming importante — comunica que o valor e um ponto de partida, nao a fonte de verdade permanente. O componente tera logica interna para atualizar o estado apos interacao.

## Data attributes para estilo condicional

O instrutor diz: "Algo que eu gosto muito de fazer no Tailwind e criar data attributes." A abordagem:

1. Adiciona `data-liked={liked}` no elemento
2. Usa classes Tailwind condicionais: `data-[liked=true]:bg-indigo-600`

Isso desacopla a logica de estilo do JSX — ao inves de ternarios inline nas classes, o estilo reage ao atributo de dados.

## Debugging: erro de schema (Zod)

Durante a aula, o instrutor encontrou um erro: `Invalid type, expected array... issueIds received undefined`. O problema era que na API o parametro se chamava `issueIds` mas no codigo estava sendo enviado como `issuesIds` (com 's' extra). Isso ilustra a importancia de verificar os nomes exatos dos parametros da API.

## Menor client component possivel

O instrutor enfatiza: "Eu nao quero transformar toda essa minha pagina em um client component. Nao faz sentido. Eu quero que o meu client component seja o menor pedaco de codigo possivel."

Por isso o pattern e:
- Page (server component) → busca dados estaticos
- IssueLikeButton (client component minimo) → apenas o React Query
- LikeButton (componente reutilizavel) → apenas apresentacao e interacao

## Componente reutilizavel com ComponentProps

O instrutor estende `ComponentProps<'button'>` ao inves de receber `disabled` como prop separada. Isso permite que o componente pai passe qualquer prop nativa do botao (disabled, onClick, className, etc.) sem precisar declarar cada uma.