---
name: rs-seguranca-devs-alternativas-innerhtml
description: "Enforces safe DOM manipulation patterns when writing JavaScript/TypeScript frontend code. Use when user asks to 'manipulate the DOM', 'insert HTML', 'render dynamic content', 'build elements', 'update innerHTML', or any task involving dynamic DOM construction. Applies rules: never use innerHTML with dynamic data, prefer innerText, use safe sinks (createElement/createTextNode/appendChild), use DOMPurify when HTML sanitization is unavoidable. Make sure to use this skill whenever generating code that modifies the DOM with user or API data. Not for server-side rendering, React/Vue/Angular component code, or static HTML generation."
---

# Alternativas a innerHTML — Manipulacao Segura do DOM

> Ao construir elementos DOM dinamicamente, use safe sinks (createElement, createTextNode, appendChild) em vez de innerHTML com dados dinamicos, porque innerHTML permite DOM Injection.

## Rules

1. **Nunca use innerHTML com dados dinamicos** — `element.innerHTML = variavel` permite injecao de codigo via atributos HTML como `onmouseover`, `onerror`, e ate sintaxes obscuras como backtick-invocacao de funcoes, porque a superficie de ataque e enorme demais para escapar manualmente
2. **Prefira innerText quando nao precisa de HTML** — `element.innerText = valor` escapa automaticamente todo HTML, eliminando qualquer possibilidade de DOM Injection
3. **Use safe sinks para construir HTML** — `createElement`, `createTextNode`, `appendChild`, `setAttribute` montam qualquer estrutura HTML sem risco de injecao
4. **innerHTML com string literal e seguro** — `element.innerHTML = ""` (sem dados dinamicos) nao tem superficie de ataque, porque nao ha conteudo externo
5. **Nunca escreva seu proprio sanitizador** — use DOMPurify, porque existem vetores de ataque que voce nao conhece (ex: `` alert`1` `` executa codigo sem parenteses)
6. **Siga a hierarquia de preferencia** — innerText > safe sinks > template engine > framework > DOMPurify, nessa ordem

## How to write

### Safe sinks (padrao seguro)

```javascript
const container = document.querySelector('#results');
container.innerHTML = ''; // OK: string literal, sem dados dinamicos

for (const item of items) {
  const p = document.createElement('p');
  const bold = document.createElement('b');
  bold.innerText = item.name; // innerText: seguro
  const text = document.createTextNode(` (${item.year})`);
  p.appendChild(bold);
  p.appendChild(text);
  container.appendChild(p);
}
```

### innerText para valores simples

```javascript
// Quando so precisa atualizar texto, sem estrutura HTML
document.querySelector('#username').innerText = user.name;
document.querySelector('#status').innerText = order.status;
```

### DOMPurify quando HTML e inevitavel

```javascript
import DOMPurify from 'dompurify';

// Quando PRECISA renderizar HTML vindo de fora (ex: CMS, editor rich text)
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
  const yearText = document.createTextNode(` (${car.year})`);
  p.appendChild(b);
  p.appendChild(yearText);
  results.appendChild(p);
}
// Mesmo com car.model malicioso, innerText escapa tudo
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atualizar texto simples na tela | `element.innerText = valor` |
| Construir estrutura HTML com dados dinamicos | Safe sinks: createElement + appendChild |
| Projeto ja usa React/Vue/Angular/Svelte | Use o template do framework (ja e seguro) |
| Precisa renderizar HTML de terceiros (CMS, WYSIWYG) | DOMPurify.sanitize() antes de innerHTML |
| Limpar conteudo de um container | `element.innerHTML = ''` (seguro: literal) |
| Template simples com poucos elementos | Safe sinks (8 linhas > vulnerabilidade) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `el.innerHTML = '<p>' + userData + '</p>'` | `const p = createElement('p'); p.innerText = userData` |
| `el.innerHTML = \`<b>${name}</b>\`` | `const b = createElement('b'); b.innerText = name` |
| `function sanitize(s) { return s.replace(/<script>/g, '') }` | `DOMPurify.sanitize(s)` |
| `el.innerHTML = input.replace(/</g, '&lt;')` | `el.innerText = input` (ou safe sinks) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/seguranca-para/rs-seguranca-para-devs-alternativas-a-innerhtml/references/deep-explanation.md)
- [Code examples](../../../data/skills/seguranca-para/rs-seguranca-para-devs-alternativas-a-innerhtml/references/code-examples.md)
