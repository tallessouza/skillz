---
name: rs-full-stack-carregando-dados
description: "Enforces authentication state persistence and loading state patterns when building React auth flows. Use when user asks to 'persist login', 'keep user logged in', 'load user session', 'prevent login flash', 'auth state on reload', or 'loading screen before routes'. Applies localStorage recovery with JSON.parse, useEffect for initial load, and isLoading guard to prevent route flicker. Make sure to use this skill whenever implementing auth context that survives page reloads. Not for server-side sessions, token refresh logic, or cookie-based auth."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, authentication, localstorage, useeffect, loading-state, context]
---

# Carregando Dados de Autenticação

> Ao recarregar a aplicação, recupere a sessão do localStorage antes de renderizar rotas — use isLoading para evitar piscadas na interface.

## Rules

1. **Recupere sessão no mount do contexto** — use `useEffect` sem dependências para chamar a função de carregamento, porque o estado React reseta no reload mas o localStorage persiste
2. **Mantenha a função de load interna** — `loadUser` não precisa ser exposta no contexto, porque é lógica interna de inicialização
3. **Use isLoading como guarda de rota** — comece com `true` e só mude para `false` após verificar o localStorage, porque a atualização de estado é assíncrona e causa piscada na tela de login
4. **Converta dados de volta com JSON.parse** — o localStorage armazena strings, então objetos salvos com `JSON.stringify` precisam de `JSON.parse` na recuperação
5. **Verifique existência antes de restaurar** — só chame `setSession` se tanto `token` quanto `user` existirem no localStorage, porque podem ter sido limpos manualmente

## How to write

### Função de carregamento no contexto de auth

```typescript
function loadUser() {
  const token = localStorage.getItem("@refound:token")
  const user = localStorage.getItem("@refound:user")

  if (token && user) {
    setSession({ token, user: JSON.parse(user) })
  }

  setIsLoading(false)
}

useEffect(() => {
  loadUser()
}, [])
```

### Estado isLoading como guarda de rota

```typescript
const [isLoading, setIsLoading] = useState(true)

// No provider, exponha isLoading no value
<AuthContext.Provider value={{ session, signIn, isLoading }}>
```

### Uso no index de rotas

```typescript
const { session, isLoading } = useAuth()

if (isLoading) {
  return <Loading />
}

// Só renderiza rotas depois que isLoading === false
return session ? <AppRoutes /> : <AuthRoutes />
```

## Example

**Before (piscada na tela de login ao recarregar):**
```typescript
// Contexto sem recuperação de sessão
const [session, setSession] = useState(null)

// No index — renderiza rotas imediatamente
return session ? <AppRoutes /> : <AuthRoutes />
// Resultado: usuário vê tela de login por um instante antes de redirecionar
```

**After (com carregamento e guarda):**
```typescript
const [session, setSession] = useState(null)
const [isLoading, setIsLoading] = useState(true)

function loadUser() {
  const token = localStorage.getItem("@refound:token")
  const user = localStorage.getItem("@refound:user")

  if (token && user) {
    setSession({ token, user: JSON.parse(user) })
  }
  setIsLoading(false)
}

useEffect(() => { loadUser() }, [])

// No index — guarda com isLoading
if (isLoading) return <Loading />
return session ? <AppRoutes /> : <AuthRoutes />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| App recarrega e perde sessão | Recuperar token e user do localStorage no useEffect |
| Piscada na tela de login antes de redirecionar | Adicionar isLoading=true como estado inicial, mostrar Loading até verificação |
| Dados no localStorage são strings | Usar JSON.parse para objetos, usar diretamente para strings simples |
| loadUser é usado apenas internamente | Manter fora do value do Provider — não expor no contexto |
| isLoading constante antiga no index de rotas | Substituir pela versão vinda do contexto de auth |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Renderizar rotas antes de verificar localStorage | Guardar com `if (isLoading) return <Loading />` |
| `useState(false)` para isLoading inicial | `useState(true)` — começa carregando |
| `JSON.parse` sem verificar se valor existe | `if (token && user)` antes de parsear |
| Expor loadUser no Provider value | Manter como função interna do contexto |
| Remover isLoading após primeiro render com timeout | Usar setIsLoading(false) após verificação real |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Piscada na tela de login ao recarregar | `isLoading` não está sendo usado como guarda | Adicionar `if (isLoading) return <Loading />` antes de renderizar rotas |
| Sessão não restaura após reload | `loadUser` não está no `useEffect` | Chamar `loadUser()` dentro de `useEffect(() => {}, [])` |
| `isLoading` nunca fica false | `setIsLoading(false)` não é chamado | Garantir que `setIsLoading(false)` executa após verificação do localStorage |
| `JSON.parse` falha ao recuperar user | Valor no localStorage não é JSON válido | Verificar se `JSON.stringify` foi usado ao salvar |
| Loading infinito quando localStorage está vazio | `setIsLoading(false)` só é chamado dentro do `if` | Mover `setIsLoading(false)` para fora do `if (token && user)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre estado assíncrono e piscada de interface
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações