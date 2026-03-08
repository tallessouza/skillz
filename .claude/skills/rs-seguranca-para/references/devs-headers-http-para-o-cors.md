---
name: rs-seguranca-devs-headers-http-cors
description: "Enforces secure CORS implementation when writing API endpoints or configuring HTTP headers. Use when user asks to 'enable CORS', 'fix CORS error', 'add Access-Control headers', 'protect API', or 'configure allowed origins'. Applies rules: never use wildcard origin, always validate against known hosts list, return specific origin not asterisk, limit HTTP methods per route, handle OPTIONS preflight. Make sure to use this skill whenever implementing cross-origin access control in any backend framework. Not for Content-Security-Policy, X-Frame-Options, or frontend click-jacking headers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: http-security
  tags: [security, cors, headers, cross-origin]
---

# CORS — Implementacao Segura

> CORS e responsabilidade do programador, nao da infra, porque depende das regras de negocio da aplicacao.

## Rules

1. **Nunca use asterisco no Access-Control-Allow-Origin** — `*` permite que qualquer site (incluindo hacker.com) acesse sua API, porque o navegador aceita qualquer origem quando ve asterisco
2. **Mantenha uma lista de origens conhecidas** — valide `request.origin` contra uma lista de hosts permitidos, porque so voce sabe quais dominios devem consumir sua API
3. **Retorne a origem especifica, nao asterisco** — devolva o valor exato da origem validada no header, porque isso indica ao navegador que voce aceita especificamente aquela origem
4. **Sempre implemente o handler OPTIONS** — o navegador faz preflight antes de GET/POST, e sem resposta ao OPTIONS com os headers corretos, a requisicao real nunca acontece
5. **Limite os metodos HTTP por rota** — use `Access-Control-Allow-Methods` com apenas os metodos necessarios (ex: so GET para APIs publicas), porque isso impede que um script injection execute DELETE ou PUT
6. **CORS fica no codigo da aplicacao, nao no servidor web** — nao delegue para Apache/Nginx com asterisco, porque cada rota tem suas proprias regras de acesso

## How to write

### Lista de origens e validacao

```typescript
// Mantenha a lista de origens permitidas no codigo
const ALLOWED_ORIGINS = [
  'https://meuapp.com',
  'https://admin.meuapp.com',
  'https://parceiro.exemplo.com',
]

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  // Se a origem nao esta na lista, nao seta nenhum header — o navegador bloqueia sozinho
}
```

### Handler OPTIONS (preflight)

```typescript
// Toda rota de API precisa responder ao OPTIONS
app.options('/api/*', (req, res) => {
  setCorsHeaders(req, res)
  res.status(204).send('')
})
```

### Metodos diferentes por contexto

```typescript
// APIs internas (painel admin): todos os metodos
if (isInternalRoute(path)) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
}
// APIs externas (parceiros): somente leitura
else {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
}
```

## Example

**Before (inseguro — padrao do enablecors.org):**
```typescript
// No Apache ou no codigo com asterisco
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})
```

**After (seguro — validacao de origem):**
```typescript
const ALLOWED_ORIGINS = ['https://meuapp.com', 'https://app.meuapp.com']

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  next()
})

app.options('/api/*', (req, res) => res.status(204).send(''))
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API consumida so pelo proprio frontend | Lista com 1-2 origens (dev + prod) |
| API consumida por parceiros | Origens no banco de dados, nao hardcoded |
| API publica (dados abertos, sem autenticacao) | Asterisco pode ser aceitavel nesse caso raro |
| Rota serve CSS/JS estatico | Nao precisa de CORS, e recurso do proprio dominio |
| Painel admin interno | Libere todos os metodos, mas so para origens internas |
| API externa para terceiros | Libere somente GET, bloqueie escrita |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `Access-Control-Allow-Origin: *` | Valide origem contra lista e retorne a origem especifica |
| Configurar CORS no Apache/Nginx global | Implemente no codigo da aplicacao, por rota |
| Ignorar o handler OPTIONS | Sempre responda ao preflight com headers corretos |
| Liberar todos os metodos para todas as rotas | Limite metodos por rota conforme necessidade |
| Copiar config do enablecors.org direto | Entenda o risco e implemente validacao propria |
| Setar headers so no GET/POST sem OPTIONS | O navegador faz OPTIONS primeiro — sem resposta, nada funciona |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-headers-http-para-o-cors/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-headers-http-para-o-cors/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
