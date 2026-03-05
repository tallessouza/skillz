# Deep Explanation: Custom Checkbox com CSS Puro

## Por que nao usar `display: none` no input?

O instrutor usa `all: unset` em vez de esconder o input. A razao e que `display: none` remove o elemento da arvore de acessibilidade — leitores de tela nao conseguem interagir com ele, e o tab do teclado pula o elemento. Com `unset`, o input continua funcional (recebe foco, aceita clique, aceita espaco), apenas perde a aparencia visual.

## A tecnica do `inset: 0`

`inset: 0` e shorthand para `top: 0; right: 0; bottom: 0; left: 0`. Combinado com `position: absolute`, o input invisivel cobre toda a area do `CheckBoxWrapper`. Isso significa que clicar em qualquer lugar do wrapper ativa o checkbox — nao apenas no pequeno quadrado.

## Por que um div vazio para a imagem?

O `CheckBoxImg` e um div vazio que recebe `background-image`. A razao e que seletores CSS como `:hover` e `:checked` se aplicam ao input, nao a uma tag `<img>`. Usando background-image em um div irmao, a gente pode usar seletores combinados (`.CheckBoxWrapper:has(:checked) .CheckBoxImg`) para trocar a imagem.

## O problema do `align-items: stretch`

O instrutor explica que o padrao do flexbox e `align-items: stretch`, que faz todos os filhos terem a mesma altura do container. Para um checkbox, isso cria um elemento visual gigante e distorcido. Usando `flex-start`, cada elemento mantem sua altura natural.

## A sacada do `flex: 0 0 1.5rem`

Sem controlar o flex, o checkbox image pode crescer (`flex-grow`) ou encolher (`flex-shrink`) dependendo do espaco disponivel. O shorthand `flex: 0 0 1.5rem` significa:
- `flex-grow: 0` — nao cresce
- `flex-shrink: 0` — nao encolhe
- `flex-basis: 1.5rem` — tamanho fixo de 1.5rem

## `:focus-within` para acessibilidade

O seletor `:focus-within` no wrapper detecta quando QUALQUER filho recebe foco. Como o input esta com `all: unset` mas ainda recebe foco via tab, o wrapper consegue reagir e mostrar o estado hover/focus no checkbox visual. Isso garante que usuarios de teclado vejam feedback visual ao navegar.

## A correcao de typo em tempo real

O instrutor cometeu um erro de digitacao em `stroke-highlight` (escreveu errado em multiplos arquivos). Ele demonstrou como usar o Search & Replace do VS Code para corrigir todas as ocorrencias de uma vez:
1. Abrir busca global (Ctrl+Shift+H)
2. Digitar o texto errado no campo de busca
3. Digitar o texto correto no campo de substituicao
4. Clicar em "Replace All" para corrigir todos de uma vez

Insight do instrutor: *"Eu prefiro deixar a vida real para voces. Faz parte."* — erros acontecem, o importante e saber corrigir eficientemente.

## Organizacao de arquivos CSS

O instrutor cria um arquivo separado `checkbox.css` para os estilos do checkbox customizado e importa no `index.html`. Isso segue o padrao de separar estilos por componente, facilitando manutencao.

## Export de SVGs do Figma

O fluxo demonstrado:
1. Selecionar o icone no Figma
2. Botao direito → "Copy as SVG"
3. Criar arquivo em `assets/icons/` com nome descritivo:
   - `checkbox-default.svg` — estado padrao
   - `checkbox-hover.svg` — estado hover
   - `checkbox-checked.svg` — estado marcado
4. Colar o SVG copiado

A convencao de nomes (`default`, `hover`, `checked`) facilita identificar qual estado cada arquivo representa.

## Sobre o Strong vs Link

O instrutor coloca `<strong>` nos termos "termos e condições" e "política de privacidade", mas avisa que em um site real deveria ser um link `<a>`:

*"O certo disso aqui é você fazer um link, né? Quando você for fazer isso em um site mesmo, você não vai deixar apenas o Strong, você vai querer que a pessoa clique para ver se de fato, porque ela está declarando que leu termos e condições e política de privacidade."*