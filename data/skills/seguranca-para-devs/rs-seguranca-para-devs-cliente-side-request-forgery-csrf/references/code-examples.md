# Code Examples: Client-Side Request Forgery (CSRF)

## Exemplo 1: Aplicacao vulneravel completa (da aula)

```typescript
import express from 'express'

const app = express()

// Dados em memoria (normalmente viria do banco)
const environments = [
  { name: 'alpha', value: 'config-alpha' },
  { name: 'beta', value: 'config-beta' },
  { name: 'gamma', value: 'config-gamma' },
]

// Rota raiz — VULNERAVEL
app.get('/', (req, res) => {
  const env = req.query.env as string

  if (env) {
    // PROBLEMA: env vem direto da query string e vai para o action
    const environment = environments.find(e => e.name === env)
    res.send(`
      <h1>Edit: ${env}</h1>
      <form method="POST" action="/${env}">
        <input name="value" value="${environment?.value || ''}" />
        <button type="submit">Save</button>
      </form>
      <form method="POST" action="/${env}/delete">
        <button type="submit">Delete</button>
      </form>
    `)
  } else {
    // Lista de ambientes
    const list = environments.map(e =>
      `<li><a href="/?env=${e.name}">${e.name}</a></li>`
    ).join('')
    res.send(`<ul>${list}</ul>`)
  }
})

// Salvar ambiente
app.post('/:env', (req, res) => {
  // Salva o ambiente...
  res.send(`Saved ${req.params.env}`)
})

// Deletar ambiente — POST ao inves de DELETE (padrao REST quebrado)
app.post('/:env/delete', (req, res) => {
  // Deleta o ambiente...
  res.send(`Deleted ${req.params.env}`)
})
```

### Como o ataque funciona:

```
URL normal:    /?env=gamma        → action="/gamma"        → POST /gamma (salvar)
URL maliciosa: /?env=test/delete  → action="/test/delete"  → POST /test/delete (DELETAR!)
```

O atacante envia um email para funcionarios:
> "Observe o ambiente test/delete, os valores estao vazios. Preencha por favor."

O usuario clica, preenche, clica "Save", e na verdade esta deletando o ambiente "test".

## Exemplo 2: Defesa com validacao regex

```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string

  if (env) {
    // DEFESA: validar que env so contem caracteres alfanumericos
    if (!env.match(/^\w+$/)) {
      return res.status(400).send('Invalid environment name')
    }

    const environment = environments.find(e => e.name === env)
    res.send(`
      <form method="POST" action="/${env}">
        <input name="value" value="${environment?.value || ''}" />
        <button type="submit">Save</button>
      </form>
    `)
  }
})
```

Teste:
- `/?env=gamma` → passa no regex → formulario exibido
- `/?env=test/delete` → falha no regex (contem `/`) → "Invalid environment name"

## Exemplo 3: Defesa com dicionario (busca no banco)

```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string

  if (env) {
    // DEFESA: verificar se o ambiente existe no banco/dicionario
    const environment = environments.find(e => e.name === env)
    if (!environment) {
      return res.status(404).send('Environment not found')
    }

    // Seguro: environment.name vem do banco, nao do usuario
    res.send(`
      <form method="POST" action="/${environment.name}">
        <input name="value" value="${environment.value}" />
        <button type="submit">Save</button>
      </form>
    `)
  }
})
```

## Exemplo 4: Melhor defesa — action fixo + hidden field

```typescript
app.get('/', (req, res) => {
  const env = req.query.env as string

  if (env) {
    const environment = environments.find(e => e.name === env)
    if (!environment) {
      return res.status(404).send('Environment not found')
    }

    // MELHOR DEFESA: action fixo, nome no hidden field
    res.send(`
      <form method="POST" action="/env">
        <input type="hidden" name="envName" value="${environment.name}" />
        <input name="value" value="${environment.value}" />
        <button type="submit">Save</button>
      </form>
      <form method="POST" action="/env/delete">
        <input type="hidden" name="envName" value="${environment.name}" />
        <button type="submit">Delete</button>
      </form>
    `)
  }
})

// Rotas com action fixo
app.post('/env', (req, res) => {
  const envName = req.body.envName
  const environment = environments.find(e => e.name === envName)
  if (!environment) return res.status(404).send('Not found')
  // Salvar...
})

app.post('/env/delete', (req, res) => {
  const envName = req.body.envName
  const environment = environments.find(e => e.name === envName)
  if (!environment) return res.status(404).send('Not found')
  // Deletar...
})
```

## Exemplo 5: Caso do Facebook (reconstruido)

```javascript
// VULNERAVEL: hash da URL determina a acao
// URL: profile.php#profile.log
window.addEventListener('hashchange', () => {
  const action = location.hash.slice(1) // "profile.log"
  // POST para /ajax/profile/log — OK
  fetch(`/ajax/profile/${action}`, { method: 'POST' })
})

// ATAQUE: profile.php#/update_status?status=hello
// POST para /ajax/profile//update_status?status=hello
// Resultado: status do usuario atualizado sem consentimento
```

```javascript
// CORRIGIDO: validar o hash contra whitelist
const ALLOWED_ACTIONS = ['profile.log', 'profile.view', 'profile.edit']

window.addEventListener('hashchange', () => {
  const action = location.hash.slice(1)
  if (!ALLOWED_ACTIONS.includes(action)) {
    console.error('Invalid action:', action)
    return
  }
  fetch(`/ajax/profile/${action}`, { method: 'POST' })
})
```

## Exemplo 6: fetch no client-side (SPA moderna)

```typescript
// VULNERAVEL: URL dinamica sem validacao
async function loadResource(resourceId: string) {
  const response = await fetch(`/api/${resourceId}`)
  return response.json()
}
// Atacante pode passar: resourceId = "../admin/delete-all"

// SEGURO: validacao antes do fetch
async function loadResource(resourceId: string) {
  if (!resourceId.match(/^[a-zA-Z0-9-]+$/)) {
    throw new Error('Invalid resource ID')
  }
  const response = await fetch(`/api/${resourceId}`)
  return response.json()
}
```