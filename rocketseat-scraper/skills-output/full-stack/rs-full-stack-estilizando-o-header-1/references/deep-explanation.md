# Deep Explanation: Estilizando o Header

## Por que separar CSS em arquivos por seção?

O instrutor cria `header.css` e importa com `@import url("header.css")` no `index.css`. A razão é foco: ao trabalhar no header, você abre apenas `header.css` e não precisa scrollar um arquivo monolítico. Cada seção da página (header, main, footer) tem seu próprio arquivo.

## Composição com Flexbox — a filosofia

O padrão que emerge nesta aula é: **tudo é flex**. O instrutor aplica `display: flex` em múltiplos níveis:

1. **`.profile`** — flex horizontal (avatar + texto lado a lado)
2. **`.container`** — flex horizontal (profile + info lado a lado)
3. **`.info` (ul)** — flex vertical (column) para empilhar li's
4. **`.info li`** — flex horizontal (ícone + texto)

Cada nível usa `gap` para espaçamento. Isso elimina completamente a necessidade de margins entre irmãos.

## Gap vs Margin — por que gap vence

- `gap` só aplica entre irmãos, nunca antes do primeiro ou depois do último
- `margin` precisa de `:first-child` / `:last-child` para evitar espaço extra
- `gap` funciona em ambas direções (row e column) automaticamente

## A técnica do `max-width` no container de texto

O instrutor aplica `max-width: 384px` especificamente no `div` dentro do profile (`.profile > div`), não no profile inteiro. Isso permite que o profile ocupe o espaço necessário enquanto o bloco de texto tem um limite de leitura confortável.

## Herança de font — aplicar no pai

Insight importante do final da aula: o instrutor inicialmente aplicou `font: var(--text-md)` em cada `p` individualmente, mas depois percebeu que todos os textos do header usavam o mesmo tamanho. A solução foi mover a declaração para o `header` e deixar a cascata CSS fazer o trabalho. Apenas o `h1` recebe `font: var(--text-lg)` diferente porque é a exceção.

## Active Recall — técnica de estudo mencionada

O instrutor menciona que tenta lembrar os valores das variáveis CSS de cabeça antes de conferir no Figma. Ele chama isso de "Active Recall" — uma técnica de estudo onde você tenta ativamente recuperar informação da memória antes de consultar a fonte. Aplique isso: tente escrever o CSS de cabeça e depois confira.

## O erro intencional — text-md line-height

O instrutor descobriu durante a aula que o valor de `line-height` no `--text-md` estava 175% quando deveria ser 170% (conforme o Figma mostrava). Ele corrigiu ao vivo. A lição: sempre confira valores com a fonte de verdade (Figma), especialmente line-height que é sutil visualmente.

## Alinhamento: quando usar e quando não usar `align-items: center`

- No `.profile`: usa `align-items: center` para centralizar avatar e texto verticalmente — decisão estética do instrutor ("eu acho mais bonito assim")
- Mas depois percebeu que no design original o profile NÃO tem alinhamento central com o container — está no topo. Nem sempre centralizar é a resposta certa.

## O `<br>` no HTML

No final, o instrutor nota que existe um `<br>` no texto do parágrafo para quebrar a linha em um ponto específico. Isso é uma decisão de design, não de CSS.