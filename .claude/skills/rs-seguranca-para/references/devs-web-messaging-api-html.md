---
name: rs-seguranca-devs-web-messaging-api
description: "Enforces secure postMessage usage when writing code with iframes, window communication, or Web Messaging API. Use when user asks to 'send messages between iframes', 'communicate between windows', 'use postMessage', 'embed iframe', or 'cross-origin messaging'. Applies rules: always specify target origin, validate message origin with whitelist, never use eval with received messages. Make sure to use this skill whenever generating code involving window.postMessage, iframe communication, or cross-window messaging. Not for WebSocket, Server-Sent Events, or HTTP request security."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: frontend-security
  tags: [security, postmessage, iframe, cross-origin]
---

# Web Messaging API — Seguranca

> Ao usar postMessage entre janelas ou iframes, sempre especifique o destino, valide a origem, e nunca use eval com dados recebidos.

## Rules

1. **Sempre especifique a origem destino no postMessage** — use `'https://meusite.com'` nunca `'*'`, porque asterisco permite que qualquer iframe malicioso receba suas mensagens
2. **Valide a origem das mensagens recebidas com whitelist** — compare `event.origin` contra uma lista exata de origens permitidas, porque um atacante pode criar subdominios como `meusite.com.hacker.com` para enganar validacoes parciais
3. **Nunca use eval com dados recebidos via postMessage** — eval amplia drasticamente a superficie de ataque, porque permite execucao arbitraria de codigo caso o remetente seja comprometido
4. **Nunca valide origem com includes ou indexOf** — `event.origin.includes('meusite.com')` aceita `meusite.com.hacker.com`, porque a verificacao parcial nao garante que o dominio e legitimo
5. **Restrinja acoes recebidas a um conjunto conhecido** — use if/switch para aceitar apenas mensagens esperadas (`'add'`, `'remove'`), porque mesmo um iframe legitimo comprometido fica limitado ao que voce permitiu
6. **Considere frame-ancestors no CSP** — se sua aplicacao nao precisa ser embeddada por terceiros, use `frame-ancestors 'self'` ou liste dominios especificos, porque impede que atacantes carreguem sua pagina em iframes maliciosos

## How to write

### Envio seguro de mensagens

```typescript
// Sempre especifique o destino exato
const iframe = document.querySelector('iframe')
iframe.contentWindow.postMessage('callback', 'https://chat.meusite.com')

// Do iframe para o pai — especifique o dominio pai
window.parent.postMessage('add', 'https://meusite.com')
```

### Recepcao segura com whitelist

```typescript
const ALLOWED_ORIGINS = [
  'https://meusite.com',
  'https://chat.meusite.com'
]

window.addEventListener('message', (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    return // ignora mensagens de origens desconhecidas
  }

  // Trate apenas mensagens conhecidas — nunca eval
  switch (event.data) {
    case 'add':
      incrementCounter()
      break
    case 'remove':
      decrementCounter()
      break
    default:
      console.warn('Mensagem desconhecida:', event.data)
  }
})
```

### Validacao com regex (quando necessario subdominos)

```typescript
// Garanta que termina com .meusite.com ou e exatamente meusite.com
const ORIGIN_PATTERN = /^https:\/\/([a-z0-9-]+\.)*meusite\.com$/

window.addEventListener('message', (event) => {
  if (!ORIGIN_PATTERN.test(event.origin)) return
  handleMessage(event.data)
})
```

## Example

**Before (vulneravel):**
```typescript
// Envia para qualquer destino
iframe.contentWindow.postMessage(data, '*')

// Recebe de qualquer origem e executa com eval
window.addEventListener('message', (event) => {
  eval(event.data)
})
```

**After (seguro):**
```typescript
// Envia para destino especifico
iframe.contentWindow.postMessage(data, 'https://chat.meusite.com')

// Valida origem e restringe acoes
window.addEventListener('message', (event) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) return

  if (event.data === 'increment') {
    incrementCounter()
  }
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| iframe no mesmo dominio | Use `'self'` no frame-ancestors e especifique origem no postMessage |
| iframe em subdominio proprio | Whitelist com origens exatas, nunca includes |
| Aplicacao embeddavel por terceiros | Nao pode usar frame-ancestors none, entao valide origens rigorosamente |
| Chatbot em iframe de outro dominio | Whitelist do dominio do chatbot, restrinja mensagens a acoes conhecidas |
| Multiplas janelas da mesma aplicacao | Mesmo principio: origem especifica no envio, whitelist na recepcao |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `postMessage(data, '*')` | `postMessage(data, 'https://dominio-alvo.com')` |
| `eval(event.data)` | `if (event.data === 'action') handleAction()` |
| `event.origin.includes('meusite')` | `ALLOWED_ORIGINS.includes(event.origin)` |
| `event.origin.indexOf('meusite') > -1` | `ORIGIN_PATTERN.test(event.origin)` |
| Aceitar qualquer mensagem sem filtro | Switch/if com mensagens conhecidas |
| Confiar em `event.data` como codigo | Tratar `event.data` como dado, nunca como codigo |

## Troubleshooting

### Configuracao ou implementacao nao funciona como esperado
**Symptom:** Comportamento inesperado ao aplicar as regras desta skill
**Cause:** Configuracao parcial ou conflito com outras regras de seguranca
**Fix:** Verifique que todas as regras foram aplicadas em conjunto. Consulte o deep-explanation.md para entender o raciocinio completo do instrutor.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-web-messaging-api-html/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-web-messaging-api-html/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
