---
name: rs-angular-localstorage-state-persistence
description: "Applies localStorage persistence patterns when building Angular state management with signals. Use when user asks to 'persist state', 'save to localStorage', 'keep data after reload', 'manage user session', or 'create a store with signals'. Enforces computed signal fallback pattern, proper cleanup on logout, and reactive state hydration from localStorage. Make sure to use this skill whenever implementing state persistence in Angular applications. Not for server-side storage, cookies, IndexedDB, or backend session management."
---

# Persistencia de Estado com localStorage em Angular

> Ao persistir estado no localStorage, use computed signals como camada reativa que faz fallback automatico entre memoria e storage.

## Rules

1. **Salve no localStorage no momento do set** — `localStorage.setItem()` dentro do metodo que atualiza o signal, porque garante sincronia entre memoria e storage
2. **Remova do localStorage no logout** — `localStorage.removeItem()` no metodo de logout, porque evita sujeira no storage apos o usuario sair
3. **Externalize chaves como propriedades private readonly** — `private readonly userNameKey = 'user-name'`, porque evita typos e centraliza a referencia
4. **Use computed signal para fallback reativo** — crie um `computed()` que verifica o signal em memoria primeiro, depois o localStorage, porque reage automaticamente a mudancas no signal
5. **Retorne string vazia como fallback final** — se nao existe no signal nem no localStorage, retorne `''`, porque evita que a aplicacao quebre com `undefined`
6. **Nunca consuma o localStorage diretamente no template** — sempre passe por um signal ou computed, porque o template precisa de reatividade

## How to write

### Store com persistencia

```typescript
private readonly userNameKey = 'user-name';

// Signal principal (memoria)
user = signal<UserInfos | undefined>(undefined);

// Computed com fallback para localStorage
username = computed(() => {
  const hasUser = this.user();
  if (!hasUser) {
    const usernameLocalStorage = localStorage.getItem(this.userNameKey);
    return usernameLocalStorage ? usernameLocalStorage : '';
  }
  return hasUser.name;
});

// Set: salva em memoria E no localStorage
setUserInfos(user: UserInfos) {
  this.user.set(user);
  localStorage.setItem(this.userNameKey, user.name);
}

// Remove: limpa o localStorage
removeUser() {
  localStorage.removeItem(this.userNameKey);
}
```

### Chamada no logout (header component)

```typescript
logout() {
  this.userInfoStore.removeUser();
  // ... restante da logica de logout
}
```

## Example

**Before (estado perdido no reload):**
```typescript
// Store
user = signal<UserInfos | undefined>(undefined);

setUserInfos(user: UserInfos) {
  this.user.set(user);
}
// Ao recarregar: user volta para undefined, nome some do header
```

**After (com persistencia):**
```typescript
private readonly userNameKey = 'user-name';
user = signal<UserInfos | undefined>(undefined);

username = computed(() => {
  const hasUser = this.user();
  if (!hasUser) {
    const stored = localStorage.getItem(this.userNameKey);
    return stored ?? '';
  }
  return hasUser.name;
});

setUserInfos(user: UserInfos) {
  this.user.set(user);
  localStorage.setItem(this.userNameKey, user.name);
}

removeUser() {
  localStorage.removeItem(this.userNameKey);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dado precisa sobreviver ao reload | Salve no localStorage junto com o signal |
| Usuario faz logout | Chame removeItem para limpar storage |
| Template precisa exibir dado persistido | Consuma um computed que faz fallback |
| Chave do localStorage usada em 2+ lugares | Externalize como `private readonly` |
| Dado removido manualmente do storage | Retorne fallback vazio, nunca quebre |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `localStorage.getItem('user-name')` no template | `userInfoStore.username()` (computed signal) |
| Hardcoded string `'user-name'` em multiplos locais | `private readonly userNameKey = 'user-name'` |
| Apenas `this.user.set(user)` sem persistir | `this.user.set(user)` + `localStorage.setItem(...)` |
| Logout sem limpar localStorage | `localStorage.removeItem(this.userNameKey)` no logout |
| `return undefined` quando storage vazio | `return ''` (string vazia como fallback seguro) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
