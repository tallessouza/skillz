# Deep Explanation: Iniciando a Home

## Por que substituir as fontes do starter template

O Next.js vem com fontes padrao (Geist, Geist_Mono) no template inicial. O instrutor enfatiza que essas fontes **nao serao utilizadas** — o projeto usa Inter conforme definido no Figma. A substituicao deve ser feita logo no inicio para evitar flash de fonte incorreta (FOUT) e garantir consistencia visual desde o primeiro componente.

## Configuracao de pesos especificos

O instrutor configura pesos `400`, `500` e `700`. Isso e intencional:
- **400**: texto corrido (paragrafos, descricoes)
- **500**: texto com enfase media (labels, subtitulos)
- **700**: titulos e elementos de destaque

Carregar todos os pesos (`100-900`) seria desperdicar bandwidth. O `next/font/google` faz code splitting automatico, mas so se voce declarar os pesos explicitamente.

## Fonte secundaria (Tight/Display)

O instrutor menciona uma segunda fonte para uso decorativo — referenciada como "tights" no Figma. Ela e configurada separadamente com apenas peso `700` e subset `latin`, porque fontes display geralmente so aparecem em titulos grandes. Cada fonte gera sua propria CSS variable, permitindo uso independente via Tailwind.

## Estrutura de layout preparatoria

O instrutor cria divs de agrupamento **antes** de ter todo o conteudo pronto. A div com `flex items-center justify-between` existe para acomodar o date picker que sera criado em aulas futuras. Esse padrao — criar a estrutura responsiva primeiro e preencher depois — evita refatoracao de layout quando novos componentes chegam.

## Classes de design system

As classes como `bg-background-primary`, `text-title`, `text-content`, `text-paragraph-small`, `text-content-secondary` nao sao classes padrao do Tailwind. Elas fazem parte do design system configurado no `tailwind.config` do projeto, mapeando tokens do Figma para classes utilitarias. Isso garante que mudancas no design system se propaguem automaticamente.

## Metadata do projeto

O instrutor extrai titulo ("Mundo Pet") e descricao diretamente do Figma para configurar os metadados do Next.js. Isso e importante para SEO e para manter o projeto alinhado com o design desde o inicio.

## Abordagem incremental

A aula termina com a estrutura basica pronta mas incompleta — sem date picker, sem dados do Prisma. O instrutor explicitamente diz que a aula foi limitada para nao ficar grande demais. Esse padrao de desenvolvimento incremental (layout primeiro → componentes → dados) e tipico de projetos Next.js bem organizados.