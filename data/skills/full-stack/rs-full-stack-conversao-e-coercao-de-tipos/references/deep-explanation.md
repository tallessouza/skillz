# Deep Explanation: Conversão e Coerção de Tipos

## Dois conceitos distintos

O instrutor faz questão de separar claramente:

1. **Conversão de tipos (type conversion / typecasting):** Você, de forma **consciente e intencional**, transforma um valor de um tipo para outro. Usa funções como `Number()`, `String()`, `Boolean()`, `.toString()`.

2. **Coerção de tipos (type coercion):** O **JavaScript automaticamente** tenta converter valores para um tipo compatível antes de realizar uma operação. Isso acontece **implicitamente**, sem você pedir.

## Por que isso importa

A coerção é uma das maiores fontes de bugs em JavaScript. O exemplo clássico do instrutor:

```javascript
console.log("10" + 5)  // "105" — não 15!
```

O que aconteceu: o `+` encontrou uma string à esquerda e um número à direita. O JS decidiu converter o 5 para string e concatenar, resultando em `"105"`. Você pode verificar com `typeof("10" + 5)` que o resultado é `"string"`.

## Regras de Boolean conversion

O instrutor demonstrou um padrão importante com `Boolean()`:

| Valor | Boolean() | Explicação |
|-------|-----------|------------|
| `1` | `true` | Qualquer número diferente de zero |
| `0` | `false` | Zero é o único número falsy |
| `55` | `true` | Positivos são truthy |
| `-25` | `true` | Negativos também são truthy |

**Insight do instrutor:** "O 0 ele considera como falso, e outro número, inclusive negativo, ele vai considerar como verdadeiro."

Isso é contra-intuitivo para iniciantes que podem pensar que negativos seriam falsy.

## O operador `+` é especial

Entre os operadores matemáticos, o `+` é o único que tem comportamento dual:
- Com dois números: soma
- Com pelo menos uma string: concatenação

Os outros operadores (`-`, `*`, `/`) sempre tentam converter para número:

```javascript
"10" - 5   // 5 (número)
"10" * 2   // 20 (número)
"10" / 2   // 5 (número)
"10" + 5   // "105" (string!) — exceção
```

## typeof como ferramenta de investigação

O instrutor usa `typeof` como ferramenta didática para "provar" o tipo de um valor. Essa é uma boa prática em debugging:

```javascript
let value = "9"
console.log(typeof value)           // "string"
console.log(typeof Number(value))   // "number"
```

## Conversores nativos do JavaScript

### Number()
- Converte string numérica para número
- `Number("9")` → `9`
- `Number("abc")` → `NaN`

### String() e .toString()
- Ambos convertem para string
- `String(18)` → `"18"`
- `(18).toString()` → `"18"`
- O instrutor menciona que `.toString()` é um **método** — conceito que será aprofundado em aulas futuras

### Boolean()
- Converte para booleano
- Valores falsy: `0`, `""`, `null`, `undefined`, `NaN`, `false`
- Todo o resto é truthy