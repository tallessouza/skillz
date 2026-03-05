---
name: rs-full-stack-aninhamento-de-tags
description: "Enforces correct HTML tag nesting and parent-child relationships when writing HTML markup. Use when user asks to 'create HTML', 'write a page', 'add elements', 'nest tags', or 'fix HTML structure'. Applies rules: proper open/close order (LIFO), parent-child hierarchy, inline elements inside block elements. Make sure to use this skill whenever generating or reviewing HTML markup. Not for CSS styling, JavaScript logic, or framework-specific templating."
---

# Aninhamento de Tags HTML

> Ao aninhar tags HTML, feche sempre na ordem inversa da abertura — a ultima tag aberta e a primeira a fechar.

## Rules

1. **Feche na ordem inversa (LIFO)** — se abriu `<p>` depois `<strong>`, feche `</strong>` antes de `</p>`, porque o HTML usa uma estrutura de pilha e fechar fora de ordem gera markup invalido
2. **Identifique pai e filhos** — a tag externa e o pai, as internas sao filhas, porque essa hierarquia define o DOM e afeta CSS/JS
3. **Aninhe inline dentro de block** — `<em>`, `<strong>`, `<span>` vivem dentro de `<p>`, `<div>`, `<section>`, porque o modelo de conteudo HTML exige isso
4. **Nao confie no browser para corrigir** — HTML mal aninhado pode renderizar "ok" visualmente mas causa bugs silenciosos em CSS e JS, porque o browser tenta corrigir mas nem sempre acerta
5. **Indente para visualizar a hierarquia** — cada nivel de aninhamento ganha um nivel de indentacao, porque torna erros de fechamento visiveis antes de executar

## How to write

### Aninhamento correto (pai > filhos)

```html
<p>
  Texto com <em>enfase</em> e <strong>negrito</strong> no paragrafo.
</p>
```

### Multiplos niveis

```html
<div>
  <p>
    Texto com <strong>negrito e <em>enfase dentro</em></strong>.
  </p>
</div>
```

## Example

**Before (erro de aninhamento):**
```html
<p>Texto com <strong>negrito</p></strong>
```

**After (com esta skill aplicada):**
```html
<p>Texto com <strong>negrito</strong></p>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tag inline dentro de paragrafo | `<p>texto <em>enfase</em></p>` — feche a inline antes do block |
| Varios niveis de aninhamento | Indente cada nivel e confira fechamento de dentro pra fora |
| Duvida se esta correto | Leia de dentro pra fora: cada tag filha fecha antes da pai? |
| Browser renderiza ok mas HTML parece errado | Valide a estrutura — browser corrige silenciosamente |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<p><strong>texto</p></strong>` | `<p><strong>texto</strong></p>` |
| `<em><p>texto</em></p>` | `<p><em>texto</em></p>` |
| Tags abertas sem fechamento correspondente | Sempre pares: `<tag>...</tag>` |
| Aninhamento sem indentacao | Indente cada nivel para visualizar hierarquia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia pai-filho, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-aninhamento-de-tags/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-aninhamento-de-tags/references/code-examples.md)
