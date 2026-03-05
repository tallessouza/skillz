# Deep Explanation: Secao Pricing — HTML Semantico e CSS Responsivo

## Por que custom elements com hifen?

O instrutor (Mayk) explica que no HTML voce pode criar tags customizadas. A regra importante e: **o nome deve conter um hifen**. Exemplo: `<zin-pricing>` onde "zin" sao as iniciais do aplicativo.

Razoes tecnicas:
- Tags customizadas sem hifen podem colidir com tags futuras do HTML standard
- Todas as custom tags comecam com `display: inline` por padrao — voce muda depois
- A especificacao Web Components exige hifen para custom elements
- Nao substitua tags semanticas existentes (`<header>`, `<section>`, `<nav>`) por custom tags — use custom tags apenas quando nao existe tag semantica apropriada

O Mayk enfatiza: "voce nao troca tags ja semanticas criadas e usadas mundialmente pelo HTML, pelas tags que voce achar que quer criar da sua cabeca. Primariamente voce vai usar apenas as tags que tem semantica. Se nao tiver, ai voce pode se aventurar as vezes em criar uma ou outra."

## Hierarquia de headings — contexto, nao tamanho

O titulo da secao e `<h2>`. Dentro dos cards, o nome do plano usa `<h3>`. O instrutor explica: "nao e pelo tamanho que estao os elementos, mas pela leitura da ordem de prioridade."

Isso significa que a hierarquia de headings segue a estrutura do documento, nao o design visual. O CSS controla o tamanho; o HTML controla a semantica.

## role="list" — preservando semantica sem bullet points

Quando voce remove os bullet points de uma `<ul>` via CSS (`list-style: none`), alguns leitores de tela (especialmente VoiceOver no Safari) deixam de anunciar o elemento como lista. Ao adicionar `role="list"`, voce restaura essa semantica para acessibilidade.

O instrutor explica: "ele e um atributo que vai servir pra gente como: ele esta explicando qual que e o papel desse elemento em toda construcao. O papel desse elemento e uma lista."

## aria-label — o erro honesto

Durante a aula, o instrutor percebeu que havia escrito `arial-label` ao inves de `aria-label` em varios lugares da aplicacao. Usou o find-and-replace do editor para corrigir todos os lugares de uma vez.

Licao importante: **aria-label e o atributo correto** (de ARIA — Accessible Rich Internet Applications). E um erro de digitacao comum que silenciosamente quebra acessibilidade.

O botao `<a href="#download" aria-label="Baixar agora" class="btn btn-md"></a>` nao tem conteudo textual visivel — o aria-label e o que leitores de tela vao ler.

## CSS custom properties para responsividade

O preco muda de `2rem` no mobile para `2.5rem` no desktop. Ao inves de duplicar toda a regra do `zin-pricing` dentro da media query, o instrutor usa uma custom property `--font-size-price` que e redefinida no breakpoint.

Isso centraliza a mudanca em um unico lugar e mantem o seletor `zin-pricing` limpo.

## Radial gradient no separador

O separador entre o botao e a lista de features usa `radial-gradient` ao inves de um `border` simples. O efeito e: a linha comeca com a cor `--text-color-secondary` no centro e faz fade para `--surface-color` (cor de fundo) aos 70%. Isso cria um efeito elegante onde a linha parece desaparecer nas extremidades.

```css
background: radial-gradient(var(--text-color-secondary), var(--surface-color) 70%);
```

## Correcao do inset dos botoes

O instrutor notou que os botoes tinham bordas desiguais (maior em cima, menor embaixo ou vice-versa). Mudou o `inset` de `1.5px` para `1px` fixo para uniformizar a aparencia dos botoes em toda a aplicacao.

## Estrutura de nomeacao de secoes

O instrutor mantem consistencia entre IDs das secoes e links de navegacao: `pricing`, `download`, `about`, `features`. Cada secao usa o mesmo nome como ID para que a navegacao por ancora funcione corretamente.