# Deep Explanation: Operadores de Comparação Estrita

## Por que comparação estrita existe?

JavaScript é uma linguagem de tipagem dinâmica. Uma variável pode conter um número agora e uma string depois. O operador `==` (igualdade solta) tenta ser "inteligente" e converte os tipos antes de comparar — isso se chama **coerção de tipos** (type coercion).

O problema é que essa coerção é imprevisível e fonte constante de bugs.

## A analogia do instrutor (Rodrigo)

O instrutor Rodrigo usa um exemplo muito prático: imagine que você recebe um valor de um input de formulário. Esse valor vem como string (`"5"`). Se você usa `==`, o JavaScript diz "são iguais!" quando compara `"5" == 5`. Mas na hora de **somar**, ele trata como string e **concatena**: `"5" + 10` vira `"510"` em vez de `15`.

Ou seja: `==` te dá uma falsa sensação de segurança. O valor "parece" correto na comparação, mas quebra na operação seguinte.

## Como `===` funciona internamente

O operador `===` (estritamente igual) faz duas verificações:
1. **Tipo** — se os tipos são diferentes, retorna `false` imediatamente (sem coerção)
2. **Valor** — se os tipos são iguais, compara os valores

```javascript
1 === 1      // true  (mesmo tipo: number, mesmo valor: 1)
1 === "1"    // false (tipo diferente: number vs string — para aqui)
"1" === "1"  // true  (mesmo tipo: string, mesmo valor: "1")
```

## Como `!==` funciona

O operador `!==` (estritamente diferente) é o inverso lógico do `===`:
1. Se os tipos são diferentes, retorna `true` imediatamente
2. Se os tipos são iguais, compara valores e retorna `true` se forem diferentes

```javascript
1 !== 2      // true  (mesmo tipo, valores diferentes)
1 !== 1      // false (mesmo tipo, mesmo valor)
2 !== "2"    // true  (tipos diferentes — para aqui, retorna true)
```

## Casos problemáticos com `==` (coerção de tipos)

```javascript
0 == ""        // true  (string vazia é convertida para 0)
0 == "0"       // true  (string "0" é convertida para 0)
"" == "0"      // false (ambos são strings, valores diferentes)
false == "0"   // true  (false vira 0, "0" vira 0)
null == undefined // true (regra especial do ==)
```

Com `===`, todos esses retornam `false` (exceto comparações do mesmo tipo com mesmo valor), porque os tipos são diferentes.

## A recomendação do instrutor

Rodrigo é enfático: **sempre use `===` e `!==`**. A razão principal:
- Você quer saber se o valor é do mesmo **tipo** E do mesmo **conteúdo**
- Especialmente importante quando vai fazer contas — se um valor é string, a "soma" vira concatenação
- Usar comparação estrita força você a lidar com conversões de tipo explicitamente, em vez de depender de coerção implícita

## Quando `==` poderia ser aceitável (edge case)

Alguns desenvolvedores usam `== null` como atalho para verificar `null` e `undefined` simultaneamente:
```javascript
if (value == null) { ... } // true para null E undefined
```

Mas a recomendação do curso é ser explícito:
```javascript
if (value === null || value === undefined) { ... }
```

Ou usar o operador nullish moderno:
```typescript
const result = value ?? defaultValue
```