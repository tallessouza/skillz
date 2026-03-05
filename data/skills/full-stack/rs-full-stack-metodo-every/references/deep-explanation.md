# Deep Explanation: Método every()

## O que o every() realmente faz

O `every()` percorre cada elemento do array executando a função de callback. No momento em que **um único elemento** retorna `false`, ele para imediatamente (short-circuit) e retorna `false`. Só retorna `true` se TODOS passarem.

### Analogia do instrutor

O instrutor usa o exemplo de uma lista de pessoas querendo tirar habilitação. A pergunta é: "Todas as idades são >= 18?" Se **uma única pessoa** tem 15 anos, a resposta é `false` — não importa que as outras 3 tenham 30, 39, 29.

Isso ilustra o comportamento fundamental: `every()` é uma validação "AND" — todos precisam passar.

## Anatomia da chamada

```javascript
const ages = [30, 39, 29, 15]
const result = ages.every(age => age >= 18)
```

O que acontece internamente:
1. `age = 30` → `30 >= 18` → `true` ✓ continua
2. `age = 39` → `39 >= 18` → `true` ✓ continua
3. `age = 29` → `29 >= 18` → `true` ✓ continua
4. `age = 15` → `15 >= 18` → `false` ✗ PARA e retorna `false`

Se trocar o 15 por 18:
1-4: todos `true` → retorna `true`

## Short-circuit (performance)

O `every()` não precisa percorrer o array inteiro. No momento que encontra um `false`, para. Isso significa que para arrays grandes onde a falha é provável no início, `every()` é eficiente.

## Vacuous truth (array vazio)

```javascript
[].every(x => x > 100) // true!
```

Isso é vacuous truth — "todos os elementos de um conjunto vazio satisfazem qualquer condição" é logicamente verdadeiro. Na prática, isso pode causar bugs se você não validar que o array tem elementos.

## Callback completo

O callback do `every()` recebe 3 argumentos (mesmo que normalmente só usamos o primeiro):

```javascript
array.every((element, index, array) => {
  // element: o item atual
  // index: posição no array
  // array: o array original
  return condição
})
```

## every() vs for loop

O `every()` substitui o padrão imperativo:

```javascript
// Imperativo (evitar)
let allAdults = true
for (let i = 0; i < ages.length; i++) {
  if (ages[i] < 18) {
    allAdults = false
    break
  }
}

// Declarativo (preferir)
const allAdults = ages.every(age => age >= 18)
```

O declarativo é mais legível e menos propenso a erros (esquecer o `break`, por exemplo).

## every() vs some()

| Método | Pergunta | Retorna true quando |
|--------|----------|-------------------|
| `every()` | "Todos passam?" | Nenhum falha |
| `some()` | "Algum passa?" | Pelo menos um passa |

São complementares: `!arr.every(fn)` equivale a `arr.some(x => !fn(x))`.