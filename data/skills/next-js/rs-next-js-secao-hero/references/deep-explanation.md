# Deep Explanation: Secao Hero

## Por que Hero Section como componente separado

O instrutor cria `HeroSection.tsx` como componente isolado desde o inicio. A pagina `index.tsx` fica limpa, contendo apenas fragments com as secoes importadas. Isso permite que cada secao da landing page seja desenvolvida e estilizada independentemente.

## Estrutura semantica

A tag `<section>` e usada porque a hero e uma secao tematica da pagina. O `<article>` com `flex flex-col` na pagina agrupa todas as secoes verticalmente. Cada secao e um bloco independente dentro desse article.

## Mobile-first com Tailwind

O instrutor aplica a abordagem mobile-first consistentemente:
- Valores base sao para mobile (ex: `items-center`, `hidden`)
- Breakpoints `md:` e `lg:` adicionam comportamento para telas maiores
- A imagem da hero e `hidden` por padrao e so aparece com `md:flex`
- Alinhamento muda de `center` (mobile) para `start` (desktop)

## Grid vs Flexbox para layout de 2 colunas

O instrutor inicialmente considera flex mas opta por grid com `grid-cols-1 md:grid-cols-2`. Grid distribui colunas iguais naturalmente, enquanto flex exigiria controle manual de largura. O `gap-8` (32px) separa conteudo da imagem.

## Botao que e link — padrao asChild

Problema real: um botao estilizado que precisa navegar. Solucoes erradas incluem `onClick` com `router.push` ou `<a>` estilizado como botao. A solucao correta com Shadcn/Radix e usar `asChild` no Button, que delega a renderizacao para o filho (`Link`). Isso preserva:
- Estilizacao do Button
- Navegacao do Link (client-side, sem reload)
- Semantica HTML correta (`<a>` no DOM)

## Imagens em /public no Next.js

O caminho `/hero-section.svg` no `src` do Image acessa diretamente `/public/hero-section.svg`. Nunca inclua `/public` no caminho — Next.js mapeia `/public` como raiz automaticamente. O instrutor demonstra exportando a imagem do Figma como SVG e colocando na pasta public.

## Container pattern

O instrutor usa uma classe `container` (provavelmente definida globalmente no Tailwind config) que adiciona padding lateral e centraliza o conteudo. Isso garante consistencia de largura entre todas as secoes da landing page.

## Icones com Lucide React

Icones sao importados do `lucide-react` (Clock, Store, ArrowRight). O instrutor define tamanho explicito (`height={16} width={16}`) porque o tamanho default pode nao ser o desejado. A cor e aplicada via classe Tailwind (`text-cyan-100`).

## Bug do header mencionado

O instrutor nota que o header "deu uma leve bugada" com a adicao da hero section. Isso acontece frequentemente quando o layout da hero empurra ou sobrepoe o header. Sera corrigido em aulas futuras — provavelmente com `position: sticky/fixed` e `z-index`.

## Overflow da imagem

O instrutor aplica `overflow-hidden` na div da imagem para evitar que ela vaze do container quando as dimensoes nao batem perfeitamente com o layout.