---
name: rs-full-stack-formatacao-basica-de-textos
description: "Applies correct HTML text formatting tags when writing markup. Use when user asks to 'create HTML', 'write a page', 'format text', 'add emphasis', 'highlight text', or 'strikethrough'. Enforces semantic tag usage: strong for importance, em for emphasis, mark for relevance, s for obsolete content. Make sure to use this skill whenever generating HTML with inline text formatting. Not for CSS styling, typography, or font customization."
---

# Formatacao Basica de Textos em HTML

> Usar tags semanticas de formatacao pelo seu significado, nao pela aparencia visual.

## Rules

1. **Use `<strong>` para importancia** — nao para negrito visual, porque `strong` comunica importancia semantica para leitores de tela e motores de busca
2. **Use `<em>` para enfase** — nao para italico visual, porque `em` indica enfase na leitura do texto
3. **Use `<mark>` para relevancia contextual** — destaca trechos relevantes no contexto atual, como resultados de busca ou termos-chave
4. **Use `<s>` para conteudo nao mais valido** — indica que o texto existiu mas nao e mais relevante (strikethrough), porque comunica mudanca de informacao

## How to write

### Importancia (strong)

```html
<p>O prazo final e <strong>dia 15 de marco</strong>, sem excecoes.</p>
```

### Enfase (em)

```html
<p>Voce <em>precisa</em> confirmar antes de prosseguir.</p>
```

### Relevancia (mark)

```html
<p>Os resultados mostram que <mark>TypeScript</mark> foi a tecnologia mais citada.</p>
```

### Conteudo obsoleto (s)

```html
<p>Preco: <s>R$ 199,90</s> R$ 149,90</p>
```

## Example

**Before (tags escolhidas pela aparencia):**

```html
<p><b>Importante:</b> o sistema sera <i>atualizado</i> amanha.</p>
<p>Preco antigo: <del>R$ 50</del></p>
```

**After (tags escolhidas pelo significado):**

```html
<p><strong>Importante:</strong> o sistema sera <em>atualizado</em> amanha.</p>
<p>Preco antigo: <s>R$ 50</s></p>
```

## Heuristics

| Situacao | Tag |
|----------|-----|
| Destacar parte critica do texto | `<strong>` |
| Enfatizar uma palavra na leitura | `<em>` |
| Marcar termo relevante no contexto | `<mark>` |
| Texto que foi alterado ou nao vale mais | `<s>` |
| Texto removido em edicao colaborativa | `<del>` (nao `<s>`) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `<b>` para dar importancia | `<strong>` |
| `<i>` para dar enfase | `<em>` |
| `<s>` para decoracao visual | CSS `text-decoration: line-through` |
| `<strong>` em titulos inteiros | `<h1>`-`<h6>` para hierarquia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre semantica vs aparencia visual
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes