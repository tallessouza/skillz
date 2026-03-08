---
name: rs-full-stack-desestruturacao-de-array
description: "Enforces correct array destructuring patterns when writing JavaScript/TypeScript code. Use when user asks to 'extract values from array', 'destructure array', 'unpack array', 'get specific items from array', or any code that accesses array elements by index. Applies rules: named variables over index access, skip positions with commas, partial destructuring. Make sure to use this skill whenever generating code that reads from arrays. Not for object destructuring, spread operator, or rest parameters."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-modern
  tags: [JavaScript, destructuring, array, ES6, assignment]
---

# Desestruturação de Array

> Ao extrair dados de arrays, use destructuring assignment para criar variáveis nomeadas diretamente, nunca acesse por índice quando os valores têm significado semântico.

## Rules

1. **Use destructuring ao invés de acesso por índice** — `const [name, email] = data` não `const name = data[0]`, porque variáveis nomeadas comunicam a intenção e são mais legíveis
2. **O nome da variável não precisa corresponder ao conteúdo** — o que importa é a posição no array, não o nome escolhido, porque a atribuição é posicional
3. **Extraia apenas o que precisa** — se só precisa do primeiro elemento, use `const [first] = arr` sem listar o restante, porque elementos omitidos no final são ignorados automaticamente
4. **Use vírgulas para pular posições** — `const [, second] = arr` pula o primeiro elemento, porque a vírgula vazia indica uma posição ignorada
5. **Combine vírgulas para pular múltiplas posições** — `const [,, third] = arr` pega apenas o terceiro elemento, porque cada vírgula avança uma posição
6. **Prefira `const` na declaração** — destructuring cria variáveis novas, use `const` por padrão para imutabilidade

## How to write

### Destructuring básico
```typescript
// Extrair todos os elementos nomeados
const [username, email] = ["Rodrigo", "rodrigo@email.com"]
```

### Pegar apenas o primeiro elemento
```typescript
// Omita o restante — não precisa de vírgula após o último desejado
const [banana] = ["banana", "maçã", "laranja"]
```

### Pular posições com vírgula
```typescript
// Underline ou vírgula vazia para ignorar posições
const [, apple] = ["banana", "maçã", "laranja"]
const [,, orange] = ["banana", "maçã", "laranja"]
```

## Example

**Before (acesso por índice):**
```typescript
const data = ["Rodrigo", "rodrigo@email.com"]
const username = data[0]
const email = data[1]

const fruits = ["banana", "maçã", "laranja"]
const third = fruits[2]
```

**After (com destructuring):**
```typescript
const [username, email] = ["Rodrigo", "rodrigo@email.com"]

const [,, orange] = ["banana", "maçã", "laranja"]
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Array com valores semânticos (nome, email) | Destructure com nomes descritivos |
| Precisa só do primeiro elemento | `const [first] = arr` — omita o resto |
| Precisa do segundo, não do primeiro | `const [, second] = arr` — vírgula pula |
| Precisa do terceiro apenas | `const [,, third] = arr` — duas vírgulas |
| Array retornado de função (ex: useState) | Sempre destructure: `const [state, setState] = useState()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const name = arr[0]` | `const [name] = arr` |
| `const email = arr[1]` | `const [, email] = arr` |
| `const [a, b, c] = arr` (quando só precisa de `c`) | `const [,, c] = arr` |
| `const [_, second] = arr` (underline como variável) | `const [, second] = arr` (vírgula vazia) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Variavel retorna `undefined` | Array tem menos elementos que as variaveis declaradas | Verifique o tamanho do array antes de desestruturar |
| Valor errado na variavel | Atribuicao e posicional — posicao errada | Conte as posicoes: primeiro elemento = primeira variavel |
| `_` como variavel gera warning de lint | Usando underscore para pular posicao | Use virgula vazia `, ` em vez de `_` |
| Desestruturacao de string em vez de array | Passou string onde esperava array | Verifique o tipo do dado antes de desestruturar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações