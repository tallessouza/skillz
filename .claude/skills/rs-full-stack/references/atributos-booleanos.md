---
name: rs-full-stack-atributos-booleanos
description: "Enforces correct usage of HTML boolean attributes when writing markup. Use when user asks to 'create HTML', 'write a template', 'add an attribute', 'hide an element', or 'build a form'. Applies rules: boolean attributes need no value, hidden removes element from page, redundant value syntax is valid but unnecessary. Make sure to use this skill whenever generating HTML with boolean attributes like hidden, disabled, required, checked, readonly. Not for CSS visibility, JavaScript DOM manipulation, or ARIA attributes."
---

# Atributos Booleanos em HTML

> Atributos booleanos indicam presenca ou ausencia — escreva apenas o nome do atributo, sem valor.

## Rules

1. **Escreva apenas o nome do atributo** — `hidden` nao `hidden="true"`, porque a mera presenca do atributo ja significa verdadeiro
2. **Nunca use `="true"` ou `="false"`** — `hidden="false"` NAO esconde, o HTML interpreta qualquer valor presente como verdadeiro, porque booleanos HTML nao sao strings
3. **Remova o atributo para desativar** — a ausencia do atributo e o unico "false", porque nao existe sintaxe para negar um booleano em HTML
4. **Aceite a sintaxe redundante sem panico** — `hidden="hidden"` e valido e funciona igual, porque o HTML spec permite repetir o nome como valor

## How to write

### Atributos booleanos comuns

```html
<!-- Esconder elemento da pagina -->
<p hidden>Este paragrafo nao aparece</p>

<!-- Campo obrigatorio -->
<input type="email" required>

<!-- Botao desabilitado -->
<button disabled>Enviar</button>

<!-- Checkbox marcado -->
<input type="checkbox" checked>

<!-- Campo somente leitura -->
<input type="text" value="fixo" readonly>
```

## Example

**Before (erro comum):**
```html
<input type="text" disabled="true">
<p hidden="false">Texto que deveria aparecer</p>
<input type="checkbox" checked="yes">
```

**After (com esta skill aplicada):**
```html
<input type="text" disabled>
<p>Texto que aparece normalmente</p>
<input type="checkbox" checked>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Atributo sem valor possivel (hidden, disabled, required) | Escreva so o nome |
| Precisa desativar o atributo | Remova-o do elemento |
| Encontrou `hidden="hidden"` em codigo legado | Aceite, funciona igual, mas prefira so `hidden` |
| Quer esconder com condicao dinamica | Use JavaScript para add/remove o atributo |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `hidden="true"` | `hidden` |
| `hidden="false"` | (remova o atributo) |
| `disabled="disabled"` | `disabled` |
| `required="yes"` | `required` |
| `checked="checked"` | `checked` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre booleanos HTML e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atributos-booleanos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atributos-booleanos/references/code-examples.md)
