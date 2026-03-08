---
name: rs-full-stack-0305-local-storage
description: "Enforces browser localStorage best practices when persisting user sessions, storing auth tokens, or caching client-side data. Use when user asks to 'save user session', 'persist login', 'store token in browser', 'use localStorage', or 'keep user logged in after refresh'. Applies rules: separate user data from token, use namespaced keys, serialize objects with JSON.stringify, deserialize with JSON.parse. Make sure to use this skill whenever implementing client-side persistence or session management in vanilla JS. Not for server-side storage, cookies, sessionStorage, or IndexedDB."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [localstorage, session-persistence, json, browser-api, authentication, namespace]
---

# Local Storage — Persistência de Sessão no Navegador

> Utilize localStorage com chaves nomeadas por namespace para persistir sessão do usuário entre recarregamentos de página.

## Rules

1. **Serialize objetos antes de salvar** — use `JSON.stringify(obj)` porque localStorage só armazena strings
2. **Deserialize ao recuperar** — use `JSON.parse()` no retorno de `getItem` porque o valor retornado é sempre string ou null
3. **Separe user de token** — armazene dados do usuário e token em chaves distintas, porque o token será usado isoladamente em requisições HTTP
4. **Use namespace nas chaves** — prefixe com `@nomeDaApp:recurso` (ex: `@refound:user`) porque evita colisão com outras aplicações no mesmo domínio
5. **Defina a chave como constante** — crie `LOCAL_STORAGE_KEY` em caixa alta porque centraliza a referência e evita typos espalhados pelo código
6. **Verifique null ao recuperar** — `getItem` retorna `null` quando a chave não existe, porque acessar propriedades de null causa erro

## How to write

### Constante de namespace

```javascript
const LOCAL_STORAGE_KEY = "@refound"
```

### Salvar sessão (setItem + JSON.stringify)

```javascript
function save(data) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
  localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token)
}
```

### Recuperar sessão (getItem + JSON.parse)

```javascript
function getUser() {
  const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
  return stored ? JSON.parse(stored) : null
}

function getToken() {
  return localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)
}
```

### Remover sessão (removeItem)

```javascript
function clearSession() {
  localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
  localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)
}
```

## Example

**Before (sem persistência — sessão perde ao recarregar):**

```javascript
// Dados ficam só em memória
let currentUser = null
let authToken = null

function login(data) {
  currentUser = data.user
  authToken = data.token
}
// Recarregou a página → perdeu tudo
```

**After (com localStorage — sessão persiste):**

```javascript
const LOCAL_STORAGE_KEY = "@refound"

function login(data) {
  localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
  localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token)
}

function getStoredUser() {
  const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
  return stored ? JSON.parse(stored) : null
}

function getStoredToken() {
  return localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)
}
// Recarregou a página → recupera do localStorage
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dado é objeto ou array | `JSON.stringify` antes de `setItem` |
| Dado é string simples (token) | Salve direto sem stringify |
| Precisa verificar se usuário está logado | `getItem` + check null |
| Logout | `removeItem` para cada chave |
| Múltiplas chaves da mesma app | Namespace com `@appName:recurso` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `localStorage.setItem("user", userObj)` | `localStorage.setItem("user", JSON.stringify(userObj))` |
| `localStorage.setItem("user", ...)` sem namespace | `localStorage.setItem("@app:user", ...)` |
| Chave hardcoded em vários arquivos | Constante `LOCAL_STORAGE_KEY` centralizada |
| Token e user na mesma chave | Chaves separadas: `:user` e `:token` |
| `JSON.parse(localStorage.getItem(k))` sem null check | Verificar null antes de parse |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `[object Object]` salvo no localStorage | Objeto salvo sem `JSON.stringify` | Usar `JSON.stringify(obj)` antes de `setItem` |
| `JSON.parse` retorna erro | Valor no localStorage não é JSON válido | Verificar se o valor foi salvo com `JSON.stringify` |
| `Cannot read properties of null` | `getItem` retornou null e tentou acessar propriedade | Verificar `if (stored)` antes de `JSON.parse(stored)` |
| Dados de outra app interferem | Chaves sem namespace | Prefixar todas as chaves com `@nomeDaApp:` |
| Sessão perdida após limpar cache | localStorage foi limpo pelo navegador | Comportamento esperado — redirecionar para login |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre localStorage, escopo por domínio, e estratégias de persistência
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações