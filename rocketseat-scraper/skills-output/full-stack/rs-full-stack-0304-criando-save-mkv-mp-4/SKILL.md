---
name: rs-full-stack-0304-criando-save-mkv-mp-4
description: "Enforces auth state management patterns when saving user session data in React Context and routing based on user roles. Use when user asks to 'save login data', 'store auth state', 'redirect after login', 'manage user session', or 'route by role'. Applies patterns: typed save function in context, session state driving route strategy, API response stored via shared context function. Make sure to use this skill whenever implementing authentication flows with React Context or role-based routing. Not for token refresh, server-side auth, or cookie management."
---

# Salvando Dados de Autenticação no Contexto

> Compartilhe uma função `save` tipada via Context que armazena a resposta da API no estado de sessão, fazendo as rotas reagirem automaticamente ao perfil do usuário.

## Rules

1. **Tipe a função save no tipo do contexto** — defina `save(data: UserApiResponse): void` na interface do contexto, porque funções compartilhadas sem tipagem causam erros silenciosos
2. **Armazene a resposta da API diretamente no estado** — use `setSession(data)` dentro do `save`, porque transformações desnecessárias adicionam complexidade sem valor
3. **Compartilhe estado E funções pelo mesmo contexto** — exporte `session` e `save` juntos no value do Provider, porque consumidores precisam de ambos para funcionar
4. **Deixe as rotas reagirem ao estado** — não redirecione manualmente após login; o switch/case no componente de rotas já reage à mudança de `session`, porque isso mantém a lógica de roteamento centralizada
5. **Use o hook customizado para consumir o contexto** — `useAlf()` (ou equivalente) no componente de sign-in, porque acesso direto ao Context é verboso e repetitivo
6. **Substitua constantes de teste pelo estado real** — remova mocks/constantes temporárias quando o estado do contexto estiver pronto, porque código morto confunde futuros mantenedores

## How to write

### Tipagem do contexto com save

```typescript
type AuthContextType = {
  session: UserApiResponse | null
  save: (data: UserApiResponse) => void
}
```

### Função save no Provider

```typescript
function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserApiResponse | null>(null)

  function save(data: UserApiResponse) {
    setSession(data)
  }

  return (
    <AuthContext.Provider value={{ session, save }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Consumindo no sign-in

```typescript
function SignIn() {
  const auth = useAuth()

  async function handleSignIn(formData: SignInForm) {
    const response = await api.post("/sessions", formData)
    auth.save(response.data)
  }
}
```

## Example

**Before (constante de teste controlando rotas):**
```typescript
// routes/index.tsx
const session = { user: { role: "manager" } } // constante fixa

function route() {
  switch (session?.user.role) {
    case "manager": return <ManagerRoutes />
    case "employee": return <EmployeeRoutes />
    default: return <AuthRoutes />
  }
}
```

**After (estado do contexto controlando rotas):**
```typescript
// routes/index.tsx
function AppRoutes() {
  const { session } = useAuth()

  function route() {
    switch (session?.user.role) {
      case "manager": return <ManagerRoutes />
      case "employee": return <EmployeeRoutes />
      default: return <AuthRoutes />
    }
  }

  return <BrowserRouter>{route()}</BrowserRouter>
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| API retorna dados do usuário após login | Salve no contexto via `save(response.data)` |
| Rotas dependem do perfil do usuário | Leia `session` do contexto, use switch/case |
| Sessão é null | Redirecione para rotas de autenticação (default do switch) |
| Precisa compartilhar lógica de auth | Exponha funções tipadas no contexto, consuma via hook |
| Tem constantes de teste para auth | Remova e substitua pelo estado real do contexto |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|--------------|
| `navigate("/dashboard")` após login | Deixe o switch de rotas reagir à mudança de `session` |
| Constante fixa simulando sessão em produção | Estado `useState` no contexto |
| `save` sem tipagem no contexto | `save: (data: UserApiResponse) => void` na interface |
| Acessar `AuthContext` direto no componente | Usar hook `useAuth()` |
| Salvar apenas parte dos dados da API | Salvar `response.data` completo no estado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estado de sessão influenciando rotas e o fluxo de autenticação
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações de role e contexto