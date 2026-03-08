---
name: rs-full-stack-utilitarios-do-type-script
description: "Applies TypeScript built-in utility types when writing or refactoring TypeScript code. Use when user asks to 'create a type', 'transform a type', 'make properties optional', 'pick fields', 'omit fields', or any type manipulation task. Enforces Partial, Required, Pick, Omit, Record, Readonly, ReturnType, Parameters, Extract, Exclude usage. Make sure to use this skill whenever manipulating or reusing types in TypeScript. Not for runtime logic, JavaScript-only projects, or validation libraries like Zod."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript-advanced
  tags: [typescript, utility-types, partial, pick, omit, record, readonly]
---

# Utilitários do TypeScript

> Reutilize e transforme tipos existentes com utility types em vez de criar tipos duplicados manualmente.

## Rules

1. **Use utility types para derivar tipos** — `Pick<User, 'name' | 'email'>` nao `type UserBasic = { name: string; email: string }`, porque manter sincronia manual entre tipos duplicados causa bugs silenciosos
2. **Prefira composicao de utilities** — combine `Partial`, `Pick`, `Omit` em vez de redeclarar campos, porque DRY aplica-se a tipos tanto quanto a codigo
3. **Use Record para mapas tipados** — `Record<string, User>` nao `{ [key: string]: User }`, porque Record e mais legivel e expressa intencao
4. **Use Readonly para imutabilidade** — `Readonly<Config>` quando o objeto nao deve ser alterado, porque previne mutacoes acidentais em tempo de compilacao
5. **Extraia ReturnType e Parameters de funcoes existentes** — evita duplicar a assinatura da funcao como tipo separado

## How to write

### Partial e Required

```typescript
interface User {
  name: string
  email: string
  age: number
}

// Atualizar parcialmente — todos os campos opcionais
function updateUser(id: string, data: Partial<User>) {
  return db.users.update(id, data)
}

// Garantir que todos os campos estao presentes
function createUser(data: Required<User>) {
  return db.users.create(data)
}
```

### Pick e Omit

```typescript
// Selecionar apenas os campos necessarios
type UserPreview = Pick<User, 'name' | 'email'>

// Remover campos sensiveis
type PublicUser = Omit<User, 'password' | 'internalId'>
```

### Record e Readonly

```typescript
type UserRole = 'admin' | 'editor' | 'viewer'
type RolePermissions = Record<UserRole, string[]>

const config: Readonly<AppConfig> = loadConfig()
// config.port = 3000  // Erro de compilacao
```

### ReturnType e Parameters

```typescript
function getUser(id: string, includeProfile: boolean) {
  // ...
  return { id, name: 'João', profile: null }
}

type UserResult = ReturnType<typeof getUser>
type GetUserParams = Parameters<typeof getUser>  // [string, boolean]
```

## Example

**Before (tipos duplicados manualmente):**
```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

interface UserUpdate {
  name?: string
  email?: string
}

interface UserPublic {
  id: string
  name: string
  email: string
  createdAt: Date
}
```

**After (com utility types):**
```typescript
interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

type UserUpdate = Partial<Pick<User, 'name' | 'email'>>
type UserPublic = Omit<User, 'password'>
```

## Heuristics

| Situacao | Utility type |
|----------|-------------|
| Formulario de edicao (campos opcionais) | `Partial<T>` |
| Remover campos internos/sensiveis | `Omit<T, Keys>` |
| Selecionar subset de campos | `Pick<T, Keys>` |
| Mapear chaves a valores tipados | `Record<Keys, Value>` |
| Prevenir mutacao de config/state | `Readonly<T>` |
| Tipo do retorno de funcao existente | `ReturnType<typeof fn>` |
| Tipo dos parametros de funcao existente | `Parameters<typeof fn>` |
| Filtrar tipos de uma union | `Extract<Union, Match>` / `Exclude<Union, Match>` |
| Garantir todos os campos obrigatorios | `Required<T>` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Tipo manual copiando campos de outro tipo | `Pick<Original, 'field1' \| 'field2'>` |
| Interface com todos campos opcionais duplicados | `Partial<Original>` |
| `{ [key: string]: Value }` para mapas | `Record<string, Value>` |
| Tipo separado copiando retorno de funcao | `ReturnType<typeof myFunction>` |
| Interface sem password copiando User | `Omit<User, 'password'>` |

## Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Type 'X' does not satisfy the constraint` ao usar Pick/Omit | Chave passada não existe no tipo original | Verifique que as chaves em `Pick<T, 'key'>` existem em `T` |
| `Partial<T>` não aceita campos extras | Partial torna campos opcionais mas não adiciona novos | Use intersection: `Partial<T> & { newField: string }` |
| `Readonly` não previne mutação em objetos aninhados | Readonly é shallow, não afeta propriedades nested | Use `Readonly` recursivo ou bibliotecas como `ts-essentials` para DeepReadonly |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada utility type e quando usar
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-utilitarios-do-type-script/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-utilitarios-do-type-script/references/code-examples.md)
