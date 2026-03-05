# Deep Explanation: Método some()

## O que é

O `some()` é um método de arrays que **testa se pelo menos um elemento** passa na condição definida por uma função de callback. Retorna um valor booleano: `true` ou `false`.

## Modelo mental

Pense no `some()` como uma pergunta de "sim ou não" para o array:
- "Tem alguém menor de 18?" → `ages.some(age => age < 18)`
- Se **pelo menos um** atende → `true`
- Se **nenhum** atende → `false`

É como passar por uma fila de pessoas e perguntar: "Alguém aqui é menor de idade?" — no momento que encontra o primeiro, já pode responder "sim" sem precisar perguntar para todos.

## Short-circuit (otimização automática)

O `some()` para de iterar assim que encontra o primeiro `true`. Isso significa que em um array de 10.000 elementos, se o primeiro já atende, só uma iteração acontece. Por isso é sempre melhor que `filter().length > 0`, que percorre o array inteiro.

## Comportamento detalhado

```javascript
const ages = [15, 30, 39, 29]

// Com 15 no array:
ages.some(age => age < 18) // true (15 < 18, para aqui)

// Se trocar 15 por 19:
const ages2 = [19, 30, 39, 29]
ages2.some(age => age < 18) // false (nenhum atende)
```

## Regras de retorno

| Cenário | Retorno |
|---------|---------|
| Pelo menos um elemento atende | `true` |
| Nenhum elemento atende | `false` |
| Array vazio | `false` (não há elementos para atender) |

## Diferença entre some() e every()

| Método | Pergunta | true quando |
|--------|----------|-------------|
| `some()` | "Algum atende?" | Pelo menos um atende |
| `every()` | "Todos atendem?" | Todos atendem |

São complementares. O instrutor destaca que o `some()` retorna `true` se "pelo menos um atender a condição" — essa é a distinção fundamental.

## Edge cases

- **Array vazio:** `[].some(fn)` retorna `false` — não há elemento para satisfazer a condição
- **Todos atendem:** retorna `true` (basta um, e todos são "pelo menos um")
- **Callback com side effects:** evite — `some()` é para verificação, não para executar ações