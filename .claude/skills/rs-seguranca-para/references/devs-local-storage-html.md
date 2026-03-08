---
name: rs-seguranca-devs-local-storage-html
description: "Guards against storing sensitive data in LocalStorage, SessionStorage, and IndexedDB when writing frontend code. Use when user asks to 'save user data', 'store token', 'cache credentials', 'persist API key', or any client-side storage task. Ensures no passwords, API keys, PII, or sensitive data go into browser storage APIs unencrypted. Make sure to use this skill whenever code writes to localStorage, sessionStorage, or IndexedDB. Not for server-side storage, encrypted vaults, or cookie security."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: session-management
  tags: [security, localstorage, client-storage]
---

# Seguranca do Armazenamento Local no Navegador

> Nunca armazene dados sensiveis em LocalStorage, SessionStorage ou IndexedDB — esses dados ficam no disco sem criptografia e qualquer pessoa com acesso ao dispositivo pode le-los.

## Rules

1. **Nunca armazene senhas em storage local** — `localStorage.setItem('password', pwd)` salva texto puro no disco, porque diferente do gerenciador de senhas do Chrome (que usa o keyring do SO ou chave criptografada com a sessao do usuario), o LocalStorage nao tem criptografia nenhuma
2. **Nunca armazene chaves de API em storage local** — API keys no LocalStorage podem ser extraidas por qualquer usuario da maquina ou por scripts maliciosos (XSS), porque o arquivo levelDB no disco e legivel sem autenticacao
3. **Nunca armazene dados pessoais (PII) em storage local** — nome da mae, CPF, data de nascimento, endereco no LocalStorage violam LGPD/GDPR, porque esses dados ficam acessiveis sem senha no sistema de arquivos
4. **Use storage local apenas para dados nao-sensiveis** — preferencias de UI, tema, idioma, estado de navegacao, porque se vazarem nao representam risco de seguranca nem violacao de privacidade
5. **SessionStorage tambem nao e seguro** — funciona como LocalStorage mas por sessao de navegacao, porque os dados tambem ficam no disco sem criptografia enquanto a sessao esta ativa
6. **IndexedDB segue a mesma regra** — banco de dados local no navegador, tambem sem criptografia no disco

## How to write

### Armazenamento seguro (dados nao-sensiveis)

```typescript
// OK: preferencias de UI
localStorage.setItem('theme', 'dark')
localStorage.setItem('language', 'pt-BR')
localStorage.setItem('sidebar-collapsed', 'true')

// OK: estado de navegacao
sessionStorage.setItem('current-step', '3')
sessionStorage.setItem('scroll-position', '450')
```

### Tokens de autenticacao

```typescript
// CORRETO: token JWT em cookie httpOnly (setado pelo servidor)
// Set-Cookie: token=eyJ...; HttpOnly; Secure; SameSite=Strict

// CORRETO: token em memoria (variavel JS, contexto React, store)
const authStore = { accessToken: null }
function setToken(token: string) { authStore.accessToken = token }

// ERRADO: token no localStorage
localStorage.setItem('token', jwt) // Acessivel via XSS e no disco
```

## Example

**Before (vulneravel):**
```typescript
function saveUserSession(user: User, apiKey: string) {
  localStorage.setItem('password', user.password)
  localStorage.setItem('api-key', apiKey)
  localStorage.setItem('cpf', user.cpf)
  localStorage.setItem('mother-name', user.motherName)
  localStorage.setItem('theme', user.preferredTheme)
}
```

**After (com esta skill aplicada):**
```typescript
function saveUserSession(user: User) {
  // Apenas dados nao-sensiveis no localStorage
  localStorage.setItem('theme', user.preferredTheme)
  localStorage.setItem('user-display-name', user.displayName)

  // Dados sensiveis ficam em memoria ou cookie httpOnly
  // Senha NUNCA e armazenada no cliente
  // API key enviada apenas via header em cada request
  // PII fica apenas no servidor
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa persistir token de autenticacao | Cookie httpOnly setado pelo servidor, ou memoria (perde no refresh) |
| Precisa cachear dados do usuario para UX | Armazene apenas dados publicos (nome de exibicao, avatar URL) |
| Precisa salvar preferencias | LocalStorage e adequado (tema, idioma, layout) |
| Precisa armazenar dados de formulario temporariamente | SessionStorage com dados nao-sensiveis apenas |
| Precisa de banco local robusto | IndexedDB, mas mesmas regras de dados sensiveis |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `localStorage.setItem('password', pwd)` | Nao armazene senha no cliente |
| `localStorage.setItem('api-key', key)` | Envie via header a cada request |
| `localStorage.setItem('token', jwt)` | Cookie httpOnly ou memoria |
| `localStorage.setItem('cpf', doc)` | Mantenha PII apenas no servidor |
| `localStorage.setItem('credit-card', cc)` | Use gateway de pagamento (Stripe, etc) |
| `indexedDB.put({ ssn: '...' })` | Mesma regra: sem dados sensiveis |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-local-storage-html/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-local-storage-html/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
