# Deep Explanation: Secao Support — Card Grid em Landing Page

## Por que envolver icones em containers?

O instrutor destaca que icones Lucide (como `PaintbrushVertical`, `Store`, `Handshake`) precisam de um container visual — uma div com fundo colorido, arredondamento e centralizacao. Sem isso, o icone fica "solto" e desalinhado visualmente dos textos do card.

O pattern e: div com `flex h-12 w-12 items-center justify-center rounded-lg bg-{cor} mb-4`. Isso cria um "badge" quadrado com cantos arredondados que contem o icone.

## Grid vs Flex para cards

O instrutor usa `grid gap-6 md:grid-cols-3` ao inves de flexbox para distribuir os cards. Grid e preferivel aqui porque:
- Distribui largura uniformemente entre colunas
- Colapsa automaticamente para coluna unica em mobile (sem `grid-cols-3` no mobile, vira stack)
- `gap` funciona de forma mais previsivel que margin entre items

## Next Font — PT Sans Caption

O instrutor importa `PT_Sans_Caption` de `next/font/google` com parametros especificos:
- `subsets: ["latin"]` — carrega apenas caracteres latinos
- `weight: "700"` — como string, nao numero

A aplicacao usa template literal no className: `` `${ptSansCaption.className} text-balance text-center text-heading-xl text-gray-100` ``

Ele menciona que esqueceu de aplicar essa fonte na secao anterior (features) e corrige nesta aula. Isso reforca: defina fontes customizadas cedo e aplique consistentemente.

## Gradientes sutis

A section usa `bg-gradient-to-r from-gray-500 to-gray-700` para um gradiente horizontal sutil. O instrutor experimenta diferentes abordagens — gradiente na section vs no content wrapper — e conclui que depende do design (se ha imagem de fundo, precisa de width 100%).

No final, ele simplifica removendo o gradiente e usando cor solida, mostrando que simplicidade muitas vezes ganha.

## Diferenciacao por cor, nao por estrutura

Os tres cards tem estrutura HTML identica. So mudam:
- Card 1: `bg-blue-400` / icone container `bg-blue-300` / icone `PaintbrushVertical`
- Card 2: `bg-cyan-300` / icone container `bg-cyan-200` / icone `Store`
- Card 3: `bg-blue-400` / icone container `bg-blue-300` / icone `Handshake`

O instrutor menciona explicitamente que esse pattern de repeticao e candidato a refatoracao em componente reutilizavel — assunto da proxima aula.

## Barrel exports

O instrutor cria `index.ts` em cada pasta de componente exportando tudo com `export * from './support-section'`. Isso permite imports limpos na page.

## Responsividade

Pattern consistente em toda a landing page:
- `p-6 md:p-12` — padding menor em mobile
- `pb-8 md:py-10` — padding vertical na section
- `md:grid-cols-3` — grid so em telas medias+