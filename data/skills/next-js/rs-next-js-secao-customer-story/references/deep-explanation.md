# Deep Explanation: Separacao de Dados e Apresentacao

## Por que separar dados de apresentacao?

O instrutor destaca que, embora a seccao de "Customer Story" pareca simples visualmente, ela introduz uma **estrategia diferente** das seccoes anteriores. Nas seccoes anteriores do curso, cards similares foram criados via copy-paste de JSX — o instrutor reconhece isso e propoe a refatoracao futura.

## O insight central

A ideia e: se voce tem N elementos visuais com a mesma estrutura mas dados diferentes, voce define um array de objetos com os dados variaveis e itera sobre ele com `.map()`. Isso significa que:

1. **Adicionar um novo cliente** = adicionar um objeto ao array. Zero mudanca no JSX.
2. **Mudar o layout do card** = mudar um unico bloco de JSX. Todos os cards atualizam automaticamente.
3. **Manter consistencia** = impossivel ter um card com estrutura diferente dos demais por acidente.

## Otimizacao prematura vs. padrao saudavel

O instrutor faz uma observacao importante: nas seccoes anteriores, ele propositalmente usou copy-paste para nao "sofrer de otimizacoes prematuras". Porem, agora que o padrao se repete claramente (titulo + cards), ele introduz a abordagem data-driven. A licao e: **espere o padrao se confirmar antes de abstrair, mas abstraia quando confirmado**.

## Escalabilidade pratica

O instrutor demonstra ao vivo: duplicou um objeto no array e imediatamente um terceiro card apareceu sem nenhuma mudanca no componente. Isso torna a manutencao trivial — especialmente em landing pages onde stakeholders frequentemente pedem "adiciona mais um depoimento".

## Refatoracao sugerida

O instrutor explicitamente sugere que o aluno volte nas seccoes anteriores (que usaram copy-paste de cards) e aplique o mesmo principio. Isso reforça que a tecnica e universal para qualquer componente repetido.

## Estrutura do componente

O padrao seguido:
- `components/CustomerStorySection/index.tsx` — barrel export
- `components/CustomerStorySection/CustomerStorySection.tsx` — componente + dados
- Imagens exportadas do Figma como PNG para `/public/`
- Next.js `Image` com `fill` e `object-cover` para avatares circulares

## Estilizacao com Tailwind

Padroes de estilizacao usados:
- Section: container, padding responsivo (`py-8 md:py-10`), flex items-center
- Grid de cards: `grid gap-8 md:grid-cols-2`
- Card: `flex flex-col gap-6 rounded-lg bg-gray-800 p-6 md:p-12`
- Avatar: `relative h-10 w-10 overflow-hidden rounded-full` com Image fill + object-cover
- Tipografia: `text-balance text-gray-200` para conteudo, `text-sm text-gray-200` para nome, `text-xs text-gray-300` para role
- Titulo usa fonte custom PT Sans Caption weight 700 via next/font