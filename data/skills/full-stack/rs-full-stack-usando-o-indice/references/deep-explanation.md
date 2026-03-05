# Deep Explanation: indexOf e splice

## Por que indexOf retorna -1?

O `-1` e uma convencao historica do JavaScript (herdada do C) para indicar "nao encontrado". Como indices validos comecam em `0`, qualquer numero negativo serve como sentinel value. O problema e que `-1` em splice e interpretado como "ultimo elemento" (indices negativos contam do final), o que causa um dos bugs mais comuns em manipulacao de arrays.

## O bug silencioso do splice com -1

O instrutor nao menciona explicitamente, mas este e o edge case mais perigoso:

```javascript
const fruits = ["apple", "banana", "cherry"]
const pos = fruits.indexOf("mango") // -1
fruits.splice(pos, 1) // splice(-1, 1) remove "cherry"!
```

Isso acontece porque `splice` aceita indices negativos como "contar do final". Entao `splice(-1, 1)` significa "remova 1 item a partir do ultimo". Este e o motivo pelo qual a validacao `if (pos !== -1)` e obrigatoria.

## Como o splice funciona internamente

`splice(start, deleteCount)` faz tres coisas:
1. Identifica a posicao `start` no array
2. Remove `deleteCount` elementos a partir daquela posicao
3. Desloca todos os elementos seguintes para preencher o espaco

O array e modificado in-place e os itens removidos sao retornados como um novo array.

### Parametros do splice explicados pelo instrutor

O instrutor demonstra claramente a confusao comum: o segundo parametro NAO e o indice final, e sim a QUANTIDADE de itens a remover.

Exemplo do instrutor:
```javascript
const fruits = ["apple", "watermelon", "lemon", "strawberry"]

// splice(1, 3) — a partir do indice 1, remove 3 itens
fruits.splice(1, 3)
// Resultado: ["apple"]
// Removeu: watermelon, lemon, strawberry

// splice(1, 2) — a partir do indice 1, remove 2 itens
fruits.splice(1, 2)
// Resultado: ["apple", "strawberry"]
// Removeu: watermelon, lemon
```

## indexOf vs includes

- `indexOf` retorna a posicao (ou -1) — use quando precisa da posicao
- `includes` retorna boolean — use quando so precisa saber se existe

## indexOf so encontra a primeira ocorrencia

Se o array tem elementos duplicados, `indexOf` retorna apenas o indice da primeira ocorrencia. Para encontrar todas, use um loop ou `reduce`.

## Metodos complementares mencionados na aula

O instrutor referencia `pop()` (remove do final) e `shift()` (remove do inicio) como alternativas quando a posicao e conhecida (primeiro ou ultimo). O `splice` e necessario quando o item esta em qualquer posicao intermediaria.