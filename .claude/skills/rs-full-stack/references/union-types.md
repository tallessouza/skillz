---
name: rs-full-stack-union-types
description: "Applies TypeScript union type patterns when declaring variables that accept multiple types. Use when user asks to 'type a variable', 'handle null', 'define a response type', 'create a nullable string', or any TypeScript type annotation task. Enforces pipe operator union syntax for variables that can hold string | null, multiple primitives, or API/database response types. Make sure to use this skill whenever generating TypeScript code with variables that may hold more than one type. Not for generic types, interfaces, or advanced type manipulation like mapped/conditional types."
---

# Union Types

> Quando uma variavel pode ter mais de um tipo, declare todos os tipos possíveis usando o operador pipe `|`.

## Rules

1. **Use union types para variaveis com multiplos tipos possiveis** — `string | null` nao apenas `string`, porque respostas de APIs e bancos de dados podem retornar null
2. **Considere null como tipo primitivo** — null nao e ausencia de tipo, e um tipo proprio que deve ser declarado explicitamente, porque TypeScript nao assume nullable por padrao
3. **Declare apenas os tipos que a variavel realmente precisa** — nao adicione tipos extras "por seguranca", porque cada tipo na union exige tratamento no codigo consumidor
4. **Use pipe `|` para separar cada tipo na union** — `string | null | number`, porque essa e a sintaxe padrao do TypeScript para uniao de tipos

## How to write

### Variavel nullable (caso mais comum)

```typescript
// Resposta que pode vir vazia de uma API ou banco de dados
let response: string | null

response = "Dados retornados"
response = null
```

### Union com multiplos tipos

```typescript
// Quando o valor pode ser texto, nulo ou numerico
let result: string | null | number

result = "sucesso"
result = null
result = 42
```

## Example

**Before (tipo incompleto):**
```typescript
let response: string
response = "Teste"
response = null // Error: Type 'null' is not assignable to type 'string'
```

**After (union type correto):**
```typescript
let response: string | null
response = "Teste"
response = null // OK
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variavel recebe resposta de API/banco | Sempre incluir `| null` na union |
| Variavel sempre tera valor | Tipo unico, sem union |
| Funcao retorna tipos diferentes conforme condicao | Union type no retorno |
| Mais de 3 tipos na union | Considerar criar um type alias |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `let res: string` (quando pode ser null) | `let res: string \| null` |
| `let res: any` (para aceitar multiplos tipos) | `let res: string \| number \| null` |
| `let res: string \| null \| undefined \| number \| boolean` (union excessiva) | Criar type alias ou repensar o design |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre union types, null como tipo primitivo e cenarios de uso
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-union-types/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-union-types/references/code-examples.md)
