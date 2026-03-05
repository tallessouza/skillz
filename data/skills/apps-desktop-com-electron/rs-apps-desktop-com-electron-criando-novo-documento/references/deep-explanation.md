# Deep Explanation: React Query Mutations com Cache Otimizado

## Por que useMutation e nao apenas fetch?

O `useMutation` do React Query oferece um ciclo de vida completo para operacoes de escrita: estado de loading automatico, callbacks de sucesso/erro, e integracao nativa com o cache do React Query. Isso elimina a necessidade de gerenciar manualmente estados como `isLoading`, `error`, e a sincronizacao entre diferentes partes da UI.

## mutate vs mutateAsync

O React Query oferece duas formas de executar uma mutation:
- `mutate`: fire-and-forget, nao retorna Promise
- `mutateAsync`: retorna Promise, permitindo `await` e composicao

O instrutor (Diego) recomenda `mutateAsync` como padrao porque permite encadear operacoes e tratar erros com try/catch de forma natural.

## O problema do onClick direto

Quando voce escreve `onClick={createDocument}`, o React repassa o `MouseEvent` como primeiro argumento para `createDocument`. Se a funcao nao espera parametros, isso pode causar comportamento inesperado. A solucao e sempre envolver em uma arrow function: `onClick={() => createDocument()}`.

## invalidateQueries vs setQueryData — A decisao central

### invalidateQueries
- Marca uma query como "invalida"
- React Query refaz automaticamente a query para obter dados frescos
- Resulta em **duas requisicoes**: uma para a mutation + uma para o refetch
- Simples de implementar

### setQueryData
- Atualiza diretamente o cache da query sem fazer nova requisicao
- Resulta em **uma unica requisicao**: apenas a mutation
- Requer manipulacao imutavel do estado
- Mais eficiente, especialmente em APIs REST com latencia

### Quando cada um faz sentido

O instrutor explica que no contexto do Electron (IPC local), `invalidateQueries` funciona bem porque nao ha latencia de rede. Porem, em aplicacoes web com API REST ou GraphQL, a diferenca e significativa: `setQueryData` elimina uma requisicao inteira.

A analogia e: se voce acabou de criar um documento e ja tem todos os dados dele na resposta da mutation, por que pedir ao servidor a lista completa de novo? Voce ja sabe o que mudou — basta adicionar o novo item ao cache.

## Imutabilidade no setQueryData

O React Query detecta mudancas comparando referencias. Se voce fizer `documents.push(newDoc)`, a referencia do array nao muda e o React Query nao percebe a atualizacao. Por isso, e obrigatorio criar um novo array: `[...documents, newDoc]`.

## Tipagem do updater no setQueryData

O callback do `setQueryData` recebe o estado atual do cache, que pode ser `undefined` (se a query nunca foi executada). O React Query forca essa tipagem para seguranca. A solucao e verificar se `documents` existe antes de spread:

```typescript
(documents: Document[] | undefined) => {
  if (documents && documents.length >= 0) {
    return [...documents, data]
  }
  return [data]
}
```

## Renomeando isLoading — por que importa

Um componente pode ter multiplas mutations e queries. Se todas exportam `isLoading`, voce perde rastreabilidade. O padrao recomendado pelo instrutor:
- `isCreatingNewDocument` (mutation de criar)
- `isDeletingDocument` (mutation de deletar)
- `isFetchingDocuments` (query de listar)

Isso torna o codigo auto-documentado e facilita debugging.

## refetchOnWindowFocus — comportamento padrao

O React Query por padrao refaz queries quando a janela recebe foco (`refetchOnWindowFocus: true`). O instrutor demonstra isso: ao sair e voltar para a janela do Electron, a lista de documentos e recarregada automaticamente. Isso e util mas nao substitui a atualizacao otimista via `setQueryData`.

## React Query como gerenciador de estado server-side

O instrutor enfatiza que React Query elimina a necessidade de bibliotecas como Redux, Zustand, Jotai ou Context API para gerenciar dados do servidor. O cache do React Query **e** o estado. Isso e um ponto central: nao misture estado de servidor (React Query) com estado de UI (useState/context).