---
name: rs-seguranca-devs-prototype-pollution
description: "Guards against JavaScript Prototype Pollution vulnerabilities when writing merge functions, object manipulation, or processing user input. Use when user asks to 'deep merge objects', 'merge user input', 'update object properties dynamically', 'parse JSON payload', or 'handle untrusted data'. Applies rules: never use DeepMerge without __proto__ filtering, never trust client input, never expose secrets to client. Make sure to use this skill whenever writing code that merges or spreads untrusted data into objects. Not for general XSS, SQL injection, or non-JavaScript security topics."
---

# Prototype Pollution

> Ao manipular objetos JavaScript com dados externos, filtre sempre propriedades de protótipo antes de qualquer merge ou atribuição dinâmica.

## Rules

1. **Evite DeepMerge quando possível** — se o objeto é flat (sem objetos aninhados), use spread ou `Object.assign`, porque DeepMerge abre superfície de ataque desnecessária
2. **Filtre `__proto__` em todo merge recursivo** — antes de copiar uma chave, teste `if (key === '__proto__') continue`, porque um atacante pode injetar `__proto__` no payload JSON e poluir o protótipo de todos os objetos da aplicação
3. **Filtre também `constructor` e `prototype`** — são vetores alternativos de Prototype Pollution, porque permitem acesso indireto ao protótipo
4. **Nunca confie em input do cliente** — toda lógica de negócio e validação deve ser replicada no servidor, porque o console do navegador dá acesso total ao atacante
5. **Nunca transmita segredos para o cliente** — chaves de API, endpoints secretos e credenciais ficam exclusivamente no servidor, porque JavaScript no navegador é território do atacante
6. **Use HTTPS/TLS em vez de criptografia no cliente** — não criptografe dados no JavaScript do navegador, porque Let's Encrypt torna HTTPS trivial e a criptografia client-side é contornável

## How to write

### DeepMerge seguro

```typescript
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  for (const key of Object.keys(source)) {
    // BLOCK: propriedades que poluem o protótipo
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      console.warn(`Tentativa de Prototype Pollution detectada: chave "${key}"`)
      continue
    }

    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}
```

### Alternativa sem DeepMerge (objetos flat)

```typescript
// Para coleções simples (nome, idade, etc.), spread é suficiente
function updatePessoa(id: string, payload: string) {
  const novosDados = JSON.parse(payload)
  const { __proto__, constructor, prototype, ...safeDados } = novosDados
  pessoas[id] = { ...pessoas[id], ...safeDados }
}
```

### Object.create(null) para configs

```typescript
// Objetos sem protótipo — imunes a Prototype Pollution
const config = Object.create(null)
config.theme = 'dark'
config.backend = 'https://api.exemplo.com'
```

## Example

**Before (vulnerável):**
```typescript
function updatePessoa(id: string, payload: string) {
  const novosDados = JSON.parse(payload)
  if (pessoas[id]) {
    pessoas[id] = deepMerge(pessoas[id], novosDados)
  }
}

// Atacante envia:
updatePessoa('1', '{"idade": 34, "__proto__": {"admin": true}}')
// Agora TODOS os objetos têm .admin === true
// Objetos vazios: ({}).admin === true
```

**After (com esta skill aplicada):**
```typescript
function updatePessoa(id: string, payload: string) {
  const novosDados = JSON.parse(payload)
  if (pessoas[id]) {
    pessoas[id] = safeDeepMerge(pessoas[id], novosDados)
  }
}

// Atacante envia o mesmo payload, mas __proto__ é filtrado
// ({}).admin === undefined — protótipo intacto
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Objeto flat (sem propriedades aninhadas) | Use spread/Object.assign, evite DeepMerge |
| Precisa de merge recursivo | Filtre `__proto__`, `constructor`, `prototype` |
| Recebendo JSON de input do usuário | Sanitize antes de merge, logue tentativas suspeitas |
| Configuração com fallback | Use `Object.create(null)` para o objeto base |
| Dados sensíveis (chaves API, tokens) | Mantenha exclusivamente no servidor |
| Node.js server recebendo JSON | Prioridade máxima: poluição afeta TODAS as requisições |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `deepMerge(target, userInput)` sem filtro | `safeDeepMerge(target, userInput)` com filtro de `__proto__` |
| `obj[key] = value` com key de user input | Validar key contra allowlist antes de atribuir |
| Segredos em variáveis JS no front-end | Segredos exclusivamente em variáveis de ambiente no servidor |
| Criptografia de senha no JavaScript do navegador | HTTPS/TLS para toda comunicação |
| `if (user.admin)` sem validação server-side | Validar permissões no servidor, nunca confiar no client |
| Bibliotecas de merge sem proteção contra proto | Lodash `_.merge` (tem proteção) ou merge manual com filtro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-object-prototype-pollution/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-object-prototype-pollution/references/code-examples.md)
