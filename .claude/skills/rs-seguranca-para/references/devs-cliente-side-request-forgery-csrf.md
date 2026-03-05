---
name: rs-seguranca-devs-csrf-client-side
description: "Enforces defenses against Client-Side Request Forgery (CSRF) when building forms, links, or fetch calls with dynamic URLs. Use when user asks to 'create a form', 'build an endpoint', 'add a delete button', 'handle dynamic routes', or any server/client code with dynamic action/href/fetch targets. Applies rules: never use dynamic form actions without validation, use dictionaries or whitelists for destinations, validate dynamic URL segments with regex. Make sure to use this skill whenever generating code that constructs URLs dynamically from user input or query parameters. Not for authentication, session management, or CORS configuration."
---

# Client-Side Request Forgery (CSRF)

> Toda URL montada dinamicamente e um vetor de ataque — valide o destino antes de navegar, submeter ou fazer fetch.

## Rules

1. **Evite actions/hrefs/fetch dinamicos** — use destinos fixos com dados em campos hidden, porque URLs dinamicas permitem que um atacante injete caminhos maliciosos no action do formulario
2. **Use dicionario de destinos validos** — busque no banco ou em memoria os valores permitidos antes de montar a URL, porque isso elimina valores inventados pelo atacante
3. **Use whitelist quando possivel** — mantenha uma lista explicita de destinos aceitos, porque restringe o universo de valores a um conjunto conhecido
4. **Valide com regex como ultima alternativa** — `if (!value.match(/^\w+$/)) return res.send('Invalid')`, porque regex e fragil mas ainda melhor que nenhuma validacao
5. **Nunca confie em query string para montar destinos** — o conteudo da query string e controlado pelo atacante, porque qualquer usuario pode ser induzido a clicar em um link com query string maliciosa
6. **Aplique a mesma logica para server-side e client-side** — fetch no client, action de formulario, href de link — todos seguem as mesmas 4 defesas, porque o vetor de ataque e identico

## How to write

### Formulario seguro (action fixo + hidden field)

```typescript
// CORRETO: action fixo, nome do recurso em campo hidden
app.get('/env', (req, res) => {
  const envName = req.query.env as string
  // Validar contra dicionario (banco de dados)
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

### Validacao com regex (quando dinamico e inevitavel)

```typescript
app.get('/env', (req, res) => {
  const env = req.query.env as string
  if (!env.match(/^\w+$/)) {
    return res.status(400).send('Invalid environment name')
  }
  // Seguro: env so contem caracteres alfanumericos
  res.send(`<form method="POST" action="/${env}">...</form>`)
})
```

## Example

**Before (vulneravel — action dinamico sem validacao):**

```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string
  if (env) {
    // PERIGO: atacante pode enviar env=test/delete
    // O formulario fara POST para /test/delete
    res.send(`
      <form method="POST" action="/${env}">
        <button type="submit">Save</button>
      </form>
      <form method="POST" action="/${env}/delete">
        <button type="submit">Delete</button>
      </form>
    `)
  }
})
```

**After (com validacao e action fixo):**

```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string
  if (env) {
    const environment = environments.find(e => e.name === env)
    if (!environment) return res.status(404).send('Environment not found')

    res.send(`
      <form method="POST" action="/env">
        <input type="hidden" name="envName" value="${environment.name}" />
        <button type="submit">Save</button>
      </form>
      <form method="POST" action="/env/delete">
        <input type="hidden" name="envName" value="${environment.name}" />
        <button type="submit">Delete</button>
      </form>
    `)
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Form action vem de query string | Valide contra banco/dicionario, prefira action fixo |
| Link href montado com dados do usuario | Use whitelist ou dicionario |
| fetch/XMLHttpRequest com URL dinamica no client | Mesmas 4 defesas: fixo > dicionario > whitelist > regex |
| DELETE via POST com path dinamico | Use action fixo + hidden field com o identificador |
| Hash da URL usada para determinar acao (SPA) | Valide o hash antes de executar a acao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `action="/${req.query.env}"` | `action="/env"` + `<input hidden name="envName">` |
| `fetch(\`/api/${userInput}/delete\`)` | Valide `userInput` contra whitelist antes do fetch |
| `<a href="/${dynamicPath}">` sem validacao | Valide `dynamicPath` com regex ou dicionario |
| POST para `/${name}/delete` com name dinamico | POST para `/env/delete` com name no body |
| Mostrar formulario mesmo sem encontrar recurso | Retorne 404 se o recurso nao existe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-cliente-side-request-forgery-csrf/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-cliente-side-request-forgery-csrf/references/code-examples.md)
