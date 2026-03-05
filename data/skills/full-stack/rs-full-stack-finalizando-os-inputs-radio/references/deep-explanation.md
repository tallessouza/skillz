# Deep Explanation: Radio Inputs com Grid Responsivo

## Por que grid auto-fit e tao poderoso aqui

O instrutor demonstra ao vivo o comportamento do grid: conforme a tela aumenta, as colunas se redistribuem automaticamente. Com `repeat(auto-fit, minmax(7.5rem, 1fr))`, o navegador calcula quantas colunas de no minimo 7.5rem cabem no espaco disponivel. Se cabem 3, mostra 3. Se cabem 6, mostra 6. Sem media queries, sem JavaScript.

A frase-chave do instrutor: *"Ele ve que tem espaco para tres caras, o minimo nao e 7.5, nao chegou a 7.5rem de largura desse cara, entao ele encaixa ali, auto-fit, encaixa automaticamente o grid."*

Isso significa que ao adicionar ou remover opcoes de esporte, o layout se adapta sozinho. Nao precisa alterar CSS.

## O erro classico de copia

O instrutor comete um erro ao vivo que e extremamente comum: ao copiar um bloco de `radial-inner`, ele acidentalmente inclui uma `</div>` extra (a div pai). Isso quebra a estrutura do grid porque um elemento extra entra como filho direto do grid container, desalinhando tudo.

A licao: ao duplicar blocos repetitivos em HTML, sempre selecione **exatamente** o bloco que quer duplicar. Uma tag a mais ou a menos pode causar bugs visuais dificeis de diagnosticar.

## Estrutura semantica do grupo

A hierarquia e:
1. `input-wrapper` — container geral da pergunta
2. `label` sem `for` — texto da pergunta (nao clicavel em nenhum input)
3. `radial-wrapper` — grid container com todas as opcoes
4. `radial-inner` — card individual de cada opcao
5. Dentro do inner: imagem + input radio + label com `for`

O label do grupo (nivel 2) nao tem `for` porque ele descreve o grupo, nao uma opcao especifica. Ja os labels dentro de cada `radial-inner` (nivel 5) precisam do `for` apontando para o `id` do radio correspondente.

## name vs id em radio buttons

- `name="esporte"` — compartilhado por TODOS os radios do grupo. E o que o navegador usa para saber que sao mutuamente exclusivos. E tambem o nome do campo enviado no form.
- `id="futebol"` — unico por radio. Usado pelo `<label for="">` para criar a associacao clicavel.

Se voce errar o `name` (cada radio com name diferente), todos poderao ser selecionados simultaneamente, quebrando a logica de radio button.

## Nomes de arquivos de assets

O instrutor mostra que os nomes dos icones SVG nao seguem um padrao consistente (alguns com "02", "globe", etc.). Na pratica, ao trabalhar com assets de terceiros, sempre verifique o nome real do arquivo em vez de assumir um padrao. O instrutor usa tentativa e erro ao vivo para encontrar os nomes corretos.

## Comportamento responsivo observado

O instrutor demonstra redimensionando a janela:
- **Tela pequena:** 2 colunas (cada card tem pelo menos 7.5rem)
- **Tela media:** 3 colunas
- **Tela grande:** ate 6 colunas (todos os esportes em uma linha)

Tudo isso sem nenhuma media query — apenas a propriedade `auto-fit` do grid fazendo o trabalho.