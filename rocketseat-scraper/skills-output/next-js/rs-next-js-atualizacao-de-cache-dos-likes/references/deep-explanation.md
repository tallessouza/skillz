# Deep Explanation: Atualizacao de Cache dos Likes

## O problema central

Quando voce tem a mesma informacao (ex: contagem de likes) exibida em multiplos lugares — um board com cards e uma pagina interna de detalhe — atualizar apenas a query da pagina atual deixa a outra view desatualizada. O usuario da like no board, o numero muda ali, mas ao entrar no detalhe vê o numero antigo (ou vice-versa).

## Por que prefixo resolve

O TanStack Query organiza queries por `queryKey`. Se tanto o board quanto o detalhe usam keys que comecam com `['issueLikes']` (ex: `['issueLikes']` para a lista, `['issueLikes', issueId]` para o detalhe), voce pode usar `getQueriesData({ queryKey: ['issueLikes'] })` para capturar TODAS as queries que compartilham esse prefixo.

A funcao `setQueriesData` aplica uma funcao de atualizacao em todas essas queries simultaneamente. Isso garante que, nao importa quantas views estejam mostrando likes, todas serao atualizadas no mesmo instante.

## O pattern de rollback multi-query

Com `getQueryData` (singular), voce salvava um unico snapshot. Com `getQueriesData` (plural), voce recebe um array de tuplas `[queryKey, data]`. No `onError`, voce precisa iterar esse array e restaurar cada query individualmente:

```typescript
for (const [queryKey, data] of context.previousData) {
  queryClient.setQueryData(queryKey, data)
}
```

Isso e essencial porque `setQueriesData` nao tem um `resetQueriesData` equivalente.

## O problema do clique propagado

Quando um botao de like esta dentro de um card que e um link (ou tem onClick para navegacao), clicar no botao dispara AMBOS os handlers — o do botao E o do card. O resultado: o like funciona, mas o usuario e redirecionado para a pagina interna involuntariamente.

A solucao e dupla:
- `event.stopPropagation()` — impede que o evento suba para o card pai
- `event.preventDefault()` — impede o comportamento padrao (navegacao se for um `<a>` ou `<Link>`)

## Por que separar handler do callback

O instrutor renomeou `handleToggleLike` (que era o callback da mutation) para `onToggleLike`, e criou um novo `handleToggleLike` local que:
1. Recebe o evento do DOM
2. Faz stopPropagation/preventDefault
3. Chama `onToggleLike()` (a mutation)

Essa separacao mantem o componente LikeButton desacoplado — ele nao precisa saber se esta dentro de um card ou nao. O handler de evento e responsabilidade da camada de UI, a mutation e responsabilidade da camada de dados.

## Verificacao

Para confirmar que funciona:
1. Clique no like no board → numero atualiza instantaneamente no board
2. Entre na pagina interna → numero ja esta atualizado
3. Clique no like na pagina interna → numero atualiza
4. Volte ao board → numero consistente
5. De F5 em qualquer view → numero persiste (veio do servidor)