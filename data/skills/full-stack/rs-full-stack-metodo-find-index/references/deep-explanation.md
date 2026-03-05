# Deep Explanation: findIndex()

## Diferença fundamental: findIndex vs find

O instrutor enfatiza que a diferença central é **o que retorna**:
- `find()` → retorna o **conteúdo** (o elemento)
- `findIndex()` → retorna o **índice** (a posição numérica)

Essa distinção é a fonte mais comum de bugs: o desenvolvedor usa findIndex esperando receber o objeto, e recebe um número.

## Por que -1 e não undefined?

O findIndex retorna `-1` (não `undefined` ou `null`) quando não encontra, seguindo a convenção de C/Java onde -1 indica "posição inválida". Isso é importante porque:

- `0` é um índice válido (primeiro elemento)
- `undefined` poderia ser confundido com outros erros
- `-1` é uma convenção universal em programação para "não encontrado"

**Armadilha:** Como JavaScript é truthy/falsy, `if (index)` falha quando o índice encontrado é `0`, porque `0` é falsy. Sempre use comparação explícita: `index !== -1`.

## O padrão callback

O instrutor destaca que findIndex segue o mesmo padrão de callback que `map`, `filter`, `find` e outros métodos de array. A função de callback:
1. Recebe cada item do array sequencialmente
2. Executa a condição definida
3. Retorna `true` ou `false`
4. O findIndex para no **primeiro** `true`

## Comportamento de "primeiro match"

O findIndex sempre retorna o índice do **primeiro** elemento que satisfaz. No exemplo do instrutor:
- Array: `[4, 6, 8, 12]`
- Condição: `value > 4`
- 4 não é maior que 4 (é igual) → pula
- 6 é maior que 4 → retorna índice 1
- 8 e 12 nem são avaliados

Isso é relevante para performance: em arrays grandes, findIndex é eficiente porque para no primeiro match.

## Padrão composto: findIndex + acesso por índice

O instrutor demonstra um padrão útil: usar findIndex para obter a posição, depois acessar o array com esse índice:

```javascript
const index = values.findIndex(value => value > 4)
const element = values[index] // acessa o elemento pela posição
```

Esse padrão é útil quando você precisa tanto da posição quanto do valor — por exemplo, para remover ou substituir o elemento no array.

## Quando NÃO usar findIndex

- Se você só precisa do valor → `find()`
- Se precisa de todos os matches → `filter()`
- Se só precisa saber se existe → `some()`
- Se precisa do índice de um valor conhecido → `indexOf()`

O findIndex é especificamente para: "em que posição está o primeiro elemento que satisfaz uma condição complexa?"