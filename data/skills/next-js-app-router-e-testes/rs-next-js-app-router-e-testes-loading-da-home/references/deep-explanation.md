# Deep Explanation: Loading com Skeleton Screens

## Por que skeleton screens e nao spinners?

O instrutor explica que um simples "Carregando..." ou spinner no meio da tela "fica muito feio". A preferencia por skeleton screens vem do fato de que elas mostram ao usuario a **estrutura** do conteudo que esta sendo carregado. Isso reduz a percepcao de tempo de espera porque o cerebro ja comeca a processar o layout antes do conteudo chegar.

## O problema do className sendo substituido

Quando voce define classes fixas em um componente (`bg-zinc-50/10 animate-pulse rounded-md`) e recebe `className` via props, o React simplesmente concatena as strings. Porem, se a prop className contiver uma classe que conflita com as fixas (ex: `bg-red-500` vs `bg-zinc-50/10`), ambas serao aplicadas e o comportamento depende da ordem no CSS — nao da ordem na string.

O `tailwind-merge` resolve isso inteligentemente: ele sabe que `bg-red-500` e `bg-zinc-50/10` sao da mesma categoria e mantem apenas a ultima (a da prop), enquanto preserva classes de categorias diferentes.

## O erro classico do tailwind.config

O instrutor admite que errou em aulas anteriores: colocou customizacoes direto em `theme` ao inves de `theme.extend`. A consequencia e que TODAS as opcoes padrao do Tailwind para aquela propriedade desaparecem. Por exemplo, `gridTemplateRows` padrao tem valores 1-6 e 9. Ao colocar `{ app: '...' }` direto em `theme.gridTemplateRows`, apenas `app` fica disponivel — os valores 1-6 e 9 somem.

A solucao e usar `theme.extend.gridTemplateRows`, que ADICIONA `app` mantendo todos os valores originais.

## Simulacao de delay para desenvolvimento

O instrutor adiciona um delay artificial nas rotas de API para simular um ambiente real:

```typescript
await new Promise(resolve => setTimeout(resolve, 1000))
```

Isso e uma tecnica de desenvolvimento importante: sem delay, o loading e tao rapido que voce nunca ve o skeleton, e problemas de UX ficam invisiveis. Em producao, a latencia real da rede fara o skeleton aparecer naturalmente.

## Ajuste fino do tamanho do skeleton

O instrutor mostra um processo iterativo: comeca com `h-[780px]`, testa, ajusta para 860, volta para 856. O ponto importante e que o skeleton deve ter **tamanho muito proximo** ao conteudo real para evitar "layout shift" — o salto visual quando o conteudo substitui o skeleton.

## ComponentProps do React

Usar `ComponentProps<'div'>` ao inves de definir props manualmente garante que o componente Skeleton aceita TODAS as props nativas de uma div (onClick, style, aria-*, data-*, etc.), nao apenas className. Isso torna o componente verdadeiramente reutilizavel.