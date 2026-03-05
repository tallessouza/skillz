# Deep Explanation: Alinhamento de Items no CSS Grid

## O conceito fundamental: stretch como padrao

Quando voce declara `display: grid`, todos os items filhos recebem implicitamente `align-items: stretch` e `justify-items: stretch`. Isso significa que:

- A **altura** do item nao e mais automatica (como seria num `display: block` normal) — ela e definida pela track row
- A **largura** do item nao e mais automatica — ela e definida pela track column

Esse comportamento e o que faz os items "preencherem" toda a celula. Quando voce muda de `stretch` para qualquer outro valor (`start`, `center`, `end`), a dimensao correspondente volta a ser automatica (baseada no conteudo).

## A regra mnemonica dos eixos

O instrutor enfatiza repetir ate internalizar:

- **Align = eixo Y = vertical.** Repita tres vezes.
- **Justify = eixo X = horizontal.** Repita tres vezes.

Isso vale para TODAS as propriedades CSS Grid e Flexbox:
- `align-items`, `align-content`, `align-self` → Y
- `justify-items`, `justify-content`, `justify-self` → X

## Diferenca critica: items vs content

Essa e a confusao mais comum:

| Propriedade | O que controla | Onde atua |
|-------------|---------------|-----------|
| `align-items` / `justify-items` | Posicao do **item dentro da celula** | Cada celula individualmente |
| `align-content` / `justify-content` | Posicao das **tracks dentro do container** | O container como um todo |

**Items** nunca aceita `space-between`, `space-around`, `space-evenly` — porque dentro de uma celula so existe UM elemento. Nao ha o que distribuir.

**Content** aceita esses valores porque ha multiplas tracks para distribuir no espaco do container.

## Valores disponiveis e quando usar

### start
Remove o stretch e posiciona o item no inicio do eixo. Para `align-items: start`, o item vai para o topo da celula. Para `justify-items: start`, vai para a esquerda.

### center
Centraliza o item no eixo correspondente. O uso mais comum segundo o instrutor.

### end
Posiciona no final do eixo. `align-items: end` = fundo da celula. `justify-items: end` = direita da celula.

### baseline
Alinha pela linha base do texto. Raramente usado na pratica. Util apenas quando items tem tamanhos de fonte diferentes e voce quer alinhar pela baseline tipografica.

### stretch (padrao)
Estica o item para preencher toda a celula. E o comportamento padrao — so precisa declarar explicitamente se voce mudou antes e quer voltar.

## Quando items alignment faz sentido visual

O instrutor demonstra um ponto importante: items alignment e mais visivel quando:

1. **Colunas/rows tem tamanho fixo** (ex: `200px`) — ha espaco sobrando na celula
2. **O container e maior que o conteudo** — voce "vê" o item se movendo dentro da celula

Quando voce usa `1fr` em colunas flexiveis, o stretch geralmente ja faz o que voce quer. O alignment de items se torna mais relevante quando o grid tem dimensoes definidas maiores que o conteudo.

## place-items: o shorthand

`place-items` aceita um ou dois valores:
- `place-items: center` → equivale a `align-items: center; justify-items: center`
- `place-items: center start` → equivale a `align-items: center; justify-items: start`

A ordem e sempre **align primeiro, justify depois** (Y antes de X).

## Filosofia do instrutor sobre propriedades CSS

> "Existem muitos valores, muitas propriedades, mas a gente tem que trabalhar com aquelas que fazem mais sentido no dia a dia. Nao adianta querer tentar dominar tudo, porque e um estudo que nao tem fim."

Na pratica, os valores que voce realmente vai usar:
- `stretch` (padrao, nem precisa declarar)
- `center` (o mais usado)
- `start` e `end` (ocasionalmente)
- `place-items: center` (atalho mais util)