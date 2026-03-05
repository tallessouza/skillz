# Deep Explanation: Layout no Next.js Pages Router

## Por que o Layout vai no _app.tsx?

O instrutor conecta diretamente com as aulas anteriores sobre arquivos especiais do Next.js. O `_app.tsx` é o componente que envolve TODAS as páginas da aplicação. Isso significa que qualquer coisa colocada ali será compartilhada automaticamente entre todas as rotas.

A analogia visual usada pelo instrutor: imagine a tela como camadas:
- **Branco (div externa):** o container geral do Layout
- **Verde (header):** fixo no topo, compartilhado
- **Roxo (main):** o conteúdo que MUDA entre páginas (home vs blog)
- **Amarelo (footer):** fixo embaixo, compartilhado

O `_app.tsx` é como se fosse a "moldura" — ele está sempre presente. As páginas individuais (`index.tsx`, `blog.tsx`) são injetadas dentro dessa moldura, especificamente no `{children}` do Layout.

## A estrutura mental: casca vs conteúdo

O instrutor usa o termo "casca" para o Layout. A casca não muda — header, footer, estilos base permanecem. O que muda é o "recheio" (children). Na home, o recheio é o conteúdo da landing page. No blog, é a lista de posts. Mas a casca é idêntica.

## Por que relative na div wrapper?

O `relative` no wrapper existe especificamente para permitir que o header seja fixado (sticky/fixed positioning). Sem o `relative` no parent, o posicionamento do header não teria referência correta.

## Barrel export — evitando o "layout/layout"

O instrutor mostra um problema real: sem o `index.ts`, o import fica `from './Layout/Layout'` — redundante e feio. O barrel export (`index.ts` que re-exporta) resolve isso, permitindo `from './Layout'`.

## Benefício principal: páginas ficam limpas

Após aplicar o Layout no `_app.tsx`, o instrutor demonstra que pode remover o import do Header da página index. A página agora só contém seu próprio conteúdo. Isso é o ganho: cada página foca apenas no que é único dela.