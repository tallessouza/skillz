---
name: rs-full-stack-criando-tipo-do-usuario
description: "Enforces DTO typing patterns when creating TypeScript types for API responses, typing React contexts, and managing user session state. Use when user asks to 'type the context', 'create user types', 'define API response types', 'type useState', or 'create DTOs'. Applies rules: use .d.ts for global types, type only what you use from API, separate DTOs in dedicated folder, type context before passing values. Make sure to use this skill whenever defining data transfer objects or typing React context providers. Not for backend API implementation, database schemas, or authentication logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [typescript, dto, react-context, typing, d-ts, usestate]
---

# Tipagem de Contexto com DTOs

> Defina tipos globais em arquivos `.d.ts` para representar dados que trafegam entre front-end e back-end, e tipe o contexto React antes de compartilhar estado.

## Rules

1. **Crie uma pasta `dtos/` dentro de `src/`** — agrupe todos os Data Transfer Objects num local dedicado, porque separa representação de dados da lógica de negócio
2. **Use arquivos `.d.ts` para tipagens globais** — arquivos de declaração não precisam de import/export, ficam disponíveis globalmente no projeto, porque elimina imports repetitivos em cada arquivo
3. **Tipe apenas o que você vai usar da API** — não replique o retorno inteiro da API, selecione apenas os campos que a aplicação consome, porque reduz acoplamento e simplifica manutenção
4. **Tipe o contexto antes de passar valores** — defina um `type` para o contexto com todos os campos e seus tipos possíveis (incluindo `null`), porque garante type-safety em todos os consumidores
5. **Inicialize useState com tipagem explícita quando o tipo inclui null** — `useState<Type | null>(null)`, porque o TypeScript não infere union types automaticamente a partir de `null`
6. **Baseie seus DTOs no retorno real da API** — inspecione o response no Insomnia/DevTools e crie os tipos espelhando a estrutura, porque garante consistência entre front e back

## How to write

### DTOs em arquivo de declaração

```typescript
// src/dtos/user.d.ts
type UserAPIRole = "employee" | "manager" | "admin"

type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
  }
}
```

### Tipagem do contexto

```typescript
// src/contexts/auth.tsx
type AuthContext = {
  session: UserAPIResponse | null
}

const AuthContext = createContext<AuthContext>({} as AuthContext)
```

### Estado tipado com useState

```typescript
const [session, setSession] = useState<UserAPIResponse | null>(null)

return (
  <AuthContext.Provider value={{ session }}>
    {children}
  </AuthContext.Provider>
)
```

## Example

**Before (contexto sem tipagem):**
```typescript
const AuthContext = createContext({})

function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  )
}
```

**After (com DTOs e tipagem completa):**
```typescript
// src/dtos/user.d.ts
type UserAPIRole = "employee" | "manager" | "admin"

type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
  }
}

// src/contexts/auth.tsx
import { createContext, useState } from "react"

type AuthContext = {
  session: UserAPIResponse | null
}

const AuthContext = createContext<AuthContext>({} as AuthContext)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserAPIResponse | null>(null)

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API retorna 15 campos, app usa 5 | Tipe apenas os 5 campos usados |
| Tipo será usado em vários arquivos | Coloque em `dtos/` como `.d.ts` (global) |
| Tipo é local a um componente | Defina no próprio arquivo, não no `dtos/` |
| Campo pode ser ausente (usuário não logado) | Use union com `null` e inicialize como `null` |
| Enum de papéis/status da API | Crie um type union literal separado (`UserAPIRole`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const ctx = createContext({})` sem tipo | `createContext<AuthContext>({} as AuthContext)` |
| `useState(null)` sem generic | `useState<UserAPIResponse \| null>(null)` |
| Replicar todos os 20 campos do response | Tipar apenas os campos que a app consome |
| Tipos inline no contexto: `{ session: { token: string... } }` | DTO separado em `dtos/user.d.ts` |
| `import { UserAPIResponse } from './dtos/user'` (com import) | Usar `.d.ts` para acesso global sem import |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Tipo não é reconhecido globalmente | Arquivo usa extensão `.ts` em vez de `.d.ts` | Renomear para `.d.ts` e remover import/export |
| `Property 'session' does not exist on type '{}'` | Contexto criado sem generic de tipo | Usar `createContext<AuthContext>({} as AuthContext)` |
| `Argument of type 'null' is not assignable` | useState sem generic explícito | Usar `useState<UserAPIResponse \| null>(null)` |
| DTO importado manualmente em cada arquivo | Usando `.ts` com export em vez de `.d.ts` global | Converter para `.d.ts` sem export para acesso automático |
| Tipo desatualizado após mudança na API | DTO não reflete o response atual | Inspecionar response no DevTools e atualizar o `.d.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre DTOs, tipagem global vs local, e estratégia de tipos parciais
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e consumo do contexto