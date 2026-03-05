---
name: rs-full-stack-caracteres-reservados-1
description: "Enforces correct usage of HTML entity references for reserved characters when writing HTML code. Use when user asks to 'display HTML tags as text', 'show code snippets in HTML', 'escape HTML characters', or 'print angle brackets'. Applies rules: use &lt; &gt; &amp; entities, wrap code display in <code> tag. Make sure to use this skill whenever generating HTML that must display reserved characters literally. Not for CSS, JavaScript escaping, or URL encoding."
---

# Caracteres Reservados no HTML

> Ao exibir caracteres reservados do HTML como texto visivel, use entidades HTML — nunca insira os caracteres brutos no formato de tag.

## Rules

1. **Use `&lt;` para `<` e `&gt;` para `>`** — porque o browser interpreta `<` seguido de letra como abertura de tag, quebrando o layout
2. **Use `&amp;` para `&`** — porque `&` inicia uma entidade HTML; sem escapar, sequencias como `&gt;` viram o proprio caractere `>`
3. **Envolva codigo exibido na tag `<code>`** — porque aplica fonte monospacada e sinaliza semanticamente que aquele trecho e codigo
4. **Caracteres `<` e `>` isolados (com espacos) nao causam problema** — o browser so interpreta como tag quando esta no formato `<letra`; mesmo assim, prefira entidades por consistencia
5. **Ordem de escape: `&` primeiro, depois `<` e `>`** — porque se voce escapar `<` antes de `&`, um `&amp;lt;` literal vira `&lt;` na tela (duplo escape)

## How to write

### Exibindo uma tag HTML como texto

```html
<p>A tag <code>&lt;p&gt;</code> cria um paragrafo.</p>
```

### Exibindo entidades como texto

```html
<!-- Para mostrar "&gt;" literalmente na tela -->
<p>Use <code>&amp;gt;</code> para exibir o sinal de maior.</p>
```

### Tabela de entidades essenciais

```html
<!-- Referencia rapida -->
<!-- &lt;   → <  (less than)    -->
<!-- &gt;   → >  (greater than) -->
<!-- &amp;  → &  (ampersand)    -->
<!-- &quot; → "  (aspas duplas) -->
<!-- &apos; → '  (apostrofo)   -->
```

## Example

**Before (caracteres reservados brutos — quebra a renderizacao):**

```html
<p>Use a tag <p> para criar paragrafos.</p>
```

**After (com entidades HTML — renderiza corretamente):**

```html
<p>Use a tag <code>&lt;p&gt;</code> para criar paragrafos.</p>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Exibir tag HTML como texto | `&lt;tag&gt;` dentro de `<code>` |
| Exibir entidade como texto | Escape o `&` com `&amp;` — ex: `&amp;lt;` |
| `<` ou `>` sozinhos com espaco | Funciona sem escape, mas prefira entidade por seguranca |
| Bloco de codigo multi-linha | Use `<pre><code>` com todas as entidades escapadas |
| Conteudo gerado dinamicamente | Escape server-side antes de inserir no HTML |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<p>A tag <p> cria...` | `<p>A tag &lt;p&gt; cria...` |
| `<p>Use &gt; no codigo` (querendo mostrar `&gt;` literal) | `<p>Use &amp;gt; no codigo` |
| Tag de codigo sem `<code>` | Envolva em `<code>&lt;p&gt;</code>` |
| `&amp;amp;` (escape duplo acidental) | Escape apenas uma vez: `&amp;` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando e por que escapar, edge cases com formato de tag vs caractere isolado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes