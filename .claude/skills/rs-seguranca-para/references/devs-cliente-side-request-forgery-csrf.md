---
name: rs-seguranca-devs-csrf-client-side
description: "Enforces defenses against Client-Side Request Forgery (CSRF) when building forms, links, or fetch calls with dynamic URLs constructed from user input. Use when user asks to 'create a form', 'build an endpoint', 'add a delete button', 'handle dynamic routes', 'construct URL from query parameter', or any code with dynamic action/href/fetch targets. Applies rules: never use dynamic form actions without validation, use dictionaries or whitelists for URL destinations, validate dynamic URL segments with regex, prefer fixed action with hidden fields. Make sure to use this skill whenever generating code that constructs URLs dynamically from user input or query parameters. Not for server-side CSRF tokens (use devs-cross-site-request-forgery-csrf), session management, or CORS configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: frontend-security
  tags: [security, csrf, client-side, form-action, dynamic-url, request-forgery]
---

# Client-Side Request Forgery (CSRF)

> Toda URL montada dinamicamente e um vetor de ataque — valide o destino antes de navegar, submeter ou fazer fetch.

## Rules

1. **Evite actions/hrefs/fetch dinamicos** — use destinos fixos com dados em campos hidden, porque URLs dinamicas permitem que um atacante injete caminhos maliciosos
2. **Use dicionario de destinos validos** — busque no banco ou em memoria os valores permitidos antes de montar a URL, porque elimina valores inventados pelo atacante
3. **Use whitelist quando possivel** — mantenha lista explicita de destinos aceitos
4. **Valide com regex como ultima alternativa** — `if (!value.match(/^\w+$/)) return res.send('Invalid')`, porque regex e fragil mas melhor que nenhuma validacao
5. **Nunca confie em query string para montar destinos** — o conteudo da query string e controlado pelo atacante
6. **Aplique a mesma logica para server-side e client-side** — fetch no client, action de formulario, href de link — todos seguem as mesmas 4 defesas

## How to write

### Formulario seguro (action fixo + hidden field)

```typescript
app.get('/env', (req, res) => {
  const envName = req.query.env as string
  const environment = environments.find(e => e.name === envName)
  if (!environment) return res.status(404).send('Environment not found')

  res.send(`
    <form method="POST" action="/env">
      <input type="hidden" name="envName" value="${environment.name}" />
      <input name="value" value="${environment.value}" />
      <button type="submit">Save</button>
    </form>
  `)
})
```

### Validacao com regex

```typescript
app.get('/env', (req, res) => {
  const env = req.query.env as string
  if (!env.match(/^\w+$/)) {
    return res.status(400).send('Invalid environment name')
  }
  res.send(`<form method="POST" action="/${env}">...</form>`)
})
```

## Example

**Before (vulneravel — action dinamico sem validacao):**
```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string
  // PERIGO: atacante pode enviar env=test/delete
  res.send(`<form method="POST" action="/${env}">...</form>`)
})
```

**After (com validacao e action fixo):**
```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string
  const environment = environments.find(e => e.name === env)
  if (!environment) return res.status(404).send('Not found')
  res.send(`
    <form method="POST" action="/env">
      <input type="hidden" name="envName" value="${environment.name}" />
      <button type="submit">Save</button>
    </form>
  `)
})
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `action="/${req.query.env}"` | `action="/env"` + `<input hidden name="envName">` |
| `fetch(\`/api/${userInput}/delete\`)` | Valide `userInput` contra whitelist antes do fetch |
| `<a href="/${dynamicPath}">` sem validacao | Valide `dynamicPath` com regex ou dicionario |
| Mostrar formulario sem encontrar recurso | Retorne 404 se o recurso nao existe |

## Troubleshooting

### Formulario submete para URL inesperada
**Symptom:** POST vai para endpoint errado ou inexistente
**Cause:** Action do formulario montado com query string nao validada, atacante injetou path traversal
**Fix:** Use action fixo (ex: `/env`) e passe o identificador como hidden field. Valide o hidden field no handler do POST contra o banco de dados.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-cliente-side-request-forgery-csrf/references/deep-explanation.md) — 4 niveis de defesa (fixo > dicionario > whitelist > regex), ataques via hash/SPA
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-cliente-side-request-forgery-csrf/references/code-examples.md) — Exemplos com Express, fetch client-side, SPA routing
