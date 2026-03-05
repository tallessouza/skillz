---
name: rs-full-stack-objetos-5
description: "Enforces TypeScript object typing patterns when defining variables, function parameters, and optional properties. Use when user asks to 'type an object', 'create a typed function', 'add optional properties', 'destructure parameters', or writes inline object types. Applies rules: inline object annotation, optional with ?, destructured typed params, named object params over positional. Make sure to use this skill whenever writing TypeScript objects or function signatures with object parameters. Not for interfaces, type aliases, classes, or generics."
---

# Tipagem em Objetos TypeScript

> Tipe objetos inline com propriedades obrigatorias e opcionais, e prefira parametros de funcao como objetos desestruturados e tipados.

## Rules

1. **Tipe objetos inline com `{ prop: tipo }`** — `let user: { name: string, age: number } = { ... }`, porque TypeScript infere `{}` como aceitando qualquer coisa sem anotacao explicita
2. **Todas as propriedades declaradas sao obrigatorias por padrao** — omitir qualquer uma causa erro de compilacao, porque o compilador garante integridade estrutural
3. **Use `?` antes de `:` para propriedades opcionais** — `avatarUrl?: string` torna o campo opcional (tipo vira `string | undefined`), porque permite cadastro parcial sem violar o contrato
4. **Prefira objetos desestruturados como parametros de funcao** — `({ email, password }: { email: string, password: string })` em vez de parametros posicionais, porque autocomplete mostra as opcoes e previne erros de ordem
5. **Acesse apenas propriedades que existem no tipo** — `user.password` causa erro se nao declarado, porque o compilador impede acesso a propriedades fantasma

## How to write

### Objeto tipado inline

```typescript
let user: { name: string, age: number, avatarUrl?: string } = {
  name: "Rodrigo",
  age: 17
}
// avatarUrl e opcional — pode ser omitido sem erro
```

### Funcao com objeto desestruturado

```typescript
function signIn({ email, password }: { email: string, password: string }) {
  console.log("Usuario " + email + " conectado!")
}

signIn({ email: "rodrigo@email.com", password: "123" })
```

### Funcao com objeto nomeado (sem desestruturar)

```typescript
function signIn(data: { email: string, password: string }) {
  console.log("Usuario " + data.email + " conectado!")
}
```

## Example

**Before (parametros posicionais — sem contexto na chamada):**
```typescript
function signIn(email: string, password: string) {
  // ...
}
signIn("rodrigo@email.com", "123") // qual e email, qual e password?
```

**After (objeto tipado — autoexplicativo):**
```typescript
function signIn({ email, password }: { email: string, password: string }) {
  console.log("Usuario " + email + " conectado!")
}
signIn({ email: "rodrigo@email.com", password: "123" })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao com 2+ parametros do mesmo tipo | Use objeto desestruturado para evitar troca de ordem |
| Propriedade pode nao existir no cadastro | Adicione `?` antes de `:` |
| Precisa acessar propriedade do objeto | Verifique se esta declarada no tipo |
| Objeto simples, usado uma vez | Tipagem inline e suficiente |
| Objeto reutilizado em varios lugares | Considere `type` ou `interface` (fora do escopo desta skill) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `let user = {}` (sem tipo) | `let user: { name: string } = { name: "Rodrigo" }` |
| `function fn(a: string, b: string, c: string)` | `function fn({ a, b, c }: { a: string, b: string, c: string })` |
| `avatarUrl: string` quando opcional | `avatarUrl?: string` |
| `user.password` sem declarar no tipo | Adicione `password` ao tipo do objeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre inferencia, opcionais e desestruturacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-objetos-5/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-objetos-5/references/code-examples.md)
