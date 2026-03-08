---
name: rs-seguranca-devs-alternativas-innerhtml
description: "Enforces safe DOM manipulation patterns when writing JavaScript/TypeScript frontend code that handles dynamic content. Use when user asks to 'manipulate the DOM', 'insert HTML', 'render dynamic content', 'build elements', 'update innerHTML', 'display user data in the page', or any task involving dynamic DOM construction. Applies rules: never use innerHTML with dynamic data, prefer innerText for text-only updates, use safe sinks (createElement/createTextNode/appendChild), use DOMPurify when HTML sanitization is unavoidable. Make sure to use this skill whenever generating code that modifies the DOM with user or API data. Not for server-side rendering, React/Vue/Angular component code (frameworks handle escaping), or static HTML generation."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: seguranca-para-devs
  module: frontend-security
  tags: [security, dom, innerhtml, xss, dom-injection, frontend, dompurify, safe-sinks]
---

# Alternativas a innerHTML — Manipulacao Segura do DOM

> Ao construir elementos DOM dinamicamente, use safe sinks (createElement, createTextNode, appendChild) em vez de innerHTML com dados dinamicos, porque innerHTML permite DOM Injection.

## Rules

1. **Nunca use innerHTML com dados dinamicos** — `element.innerHTML = variavel` permite injecao de codigo via atributos HTML como `onmouseover`, `onerror`, e ate sintaxes obscuras como backtick-invocacao (`` alert`1` `` executa codigo sem parenteses)
2. **Prefira innerText quando nao precisa de HTML** — `element.innerText = valor` escapa automaticamente todo HTML, eliminando qualquer possibilidade de DOM Injection
3. **Use safe sinks para construir HTML** — `createElement`, `createTextNode`, `appendChild`, `setAttribute` montam qualquer estrutura HTML sem risco de injecao
4. **innerHTML com string literal e seguro** — `element.innerHTML = ""` (sem dados dinamicos) nao tem superficie de ataque
5. **Nunca escreva seu proprio sanitizador** — use DOMPurify, porque existem vetores de ataque que voce nao conhece
6. **Siga a hierarquia de preferencia** — innerText > safe sinks > template engine > framework > DOMPurify

## How to write

### Safe sinks (padrao seguro)

```javascript
const container = document.querySelector('#results');
container.innerHTML = ''; // OK: string literal

for (const item of items) {
  const p = document.createElement('p');
  const bold = document.createElement('b');
  bold.innerText = item.name;
  const text = document.createTextNode(` (${item.year})`);
  p.appendChild(bold);
  p.appendChild(text);
  container.appendChild(p);
}
```

### DOMPurify quando HTML e inevitavel

```javascript
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(untrustedHTML);
element.innerHTML = cleanHTML;
```

## Example

**Before (vulneravel a DOM Injection):**
```javascript
let output = '';
for (const car of cars) {
  output += `<p><b>${car.model}</b> (${car.year})</p>`;
}
document.querySelector('#results').innerHTML = output;
// Se car.model = '<span onmouseover="alert(1)">' → executa codigo
```

**After (com safe sinks):**
```javascript
const results = document.querySelector('#results');
results.innerHTML = '';
for (const car of cars) {
  const p = document.createElement('p');
  const b = document.createElement('b');
  b.innerText = car.model;
  p.appendChild(b);
  p.appendChild(document.createTextNode(` (${car.year})`));
  results.appendChild(p);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar texto simples | `element.innerText = valor` |
| Construir estrutura HTML com dados dinamicos | Safe sinks: createElement + appendChild |
| Projeto usa React/Vue/Angular/Svelte | Use o template do framework (ja e seguro) |
| Precisa renderizar HTML de terceiros | DOMPurify.sanitize() antes de innerHTML |
| Limpar conteudo de um container | `element.innerHTML = ''` (seguro: literal) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `el.innerHTML = '<p>' + userData + '</p>'` | `const p = createElement('p'); p.innerText = userData` |
| `el.innerHTML = \`<b>${name}</b>\`` | `const b = createElement('b'); b.innerText = name` |
| `function sanitize(s) { return s.replace(/<script>/g, '') }` | `DOMPurify.sanitize(s)` |
| `el.innerHTML = input.replace(/</g, '&lt;')` | `el.innerText = input` |

## Troubleshooting

### Sanitizador customizado nao bloqueia ataque
**Symptom:** XSS funciona apesar de replace de `<script>` tags
**Cause:** Existem centenas de vetores que nao usam `<script>`: `onmouseover`, `onerror`, backtick invocation, SVG/MathML injection
**Fix:** Nunca escreva sanitizador proprio. Use `DOMPurify.sanitize()` ou safe sinks.

### innerText renderiza tags HTML literalmente
**Symptom:** Usuario ve `<b>texto</b>` em vez de **texto** na tela
**Cause:** innerText escapa HTML por design — e a protecao
**Fix:** Use safe sinks (createElement('b') + innerText para o conteudo) em vez de innerHTML.

## Deep reference library

- [deep-explanation.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alternativas-a-innerhtml/references/deep-explanation.md) — Superficie de ataque do innerHTML, backtick invocation, hierarquia de safe sinks
- [code-examples.md](../../../data/skills/seguranca-para-devs/rs-seguranca-para-devs-alternativas-a-innerhtml/references/code-examples.md) — Exemplos com listas, tabelas, DOMPurify configuracao
