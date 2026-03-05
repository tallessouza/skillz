---
name: rs-saas-nextjs-rbac-intro-casl
description: "Applies CASL authorization patterns when building permissions systems in JavaScript/TypeScript applications. Use when user asks to 'add permissions', 'implement authorization', 'define user roles', 'check if user can', or 'setup CASL'. Enforces deny-by-default, macro-level permissions over business logic in CASL, and proper separation between CASL conditions and backend rules. Make sure to use this skill whenever implementing role-based access control or permission checking in JS/TS apps. Not for authentication, login flows, or session management."
---

# Autorizacao com CASL

> Defina permissoes no nivel macro (quem pode o que) e mantenha regras de negocio no backend, nunca dentro do CASL.

## Key Concepts

CASL e uma biblioteca isomorfica de autorizacao — funciona no backend e frontend com o mesmo codigo JavaScript/TypeScript.

### Os 4 Parametros de Permissao

1. **Action** — verbo que descreve o que o usuario pode fazer (`create`, `read`, `update`, `delete`, ou verbos customizados como `rename`)
2. **Subject** — entidade da aplicacao (`User`, `Article`, `Project`, `Comment`)
3. **Fields** (opcional) — campos especificos da entidade (`description` mas nao `title`)
4. **Conditions** (opcional) — condicoes para a permissao se aplicar (`{ authorId: user.id }`)

## Rules

1. **Deny-by-default** — so defina o que o usuario PODE fazer, porque CASL nega tudo por padrao. Nunca liste o que ele nao pode, a menos que precise revogar algo ja concedido
2. **Permissoes macro, nao regras de negocio** — use CASL para "usuario pode editar post proprio". Use o backend para "post so pode ser editado se criado ha mais de 3 dias", porque regras de negocio pertencem a camada de dominio
3. **`manage` significa CRUD completo** — `can('manage', 'Post')` concede create, read, update, delete de uma vez
4. **Conditions usam sintaxe MongoDB** — CASL usa internamente MongoQuery para condicoes, entao `{ authorId: user.id }` funciona como um where clause

## How to Write

### Definindo permissoes com roles

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'
type Subjects = 'Post' | 'Comment' | 'User' | 'all'

function defineAbilitiesFor(user: { id: string; role: string }) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility)

  if (user.role === 'admin') {
    can('manage', 'all')
  } else {
    can('read', ['Post', 'Comment'])
    can('manage', 'Post', { authorId: user.id })
    can('create', 'Comment')
  }

  return build()
}
```

### Checando permissoes

```typescript
const ability = defineAbilitiesFor(currentUser)

if (ability.can('update', 'Post')) {
  // mostrar botao de editar
}

// Com instancia (checa conditions)
if (ability.can('update', subject('Post', post))) {
  // usuario e autor deste post
}
```

## Example

**Errado — regra de negocio dentro do CASL:**
```typescript
// NAO faca isso — regra de negocio complexa no CASL
can('update', 'Tweet', {
  authorId: user.id,
  likesCount: 0,        // regra de negocio: so edita sem likes
  createdAt: { $gte: threeDaysAgo }  // regra de negocio: criado ha 3+ dias
})
```

**Correto — CASL macro + regra no backend:**
```typescript
// CASL: permissao macro
can('update', 'Tweet', { authorId: user.id })

// Backend: regra de negocio na camada de dominio
async function updateTweet(tweetId: string, userId: string, data: UpdateTweetInput) {
  const tweet = await tweetRepository.findById(tweetId)

  if (tweet.likesCount > 0) {
    throw new BusinessRuleError('Tweet com likes nao pode ser editado')
  }

  return tweetRepository.update(tweetId, data)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| "Usuario X pode fazer Y?" | Coloque no CASL com `can` |
| "Usuario so pode se condicao de propriedade" | Use conditions do CASL: `{ authorId: user.id }` |
| "So pode se regra temporal/contagem/estado" | Mantenha no backend, fora do CASL |
| Full-stack JS (Next.js, Node) | Compartilhe as mesmas definicoes CASL entre front e back |
| Backend em linguagem diferente | Use JSON/YAML para compartilhar permissoes |
| Precisa de permissao granular por campo | Use Fields: `can('update', 'Article', ['description'])` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Definir o que usuario NAO pode sem antes ter concedido | Defina so o que ele PODE — deny-by-default cuida do resto |
| Colocar toda regra de negocio nas conditions do CASL | Conditions para ownership, regras complexas no dominio |
| Hardcodar checagens com `if (role === 'admin')` espalhadas | Centralize em `defineAbilitiesFor` e use `ability.can()` |
| Duplicar logica de permissao entre front e back | Compartilhe o mesmo arquivo de definicoes CASL |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
