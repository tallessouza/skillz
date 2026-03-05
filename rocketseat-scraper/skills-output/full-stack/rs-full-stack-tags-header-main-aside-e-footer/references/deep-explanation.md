# Deep Explanation: Tags header, main, aside e footer

## Por que tags semânticas existem

Antes do HTML5, toda estrutura de página era feita com `<div>`. O problema: um `<div class="header">` não tem significado para o navegador, leitores de tela ou motores de busca. É apenas uma caixa genérica.

As tags semânticas (`header`, `main`, `aside`, `footer`) resolvem isso dando **significado estrutural** ao conteúdo.

## O modelo mental do instrutor

O instrutor apresenta a página como uma composição de 4 blocos visuais:

1. **Header (topo)** — O cabeçalho. Fica "aqui em cima da página". É onde vai logo, navegação.
2. **Main (centro)** — O conteúdo principal. "Poderia ficar lá no canto, mas ele é relativo ao conteúdo principal daquela página." Dentro dele vão `<h1>`, `<p>`, e outras tags de conteúdo.
3. **Aside (lateral)** — Conteúdo secundário. Pode "estender informações do conteúdo principal" ou "ficar numa lateral mostrando mais ideias de conteúdos". É **opcional** — "de vez em quando ele pode aparecer ou não".
4. **Footer (base)** — O rodapé. "Informações extras do site", menus de navegação secundários.

### Insight importante do instrutor

> "Esses três são os principais estruturais: header, main, footer. Aside de vez em quando pode aparecer ou não."

Isso significa: **header + main + footer = esqueleto obrigatório**. Aside é um complemento quando faz sentido.

## Papel do aside

O aside tem dois usos principais segundo o instrutor:

1. **Estender informações do main** — como notas laterais, referências, contexto adicional
2. **Sugerir conteúdos relacionados** — como "artigos relacionados", "você também pode gostar"

Ele NÃO é apenas uma "sidebar visual". É semanticamente um conteúdo que **referencia ou complementa** o conteúdo principal.

## Acessibilidade

Leitores de tela usam essas tags como landmarks (pontos de referência):
- `<header>` → role="banner"
- `<main>` → role="main"
- `<aside>` → role="complementary"
- `<footer>` → role="contentinfo"

Usuários podem navegar diretamente entre esses marcos, pulando conteúdo irrelevante.

## SEO

Motores de busca priorizam o conteúdo dentro de `<main>` como o conteúdo relevante da página. Usar `<div>` para tudo força o crawler a adivinhar o que é principal e o que é acessório.

## Regra do main único

Só pode existir UM `<main>` por página. Isso faz sentido: cada página tem apenas um propósito principal. Se você precisa de múltiplas seções dentro do main, use `<section>` ou `<article>` dentro dele.