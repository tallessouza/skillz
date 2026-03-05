# Deep Explanation: Estilos e Fontes do Design System

## Por que remover o boilerplate do Next.js

O Next.js vem com fontes padrao (Geist, Geist Mono) que nao fazem parte do seu Design System. Manter codigo que nao sera usado cria confusao — alguem da equipe pode pensar que aquelas fontes sao intencionais. O instrutor enfatiza: delete tudo que nao pertence ao seu projeto.

## Figma Style Guide como fonte de verdade

O instrutor mostra que no Figma, em **File > Style Guide**, estao definidos todos os tokens do Design System: cores, tipografia (Inter), icones (Lucide). A abordagem correta e extrair esses valores e transforma-los em CSS variables no `:root` do `globals.css`. Isso garante que o codigo reflete exatamente o que o designer definiu.

## next/font e a propriedade `variable`

Ao usar `next/font/google`, voce configura:
- **`variable`**: define o nome da CSS variable (ex: `--font-sans`) que sera usada pelo Tailwind
- **`subsets`**: quais caracteres carregar (latin para portugues)
- **`weight`**: pesos especificos — 400 (normal), 600 (semi-bold), 700 (bold)

A vantagem sobre `@import` ou `<link>` e que next/font faz self-hosting automatico, elimina requests externos e previne layout shift (CLS).

## Aba Styles vs Computed no DevTools

O instrutor destaca uma diferenca importante que muitos devs desconhecem:

- **Aba Styles**: mostra o que voce escreveu no codigo (as regras CSS como foram declaradas)
- **Aba Computed**: mostra o que o browser calculou e aplicou de fato

Exemplo pratico: voce nao definiu `font-size: 16px` explicitamente, mas na aba Computed aparece `16px` porque o browser resolveu o valor herdado/padrao. A aba Computed e mais confiavel para debugging porque mostra o resultado final apos heranca, cascata e calculos.

## Estilos base no root layout

O `<body>` no `layout.tsx` e o lugar correto para estilos globais como:
- `antialiased` — melhora a renderizacao de fontes
- `bg-grey-900` — cor de fundo do Design System
- `text-white` — cor de texto padrao

Esses estilos sao herdados por todos os componentes filhos, evitando repeticao.

## Ordem de setup recomendada

1. Limpar boilerplate (fontes, estilos padrao)
2. Configurar CSS variables no `globals.css` a partir do Figma
3. Configurar fonte via `next/font/google`
4. Aplicar estilos base no root layout
5. Validar no browser com aba Computed