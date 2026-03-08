---
name: rs-full-stack-desconectando-usuario
description: "Enforces logout implementation patterns when building authentication flows in React applications. Use when user asks to 'implement logout', 'disconnect user', 'clear session', 'remove auth token', or 'sign out'. Applies rules: clear state to initial value, remove all localStorage keys (user + token), redirect with window.location.assign, type context methods with void return, display dynamic user data from context. Make sure to use this skill whenever implementing session removal or auth context teardown. Not for login flows, token refresh, or server-side session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [react, logout, authentication, localstorage, context, session]
---

# Desconectando Usuário — Logout no Contexto de Autenticação

> Ao implementar logout, limpe TODO o estado de sessão (memória + storage), redirecione o usuário, e exponha o método tipado no contexto.

## Rules

1. **Resete o estado para o valor inicial** — `setSession(null)` porque null é o valor inicial do estado, mantendo consistência com o estado "não autenticado"
2. **Remova TODAS as chaves do localStorage** — tanto `user` quanto `token`, porque deixar um sem o outro cria estado inconsistente
3. **Redirecione com `window.location.assign("/")`** — porque força navegação completa para a raiz, limpando qualquer estado em memória do React
4. **Tipe o método no contexto** — `remove: () => void` na interface, porque sem tipagem o TypeScript não reconhece o método no provider value
5. **Disponibilize no provider value** — adicione `remove` ao objeto retornado pelo contexto, porque componentes como Header precisam acessá-lo
6. **Exiba dados dinâmicos do contexto** — use `auth.session?.user.name` com optional chaining, porque session pode ser null antes do login

## How to write

### Função remove no contexto

```typescript
function remove() {
  setSession(null)
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  window.location.assign("/")
}
```

### Tipagem no contexto

```typescript
interface AuthContextData {
  session: Session | null
  save: (session: Session) => void
  remove: () => void  // sem parâmetros, sem retorno
}
```

### Uso no componente Header

```typescript
import { useAuth } from "../hooks/useAuth"

function Header() {
  const auth = useAuth()

  return (
    <header>
      <span>{auth.session?.user.name}</span>
      <button onClick={() => auth.remove()}>
        <LogOutIcon />
      </button>
    </header>
  )
}
```

## Example

**Before (logout incompleto):**
```typescript
function handleLogout() {
  localStorage.removeItem("token")
  // Esqueceu de limpar o estado
  // Esqueceu de remover "user" do localStorage
  // Esqueceu de redirecionar
}
```

**After (com esta skill aplicada):**
```typescript
function remove() {
  setSession(null)
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  window.location.assign("/")
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Logout com auth context | Crie `remove` no provider, exponha via value |
| Múltiplos itens no localStorage | Remova cada chave individualmente |
| Redirecionamento pós-logout | Use `window.location.assign("/")` para navegação limpa |
| Nome do usuário no header | `auth.session?.user.name` com optional chaining |
| Tipagem do método void | `remove: () => void` na interface do contexto |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `localStorage.clear()` (remove tudo) | `localStorage.removeItem("user")` + `removeItem("token")` |
| Só limpar localStorage sem resetar estado | `setSession(null)` + `removeItem` |
| `navigate("/")` para logout | `window.location.assign("/")` (força reload completo) |
| `auth.session.user.name` sem `?` | `auth.session?.user.name` |
| Método sem tipagem no contexto | `remove: () => void` na interface |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Usuário ainda aparece logado após logout | Estado não foi resetado para null | Adicionar `setSession(null)` na função remove |
| Token permanece no localStorage após logout | `removeItem` não foi chamado para todas as chaves | Remover tanto `:user` quanto `:token` individualmente |
| Página não redireciona após logout | Usando `navigate()` em vez de `window.location.assign` | Usar `window.location.assign("/")` para forçar reload completo |
| `remove is not a function` no componente | Método não está no value do Provider | Adicionar `remove` ao objeto `value={{ session, save, remove }}` |
| `Cannot read properties of null (reading 'name')` | `session` é null e falta optional chaining | Usar `auth.session?.user.name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre por que window.location.assign vs navigate, limpeza de estado consistente, e tipagem void
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários