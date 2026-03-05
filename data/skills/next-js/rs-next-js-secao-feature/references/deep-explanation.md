# Deep Explanation: Secao Feature

## Estrutura de componente por secao

O instrutor segue o padrao de criar um arquivo por secao da landing page (`feature-section.tsx`) com export nomeado e um `index.ts` para re-exportar. Isso permite compor a page importando secoes individuais, mantendo cada uma isolada e testavel.

## Padrao de cards identicos vs diferenciados

A secao tem 3 cards. Os dois primeiros sao estruturalmente identicos — mesma div, mesmas classes, so muda o texto. O instrutor copia a div inteira e troca o conteudo. O terceiro card e diferente: tem imagem, tem CTA, e usa grid para layout de duas colunas.

A decisao de quando copiar vs quando abstrair e pragmatica: se sao 2-3 cards e a pagina e estatica, copiar e mais rapido e mais legivel do que criar um componente generico com props.

## Tecnica do botao duplicado para responsividade

Este e o insight mais valioso da aula. Quando o CTA precisa mudar de posicao entre mobile e desktop (ex: no desktop fica ao lado do texto, no mobile fica abaixo da imagem), o instrutor cria **dois botoes identicos** em posicoes diferentes do DOM:

1. Botao dentro do container de texto: `hidden md:flex` (aparece so no desktop)
2. Botao apos a imagem: `md:hidden` (aparece so no mobile)

Isso e mais simples e previsivel do que usar CSS Grid com `order` ou position absolute. O custo e HTML duplicado, mas o ganho e previsibilidade total do layout.

## Criando estilos customizados no Tailwind

Quando o style guide do design tem um estilo que nao existe no Tailwind (no caso, `body-tag` com 12px, medium weight), o instrutor vai ao `tailwind.config` e cria o estilo como classe customizada. Ele segue exatamente as specs do style guide: tamanho, line-height, font-weight.

O principio e: **nunca use classes utilitarias avulsas quando o design system tem um token definido.** Crie a classe no config para que fique reutilizavel e rastreavel.

## Contencao de imagens com Next Image

Para evitar que a imagem estoure o container, o padrao e:
1. Div wrapper com `overflow-hidden` e `max-w-md`
2. Imagem com `object-cover` e `w-full`
3. `width` e `height` explicitos no componente Image

O `overflow-hidden` corta qualquer excesso, o `object-cover` garante proporcao, e o `max-w` limita o tamanho maximo em telas grandes.

## Responsividade mobile-first

Toda a estilizacao segue mobile-first: classes base sao para mobile, e `md:` adiciona estilos para telas maiores. Exemplos:
- `grid-cols-1` base → `md:grid-cols-2` em desktop
- `p-6` base → `md:p-12` em desktop
- `hidden` base → `md:flex` em desktop (para o botao)
- `w-full` base → `md:w-fit` em desktop

## Formatacao automatica do VS Code

O instrutor menciona usar `Cmd+Shift+P > Format Document` para organizar a indentacao quando o JSX fica grande. Isso evita erros de leitura e facilita identificar containers aninhados.