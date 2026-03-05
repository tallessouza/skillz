# Deep Explanation: Array.includes()

## Por que includes() existe

Antes do ES2016, a única forma de verificar existência era `indexOf() !== -1`. Isso era:
- **Pouco expressivo** — a intenção ("existe?") ficava escondida atrás de uma comparação numérica
- **Propenso a bugs** — `> 0` ao invés de `>= 0` ignora o índice 0
- **Semanticamente errado** — indexOf retorna posição, não existência

`includes()` resolve tudo isso retornando diretamente `true` ou `false`.

## Case-sensitivity — o detalhe que pega

O instrutor demonstra diretamente:
```javascript
const fruits = ["apple", "orange", "banana"]
fruits.includes("apple")  // true
fruits.includes("Apple")  // false — A maiúsculo!
```

JavaScript compara strings caractere por caractere. `"A" !== "a"`. Isso é especialmente perigoso quando:
- Dados vêm de input do usuário (pode digitar qualquer case)
- Dados vêm de APIs externas (sem garantia de formato)
- Dados foram normalizados em algum lugar mas não em outro

### Solução para case-insensitive

```javascript
const normalizedFruits = fruits.map(f => f.toLowerCase())
normalizedFruits.includes(userInput.toLowerCase())
```

## includes() vs outros métodos

| Método | Retorna | Usa quando |
|--------|---------|-----------|
| `includes(value)` | `boolean` | Só quer saber se existe |
| `indexOf(value)` | `number` (-1 se não achou) | Precisa da posição |
| `find(predicate)` | `element \| undefined` | Busca por condição complexa (objetos) |
| `some(predicate)` | `boolean` | Verificação com condição complexa |
| `filter(predicate)` | `array` | Quer todos que batem |

## Limitação importante: objetos

`includes()` usa comparação por referência para objetos:

```javascript
const users = [{ name: "Ana" }, { name: "Bob" }]
users.includes({ name: "Ana" }) // false! Objeto diferente na memória
```

Para objetos, use `some()`:
```javascript
users.some(user => user.name === "Ana") // true
```

## NaN — o edge case onde includes() brilha

```javascript
[1, 2, NaN].includes(NaN)    // true ✓
[1, 2, NaN].indexOf(NaN)     // -1  ✗ (indexOf usa ===, e NaN !== NaN)
```