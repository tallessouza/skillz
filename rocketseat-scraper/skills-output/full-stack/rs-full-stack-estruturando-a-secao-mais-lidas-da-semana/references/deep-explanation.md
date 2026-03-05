# Deep Explanation: Estruturando Seções de Listagem de Conteúdo

## Por que `<section>` e não `<div>`?

O instrutor usa `<section class="weekly">` porque a seção "Mais Lidas da Semana" é um bloco temático do portal de notícias. Segundo a spec HTML, `<section>` representa um agrupamento temático de conteúdo, geralmente com um heading. Isso facilita:
- Acessibilidade (screen readers anunciam a seção)
- Estilização isolada por especificidade
- SEO (mecanismos de busca entendem a hierarquia)

## A escolha de `<figure>` para os cards

Cada item da lista "mais lidas" é um conteúdo autocontido: tem uma imagem, uma tag de categoria e um texto. O elemento `<figure>` é semanticamente correto porque representa conteúdo referenciado no fluxo principal mas que pode ser movido sem afetar o significado. Cards de notícia se encaixam perfeitamente.

O `<p>` dentro do figure funciona como legenda simplificada. O instrutor não usa `<figcaption>` explicitamente aqui — o parágrafo serve como texto descritivo direto.

## Header com Grid Flow Column

O instrutor aplica `grid grid-flow-col` no header para posicionar o `<h3>` à esquerda e o link "Ver tudo" à direita. Isso é mais limpo que flexbox com `justify-content: space-between` porque:
- Usa classes utilitárias já existentes no projeto
- Não precisa de CSS custom
- O `grid-flow-col` faz os filhos se posicionarem em colunas automaticamente

## O padrão `<span>` vazio para ícones

No link "Ver tudo", o instrutor coloca um `<span>` vazio após o `<strong>`. A seta será adicionada via CSS (pseudo-element ou background-image). Isso porque:
- Ícones decorativos não devem ser no HTML
- Facilita trocar o ícone sem tocar no markup
- Mantém o HTML limpo e semântico

## Content Tag como primeiro filho

A tag de categoria (`<span class="content-tag">`) aparece antes da imagem no markup. Visualmente, ela será posicionada sobre a imagem via CSS (position absolute). Colocá-la primeiro no DOM facilita:
- Leitura do código (categoria → imagem → texto = ordem lógica)
- Acessibilidade (screen reader lê a categoria antes da imagem)

## Texto truncado com três pontinhos

O instrutor menciona repetidamente "três pontinhos" nos textos. Isso indica que o CSS aplicará `text-overflow: ellipsis` nos parágrafos. O HTML prepara isso tendo um `<p>` com texto longo que será cortado visualmente.

## Grid com Gap para espaçamento

Em vez de adicionar `margin-bottom` em cada figure, o container usa `class="grid gap-16"`. Vantagens:
- Espaçamento uniforme entre todos os filhos
- Último item não tem margem extra
- Uma única declaração controla todo o layout

## Fluxo de trabalho do instrutor

O instrutor segue um padrão claro:
1. Cria a estrutura HTML completa de UM card
2. Aplica classes utilitárias mínimas para visualizar
3. Duplica o card para os demais itens
4. Ajusta imagens (sequência numérica) e textos
5. Deixa o CSS para a próxima etapa

Esse padrão "estrutura primeiro, estilo depois" é eficiente porque permite validar a semântica HTML antes de investir tempo em CSS.