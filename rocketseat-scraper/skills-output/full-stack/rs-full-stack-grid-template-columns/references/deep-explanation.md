# Deep Explanation: Grid Template Columns

## O que e grid-template-columns

`grid-template-columns` e uma propriedade do CSS Grid aplicada ao **container pai**. Ela define quantas colunas o grid tera e qual o tamanho de cada uma.

Ela faz parte do shorthand `grid-template`, que agrupa:
- `grid-template-columns`
- `grid-template-rows`
- `grid-template-areas`

## A unidade `fr` (fraction)

A analogia do instrutor e direta: **fraction = fracao**. O grid pega o espaco disponivel e divide em fracoes.

### Como o calculo funciona

1. O grid calcula o espaco total disponivel no container
2. Subtrai qualquer coluna com valor fixo (`px`, `%`, `vw`, `rem`)
3. O espaco restante e dividido proporcionalmente entre as colunas `fr`

Exemplo: container de 1200px com `200px 1fr 2fr`
- 200px sao reservados para a primeira coluna
- Sobram 1000px
- `1fr` = 1000 / 3 = ~333px
- `2fr` = 1000 * 2/3 = ~667px

### fr vs % — a diferenca critica

- `%` e calculado sobre o **tamanho total do container**, independente de outras colunas
- `fr` e calculado sobre o **espaco restante** apos todas as colunas fixas

Por isso, misturar `%` com outras unidades pode causar **overflow** (transbordar o container), como o instrutor demonstrou com `1fr 200px 50% 30vw` — a soma ultrapassou o container e criou scroll horizontal.

## A funcao repeat()

Sintaxe: `repeat(quantidade, tamanho)`

- Primeiro argumento: quantas vezes repetir
- Segundo argumento: o tamanho de cada repeticao

`repeat(3, 1fr)` e identico a `1fr 1fr 1fr`, mas mais legivel e menos propenso a erros.

### Cuidado com repeat() e itens insuficientes

Se voce define `repeat(6, 1fr)` mas so tem 4 itens, as 2 colunas restantes ficam vazias — o grid reserva o espaco. O instrutor demonstrou isso ao criar 6 colunas com apenas 3 divs: tres espacos ficaram vagos.

## Linhas automaticas (implicit rows)

O grid define colunas explicitamente com `grid-template-columns`, mas cria **linhas automaticamente** conforme necessario.

Exemplo com `repeat(3, 1fr)` e 4 itens:
- Itens 1, 2, 3 → primeira linha
- Item 4 → segunda linha, coluna 1

O item 4 "sobrou" das 3 colunas e foi para a proxima linha. Se houvesse itens 5 e 6, preencheriam colunas 2 e 3 da segunda linha.

## DevTools e visualizacao

O instrutor mostrou no Safari Developer Tools que o grid overlay exibe:
- As fatias (colunas) definidas
- As linhas do grid
- O tamanho de cada fracao

Chrome DevTools e Firefox DevTools tambem mostram essas informacoes ao inspecionar um grid container — procure o badge "grid" no painel Elements.

## Qualquer unidade funciona

O instrutor enfatizou que `grid-template-columns` aceita **qualquer unidade CSS**:
- `px` — pixels fixos
- `fr` — fracoes flexiveis
- `%` — porcentagem do container
- `vw` — viewport width
- `rem` — relativo ao font-size root
- Combinacoes de todas essas

A flexibilidade e total, mas a responsabilidade de evitar overflow tambem e sua.