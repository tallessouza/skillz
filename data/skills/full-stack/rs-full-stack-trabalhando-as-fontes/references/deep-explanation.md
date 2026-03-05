# Deep Explanation: Trabalhando as Fontes

## Por que importar a fonte depois do stylesheet?

O instrutor menciona que gosta de deixar o link da fonte depois do link do estilo. Isso e uma preferencia pratica: visualmente separa o CSS do projeto das dependencias externas. Funcionalmente, ambas as ordens funcionam porque o browser processa todos os `<link>` antes de renderizar, mas a convencao ajuda na organizacao do `<head>`.

## Inspecao no Figma quando nao ha Style Guide

O instrutor destaca um cenario real: nem todo projeto tem um Style Guide bonito no Figma. Muitas vezes voce recebe um layout "cru" e precisa clicar em cada elemento de texto para descobrir:

- Nome da fonte (aparece no painel de propriedades do texto)
- Tamanho (font-size)
- Peso (font-weight)
- Altura de linha (line-height)
- Cor (color)

A dica e: clique em TODOS os textos diferentes da pagina para mapear se ha mais de uma fonte. No caso da aula, todas usavam "Alice", mas em projetos reais voce pode encontrar 2-3 fontes diferentes.

## Estrategia de aplicacao no :root

O instrutor usa `:root` em vez de `body` ou `*`. Isso e uma escolha semantica:

- `:root` tem maior especificidade que `body` (pseudo-classe vs elemento)
- Funciona como ponto central de configuracao (similar a CSS custom properties)
- Permite que `font-family`, `line-height` e `color` sejam herdados por todos os elementos

## Tokens de cor: primary vs secondary

O Figma define duas cores de texto:
- **text-color-primary** (`#1B1B1F`): para headings (h1, h2) — escura, alto contraste
- **text-color-secondary** (`#4F5666`): para paragrafos e texto geral — mais suave

A estrategia e definir a cor secundaria (mais usada) no `:root` e sobrescrever com a primaria apenas nos headings. Isso minimiza declaracoes CSS.

## Line-height: porcentagem vs pixels

O instrutor usa `140%` e `150%` em vez de valores em pixels. Isso e importante porque:

- `line-height: 150%` escala com o `font-size` do elemento
- `line-height: 24px` ficaria desproporcional se o font-size mudasse
- No Figma, valores como "140" ao lado de um font-size de 40px significam 140% (ou 56px absolutos)

## Fluxo do Google Fonts

1. Acesse fonts.google.com
2. Busque a fonte pelo nome (ex: "Alice")
3. Clique na fonte
4. "Get font" → "Get embed code"
5. Copie os `<link>` tags
6. Cole no `<head>` do HTML
7. Use o `font-family` indicado no CSS

Dica do instrutor: se tiver outras fontes selecionadas no Google Fonts de sessoes anteriores, remova todas e comece limpo para evitar carregar fontes desnecessarias.

## Commit atomico

O instrutor faz um commit especifico: "trabalhando as fontes". Isso segue o principio de commits atomicos — cada commit representa uma unidade logica de trabalho (neste caso, toda a configuracao de tipografia).