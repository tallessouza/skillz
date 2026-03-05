# Deep Explanation: Operadores de Comparação (Maior, Menor e Igual)

## O insight central do instrutor

O ponto mais importante da aula não são os operadores em si — é o **cenário do saldo exato**. O instrutor constrói deliberadamente um caso onde `balance = 120` e `payment = 120`, mostrando que `>` retorna `false` mesmo quando o usuário TEM saldo suficiente.

Esse é um bug real que acontece em produção. A escolha entre `>` e `>=` não é acadêmica — ela define se um usuário com saldo exato consegue ou não pagar sua conta.

## Os quatro operadores

| Operador | Nome | Inclui igualdade? |
|----------|------|-------------------|
| `>` | Maior que | Não |
| `>=` | Maior ou igual a | Sim |
| `<` | Menor que | Não |
| `<=` | Menor ou igual a | Sim |

## Retorno booleano

Todos os operadores de comparação retornam um valor booleano (`true` ou `false`). O instrutor chama isso de "teste lógico" — você está perguntando ao JavaScript uma questão de sim ou não.

```javascript
console.log(500 > 120)   // true
console.log(500 < 120)   // false
console.log(120 > 120)   // false — ATENÇÃO
console.log(120 >= 120)  // true
console.log(120 <= 120)  // true
console.log(500 <= 120)  // false
```

## A analogia do saldo e pagamento

O instrutor usa um cenário do mundo real:
- `balance` = saldo na conta do usuário
- `payment` = valor a pagar

Essa analogia funciona porque torna óbvio o bug: se alguém tem exatamente R$120 e a conta é R$120, claro que pode pagar. Mas `120 > 120` é `false`.

A lição: **sempre pergunte "a igualdade faz parte da condição?"** antes de escolher o operador.

## Edge cases a considerar

1. **Valores negativos:** `-5 > -10` é `true` (mais próximo de zero = maior)
2. **Zero:** `0 > -1` é `true`, `0 >= 0` é `true`
3. **Decimais:** `0.1 + 0.2 > 0.3` pode dar `true` por floating point — cuidado com comparações financeiras
4. **Tipos misturados:** `"5" > 3` funciona por coerção, mas evite — use números explícitos

## Quando usar cada operador

- **`>`** — Quando igualdade NÃO satisfaz: "ultrapassou o limite", "excedeu o máximo"
- **`>=`** — Quando igualdade satisfaz: "tem saldo suficiente", "atingiu a meta"
- **`<`** — Quando igualdade NÃO satisfaz: "está abaixo do mínimo", "não chegou no limite"
- **`<=`** — Quando igualdade satisfaz: "está dentro do orçamento", "não excedeu o prazo"