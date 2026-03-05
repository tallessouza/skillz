# Deep Explanation: Leitores de Tela

## O que são leitores de tela

Leitores de tela são ferramentas assistivas que leem o conteúdo da tela usando voz sintética para anunciar o que está visível. Eles não "veem" a interface — interpretam a árvore de acessibilidade do DOM, que é construída a partir dos atributos HTML semânticos.

## Como o leitor interpreta atributos

### `alt` em imagens
Quando o leitor encontra uma `<img>`, ele anuncia o conteúdo do `alt`. Se não há `alt`, o comportamento varia: alguns leitores tentam ler o nome do arquivo (pior cenário), outros ignoram. Uma `alt=""` (string vazia) instrui o leitor a ignorar a imagem completamente — diferente de omitir o `alt`.

### `aria-label` em elementos interativos
O `aria-label` sobrescreve completamente o conteúdo textual interno para o leitor de tela. Se um link tem `aria-label="GitHub"` mas contém o texto "GH" visualmente, o leitor anuncia "GitHub". Isso é poderoso mas perigoso: se o label não reflete o que o usuário vê, cria desconexão.

### `aria-hidden="true"`
Remove completamente o elemento da árvore de acessibilidade. O leitor age como se o elemento não existisse. Útil para conteúdo decorativo que geraria ruído.

O instrutor demonstrou um caso real: no site Rocketseat Help Center, textos como "e-explorer", "r-rocketseat", "d-discover" eram lidos caractere por caractere pelo leitor. Esses prefixos simbólicos são puramente visuais/decorativos. A solução é `aria-hidden="true"` nos prefixos OU `aria-label` no container.

## O problema da redundância

Um insight importante da aula: o leitor de tela ajuda a identificar redundâncias que não são óbvias visualmente. Se uma imagem tem `alt="GitHub"` e o link que a contém tem `aria-label="GitHub"`, o leitor pode anunciar "GitHub" duas vezes. Você só percebe isso ao testar com o leitor.

## Contexto semântico anunciado pelo leitor

O leitor não anuncia apenas o conteúdo — ele anuncia o contexto. Por exemplo, ao focar um link dentro de `<nav>`, o ChromeVox anuncia:
- O conteúdo do link ("GitHub")
- Que é um link
- Que está dentro de `navigation`

Isso reforça por que HTML semântico importa: `<nav>`, `<main>`, `<header>` fornecem contexto de navegação que o leitor usa.

## ChromeVox como ferramenta de teste

O instrutor recomenda o ChromeVox por ser:
- Extensão gratuita do Chrome
- Suporte a português do Brasil
- Fácil de instalar

Limitação mencionada: em algumas máquinas, o ChromeVox não desabilita corretamente com o atalho Shift+Alt+AA. Solução prática: remover a extensão quando não estiver testando.

Atalho útil: `Ctrl` interrompe a fala do ChromeVox.

## Quando problemas só aparecem com leitor de tela

O caso do Help Center da Rocketseat é emblemático: visualmente, "e-explorer" parece um prefixo estilizado. Ninguém perceberia o problema sem ouvir o leitor de tela soletrando "e-explorer" caractere por caractere. Essa é a razão principal para testar com leitores: problemas de acessibilidade frequentemente são invisíveis para quem enxerga.