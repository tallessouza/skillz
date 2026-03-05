# Deep Explanation: Integrando Carrinho com Frontend

## Por que useSWR e nao useState/useEffect

O instrutor escolhe `useSWR` porque ele gerencia automaticamente:
- **Cache**: dados do carrinho ficam cacheados entre navegacoes
- **Revalidacao**: ao voltar pra aba ou focar na janela, revalida
- **Loading/Error states**: sem boilerplate manual
- **Mutate com optimistic data**: atualiza UI antes da resposta

A alternativa seria `useState` + `useEffect` + fetch manual, que exige muito mais codigo e nao tem optimistic updates nativos.

## O problema do delay visual

Sem optimistic data, o fluxo e:
1. Usuario clica "+"
2. Requisicao vai pro servidor (~200-500ms)
3. Resposta volta
4. `mutate()` revalida (outra requisicao)
5. UI atualiza

Com optimistic data:
1. Usuario clica "+"
2. UI atualiza INSTANTANEAMENTE com dados calculados localmente
3. Requisicao vai pro servidor em background
4. Se falhar, SWR reverte automaticamente

## Carrinho vinculado a loja

O instrutor demonstra que ao adicionar produto de outra loja, o backend automaticamente cria um novo carrinho. O frontend nao precisa de logica especial — o SWR revalida e mostra o novo carrinho. Isso e uma decisao de arquitetura: um carrinho por loja, nao carrinho multi-loja.

## O bug do bad request na quantidade zero

O instrutor encontrou um bug real: ao diminuir quantidade para zero, o backend retorna 400 Bad Request porque nao aceita `quantity: 0`. A solucao e verificar no frontend:
- `quantity < 1` → chamar `removeFromCart` em vez de `updateCartItem`

Isso tambem afeta o optimistic data — no caso de remocao, use `filter` em vez de `map`.

## Backend: total e nome da loja

O instrutor adiciona ao endpoint `getCart` um JOIN com stores para retornar `store.name` e calcula o total. Ponto importante: ao usar `json_build_object` com aggregate (GROUP BY), todas as colunas nao-agregadas precisam estar no GROUP BY — o instrutor encontrou esse erro e adicionou `stores.name` e `stores.id` ao GROUP BY.

## Abordagem funcional primeiro, layout depois

O instrutor segue uma estrategia explicita: primeiro implementa tudo funcional (botoes basicos, `<ul>`, `<pre>` para debug), depois aplica o layout bonito. Isso evita perder tempo com CSS enquanto a logica ainda nao funciona.

## Diretiva "use client"

O instrutor esqueceu inicialmente de adicionar `"use client"` no componente da pagina do carrinho. Hooks como `useSWR` so funcionam em client components no Next.js App Router.