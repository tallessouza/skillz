---
name: rs-full-stack-style
description: "Enforces avoidance of inline HTML style attribute when writing HTML/CSS code. Use when user asks to 'style an element', 'add CSS', 'create HTML', 'build a page', or 'fix styling'. Warns against inline styles due to high specificity, recommends external/internal stylesheets instead. Make sure to use this skill whenever generating HTML with visual styling. Not for CSS architecture, preprocessors, or CSS-in-JS frameworks."
---

# Atributo Style (Inline CSS)

> Evite aplicar estilos diretamente na tag HTML via atributo `style` — use folhas de estilo externas ou internas.

## Rules

1. **Evite inline styles** — `style="color: red"` direto na tag tem especificidade altissima, porque sobrescreve quase qualquer outro CSS aplicado externamente, tornando manutencao dificil
2. **Prefira classes CSS** — aplique estilos via `class` e defina regras em arquivo `.css` ou tag `<style>`, porque permite reutilizacao e facilita alteracoes globais
3. **Reconheca inline styles em codigo legado** — sistemas existentes podem usar `style=""` extensivamente, porque entender o atributo e necessario para debugar e migrar codigo antigo
4. **Nunca adicione inline style em codigo novo** — mesmo para "teste rapido", porque cria debito tecnico que se espalha por imitacao

## How to write

### Forma correta (classe CSS)

```html
<!-- HTML -->
<p class="destaque">Texto importante</p>

<!-- CSS (arquivo separado ou tag <style>) -->
.destaque {
  color: red;
  font-weight: bold;
}
```

### Forma a evitar (inline style)

```html
<p style="color: red; font-weight: bold;">Texto importante</p>
```

## Example

**Before (inline style — evitar):**
```html
<h1 style="font-size: 32px; color: blue; margin-bottom: 16px;">Titulo</h1>
<p style="color: gray; line-height: 1.5;">Paragrafo de texto</p>
```

**After (com classes CSS):**
```html
<h1 class="page-title">Titulo</h1>
<p class="page-text">Paragrafo de texto</p>
```
```css
.page-title {
  font-size: 32px;
  color: blue;
  margin-bottom: 16px;
}
.page-text {
  color: gray;
  line-height: 1.5;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Gerando HTML novo | Sempre usar classes CSS |
| Encontrou inline style em codigo existente | Entender o que faz antes de remover |
| Prototipo rapido | Ainda prefira `<style>` no `<head>` |
| Email HTML (newsletter) | Inline style e aceitavel — clients de email nao suportam `<style>` bem |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div style="display: flex">` | `<div class="container">` + CSS externo |
| `<p style="color: red">` | `<p class="error-text">` + CSS externo |
| `<h1 style="font-size: 2rem">` | `<h1 class="heading-lg">` + CSS externo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre especificidade e por que inline styles sao problematicos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-style/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-style/references/code-examples.md)
