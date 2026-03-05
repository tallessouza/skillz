---
name: rs-full-stack-representacao-codigo
description: "Applies correct HTML code representation using code, pre, and HTML entity encoding when writing markup. Use when user asks to 'display code in HTML', 'show code snippet', 'render HTML tags as text', 'format code block', or 'represent source code on a page'. Ensures proper nesting of code inside pre, and escaping of angle brackets with HTML entities. Make sure to use this skill whenever generating HTML that displays source code. Not for syntax highlighting libraries, markdown rendering, or server-side code formatting."
---

# Representacao de Codigo de Computador em HTML

> Use `<code>` para marcar texto como codigo e `<pre>` para preservar formatacao, sempre escapando angle brackets com HTML entities.

## Rules

1. **Use `<code>` para inline code** — aplica fonte monospace ao texto, porque diferencia visualmente codigo de prosa
2. **Envolva `<code>` dentro de `<pre>` para blocos** — `<pre>` preserva espacos, tabs e quebras de linha, porque sem ele o browser colapsa whitespace
3. **Escape `<` com `&lt;`** — sempre que exibir tags HTML como texto, porque o browser interpreta `<` como inicio de tag real
4. **Escape `>` com `&gt;` por boa pratica** — mesmo que o browser consiga inferir em alguns casos, porque garante consistencia e evita ambiguidade
5. **Nunca coloque HTML cru dentro de `<code>`** — o browser vai interpretar como markup real, nao como texto visivel

## How to write

### Bloco de codigo HTML exibido como texto

```html
<pre><code>&lt;pre&gt;
  &lt;code&gt;Exemplo de codigo&lt;/code&gt;
&lt;/pre&gt;</code></pre>
```

### Codigo inline no meio de texto

```html
<p>Use a tag <code>&lt;pre&gt;</code> para preservar formatacao.</p>
```

## Example

**Before (codigo interpretado como HTML):**
```html
<pre><code>
  <pre>
    <code>Texto aqui</code>
  </pre>
</code></pre>
```
O browser interpreta as tags internas como HTML real — quebra a exibicao.

**After (com entities corretas):**
```html
<pre><code>
  &lt;pre&gt;
    &lt;code&gt;Texto aqui&lt;/code&gt;
  &lt;/pre&gt;
</code></pre>
```
O browser exibe as tags como texto visivel.

## Heuristics

| Situation | Do |
|-----------|-----|
| Exibir snippet de codigo em pagina HTML | `<pre><code>` com entities escapadas |
| Mencionar tag inline no meio de paragrafo | `<code>&lt;tag&gt;</code>` |
| Codigo sem tags HTML (ex: JS puro) | `<pre><code>` sem necessidade de entities |
| Preservar indentacao e quebras de linha | Obrigatorio usar `<pre>` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<code><div>texto</div></code>` | `<code>&lt;div&gt;texto&lt;/div&gt;</code>` |
| `<code>` sozinho para bloco multi-linha | `<pre><code>...</code></pre>` |
| `<pre>` sem `<code>` para codigo | `<pre><code>...</code></pre>` |
| Escapar apenas `<` e ignorar `>` | Escapar ambos: `&lt;` e `&gt;` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre entities HTML e comportamento do browser
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-representacao-de-codigo-de-computador/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-representacao-de-codigo-de-computador/references/code-examples.md)
