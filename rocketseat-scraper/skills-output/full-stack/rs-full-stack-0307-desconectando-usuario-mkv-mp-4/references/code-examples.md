# Code Examples: Desconectando Usuário

## Exemplo 1: Função remove completa no AuthContext

```typescript
// src/contexts/AuthContext.tsx

interface Session {
  user: {
    id: string
    name: string
    email: string
    role: "member" | "manager"
  }
  token: string
}

interface AuthContextData {
  session: Session | null
  save: (session: Session) => void
  remove: () => void
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  // Método save (implementado na aula anterior)
  function save(newSession: Session) {
    setSession(newSession)
    localStorage.setItem("user", JSON.stringify(newSession.user))
    localStorage.setItem("token", newSession.token)
  }

  // Método remove (implementado nesta aula)
  function remove() {
    setSession(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.assign("/")
  }

  return (
    <AuthContext.Provider value={{ session, save, remove }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Exemplo 2: Header com logout e nome dinâmico

```typescript
// src/components/Header.tsx
import { LogOut } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export function Header() {
  const auth = useAuth()

  return (
    <header className="header">
      <div className="user-info">
        <span>{auth.session?.user.name}</span>
      </div>

      <nav>
        <button onClick={() => auth.remove()}>
          <LogOut size={20} />
        </button>
      </nav>
    </header>
  )
}
```

## Exemplo 3: Hook useAuth

```typescript
// src/hooks/useAuth.ts
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
```

## Exemplo 4: Variação — Logout com confirmação

```typescript
// Variação: adicionar confirmação antes de deslogar
function Header() {
  const auth = useAuth()

  function handleLogout() {
    const confirmed = window.confirm("Deseja realmente sair?")
    if (confirmed) {
      auth.remove()
    }
  }

  return (
    <header>
      <span>{auth.session?.user.name}</span>
      <button onClick={handleLogout}>
        <LogOut size={20} />
      </button>
    </header>
  )
}
```

## Exemplo 5: Variação — Exibindo role do usuário

```typescript
// Exibindo nome e papel do usuário a partir do contexto
function Header() {
  const auth = useAuth()

  return (
    <header>
      <div>
        <strong>{auth.session?.user.name}</strong>
        <span>{auth.session?.user.role === "manager" ? "Gerente" : "Membro"}</span>
      </div>
      <button onClick={() => auth.remove()}>Sair</button>
    </header>
  )
}
```

## Exemplo 6: Provider value completo

```typescript
// O objeto value do provider com save e remove
<AuthContext.Provider
  value={{
    session,    // Session | null — dados do usuário logado
    save,       // (session: Session) => void — salvar sessão após login
    remove,     // () => void — limpar sessão e redirecionar
  }}
>
  {children}
</AuthContext.Provider>
```

## Exemplo 7: Fluxo completo de login → exibição → logout

```typescript
// 1. Login (outra página)
async function handleLogin(email: string, password: string) {
  const response = await api.post("/sessions", { email, password })
  auth.save({
    user: response.data.user,
    token: response.data.token,
  })
}

// 2. Exibição no Header (componente compartilhado)
<span>{auth.session?.user.name}</span>  // "Anderson" ou "Rodrigo"

// 3. Logout (botão no Header)
<button onClick={() => auth.remove()}>
  <LogOut />
</button>
// remove() → setSession(null) → removeItem x2 → window.location.assign("/")
```