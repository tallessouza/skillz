# Deep Explanation: Classes Utilitárias Responsivas

## Por que mobile-first?

O instrutor enfatiza que **tudo é feito primeiro para mobile**. A estratégia mobile-first significa que o CSS base (sem media query) representa o layout mobile. Media queries com `min-width` adicionam complexidade progressivamente para telas maiores.

Isso é importante porque:
- Mobile é o caso mais simples (uma coluna, menos espaço)
- CSS sem media query é o fallback natural
- Dispositivos móveis carregam menos CSS (só o base)

## O insight do `display: initial`

Um dos pontos mais importantes da aula: quando você usa `.desktop-only` para esconder/mostrar elementos, **não use `display: block`** na media query desktop. Use `display: initial`.

Por quê? Porque se você aplicar `.desktop-only` em um `<span>`, o display padrão do span é `inline`, não `block`. Se você forçar `block`, quebra o comportamento esperado. O `initial` restaura o valor padrão daquela tag específica:
- `<div>` → `initial` = `block`
- `<span>` → `initial` = `inline`
- `<img>` → `initial` = `inline`

## Estratégia de planejamento prévio

O instrutor faz questão de explicar que **planeja as utility classes antes de montar o HTML**. Ele analisa o design inteiro, identifica:
1. Quais valores de padding existem (24px, 40px, 48px, 80px)
2. Quais elementos mudam de tamanho entre breakpoints
3. Quais elementos aparecem/desaparecem

Depois cria todas as variáveis e classes. Só então começa a montar o HTML.

Citação do instrutor: *"Na sua carreira, você vai ter várias maneiras de produzir os seus projetos. Uma delas é ir pensando com antecedência."*

Ele reconhece que a abordagem por componente (fazer parte por parte) também funciona, mas prefere o planejamento prévio porque acelera a montagem posterior.

## `padding-block` vs `padding-inline` (CSS Logical Properties)

O instrutor comete um erro ao vivo e corrige: inicialmente tenta usar `padding-block` para horizontal, mas percebe que:
- `padding-block` = eixo vertical (Y) = cima e baixo
- `padding-inline` = eixo horizontal (X) = esquerda e direita

A convenção de nomes `py-` e `px-` mapeia para:
- `py-` → `padding-block` (Y axis)
- `px-` → `padding-inline` (X axis)

## Even Columns — por que Grid e não Flex?

O instrutor usa Grid com `grid-auto-flow: column` e `grid-auto-columns: 1fr` porque:
- `1fr` garante que cada coluna tem **exatamente** a mesma largura
- Funciona com qualquer número de filhos (2, 3, 4, 5...)
- No mobile (sem a regra), os itens ficam um abaixo do outro naturalmente (grid sem auto-flow = linhas)

O instrutor menciona: *"Quando eu aprendi a fazer isso eu pirei"* — mostrando que é um padrão poderoso mas não óbvio.

Ele também diz que Flex funcionaria (*"se você quiser fazer com o Flex, fique à vontade"*), mas a abordagem Grid com `1fr` é mais elegante para colunas verdadeiramente iguais.

## Escala de valores usada

| Variável | Mobile | Desktop | Pixels (desktop) |
|----------|--------|---------|-------------------|
| `--py-base` | 1rem | 1.5rem | 24px |
| `--py-lg` | 1.5rem | 2.5rem | 40px |
| `--py-xl` | 3rem | 5rem | 80px |

Esses valores foram extraídos diretamente do design (Figma), onde o instrutor identificou os padrões: 24px, 48px e 80px de padding vertical aparecendo repetidamente.