# Deep Explanation: Funcionalidade de Like com Interface Otimista

## Por que interface otimista?

O instrutor demonstra que sem interface otimista, o usuario clica no botao de like e precisa esperar a resposta do servidor (200-500ms+) para ver a UI atualizar. Com a abordagem otimista, a UI atualiza instantaneamente — o React Query manipula o cache local antes mesmo da requisicao completar.

A logica e: "mostre que deu certo imediatamente, e se der erro, volte ao estado anterior". Isso cria uma experiencia muito mais fluida.

## O problema de hidratacao (Server vs Client)

Um dos pontos mais importantes da aula: quando se usa `Suspense` com dados que dependem do usuario logado, ocorre um erro de hidratacao. Por que?

1. No servidor (SSR), a requisicao `getIssueInteractions` roda SEM os cookies do usuario
2. O servidor retorna `isLiked: false` (nao sabe quem e o usuario)
3. No cliente, a mesma requisicao roda COM os cookies
4. O cliente retorna `isLiked: true` (sabe que o usuario deu like)
5. React detecta que o HTML do servidor difere do cliente → erro de hidratacao

**Solucao:** Remover o Suspense e usar `useQuery` normal. Assim, a requisicao so acontece no client-side, onde sempre tera a informacao do usuario logado.

O instrutor menciona que seria possivel passar headers no server-side para resolver isso, mas optou pela abordagem client-only por simplicidade.

## Anatomia do onMutate

O `onMutate` e o coracao da interface otimista:

1. **Salva o estado anterior** — `queryClient.getQueryData(queryKey)` captura o snapshot
2. **Atualiza o cache otimisticamente** — `queryClient.setQueryData()` modifica os dados locais
3. **Retorna o snapshot** — o valor retornado fica disponivel como `context` no `onError`

A tipagem e importante: o instrutor usa `z.infer<typeof schema>` para tipar corretamente os dados do cache, garantindo que o TypeScript valide a estrutura do updater.

## Logica do toggle no map

Como e um toggle (like/unlike), a logica no `setQueryData` precisa:
- Inverter `isLiked` (`!interaction.isLiked`)
- Ajustar `likesCount`: se estava curtido, diminui 1; se nao estava, aumenta 1
- Mapear apenas a interaction correta (comparando `issueId`)
- Retornar as demais interactions inalteradas

## Rollback no onError

O `onError` recebe tres parametros: `(error, variables, context)`. O `context` e exatamente o que foi retornado pelo `onMutate`. Basta verificar se existe e restaurar:

```typescript
onError: (_error, _variables, context) => {
  if (context) {
    queryClient.setQueryData(queryKey, context)
  }
}
```

O instrutor demonstra isso ao forcadamente lancar um erro (`throw new Error('test')`) na funcao de toggleLike — a UI atualiza otimisticamente, mas volta ao valor original quando o erro e capturado.

## Metodo HTTP: POST vs PATCH

O instrutor nota que o mais correto semanticamente seria usar PATCH para o toggle de like (ja que e uma modificacao parcial de um recurso), mas a API foi construida com POST. Ele manteve POST por pragmatismo, mas reconhece que PATCH seria mais adequado.

## Separacao de responsabilidades

O componente LikeButton e mantido como o componente "cru" que contem toda a logica de mutation. Isso porque ele e reutilizado tanto no board quanto no detalhe da issue. A mutation fica encapsulada no componente mais baixo da arvore, nao no pai.