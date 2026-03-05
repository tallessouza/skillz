# Deep Explanation: Estrutura Semantica de Paginas HTML

## O raciocinio do instrutor

O instrutor usa uma abordagem visual: "imagina comigo que isso daqui e uma pagina web". Ele desenha mentalmente uma pagina e vai mapeando cada regiao a um elemento semantico:

- **Parte superior** → `<header>` — onde ficam logo e navegacao
- **Navegacao** → `<nav>` — o "navigation ou nave de navegacao"
- **Meio** → conteudo principal com `<section>` — "informacoes principais da nossa pagina"
- **Lateral** → `<aside>` — "algumas coisinhas extras"
- **Rodape** → `<footer>` — parte inferior

## Por que semantica importa

A frase-chave do instrutor: "todos eles tem uma semantica, tem um motivo". Isso significa:

1. **Acessibilidade** — leitores de tela usam as tags semanticas para navegar. Um `<nav>` permite que usuarios de screen reader pulem direto para a navegacao.
2. **SEO** — motores de busca entendem a estrutura da pagina atraves das tags semanticas.
3. **Manutencao** — codigo com `<header>`, `<main>`, `<footer>` e auto-explicativo. Codigo com `<div class="header">` exige leitura do CSS para entender.

## Analogia: planta de uma casa

Assim como uma planta arquitetonica tem sala, cozinha, quarto — cada um com proposito claro — uma pagina HTML tem header, main, aside, footer. Voce nao coloca o fogao no quarto. Da mesma forma, nao coloque navegacao no footer.

## Hierarquia de conteudo dentro das secoes

O instrutor menciona `h1`, `p`, `h2`, `p` como exemplos de conteudo dentro das secoes. Isso reforça:

- Cada `<section>` deve ter seu proprio heading (`h2`, `h3`, etc.)
- O `<h1>` e unico por pagina e fica no conteudo principal
- Paragrafos (`<p>`) acompanham os headings para dar contexto

## Quando usar `<section>` vs `<article>` vs `<div>`

- `<section>` — agrupamento tematico de conteudo (o instrutor usa este)
- `<article>` — conteudo autonomo que faz sentido sozinho (blog post, noticia)
- `<div>` — ultimo recurso, quando nenhum elemento semantico se aplica

## Edge cases

- **Multiplos `<nav>`** — pode ter mais de um (ex: nav principal no header, nav secundario no footer)
- **`<header>` dentro de `<article>`** — valido, representa o cabecalho daquele artigo especifico
- **`<footer>` dentro de `<section>`** — valido, representa o rodape daquela secao