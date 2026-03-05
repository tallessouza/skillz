---
name: rs-full-stack-input-number
description: "Applies HTML input number best practices when writing form fields with numeric inputs. Use when user asks to 'create a form', 'add a number field', 'build an input', or 'implement age/quantity picker'. Enforces min, max, step, required, and placeholder attributes for number inputs. Make sure to use this skill whenever generating HTML forms with numeric fields. Not for CSS styling, JavaScript validation logic, or non-numeric input types."
---

# Input Number no HTML

> Ao criar campos numéricos em formulários HTML, sempre defina limites (min/max), incremento (step) e indicações visuais (placeholder) para guiar o usuário.

## Rules

1. **Sempre defina min e max** — `<input type="number" min="0" max="18">` não apenas `<input type="number">`, porque sem limites o campo aceita qualquer valor e fica visualmente maior sem necessidade
2. **Use step para controlar incremento** — `step="2"` faz o campo pular de 2 em 2, porque o step define os "passos" entre valores válidos dentro do intervalo
3. **Adicione required quando o campo é obrigatório** — mesmo com min/max definidos, o campo pode ser enviado vazio sem required, porque min/max só validam o valor quando preenchido
4. **Use placeholder para sugerir o formato esperado** — `placeholder="0 até 18"` orienta o usuário antes de digitar, porque campos vazios sem contexto geram dúvida
5. **Lembre que min/max não bloqueiam digitação manual** — o usuário pode digitar um valor fora do range manualmente, a validação só ocorre no submit do formulário

## How to write

### Campo numérico completo

```html
<input
  type="number"
  min="0"
  max="18"
  step="2"
  required
  placeholder="0 até 18"
/>
```

### Campo de idade

```html
<input
  type="number"
  min="16"
  max="120"
  step="1"
  required
  placeholder="Sua idade"
/>
```

## Example

**Before (campo sem restrições):**

```html
<input type="number" />
```

**After (com atributos adequados):**

```html
<input
  type="number"
  min="0"
  max="18"
  step="1"
  required
  placeholder="0 até 18"
/>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Idade | `min="0" max="120" step="1"` |
| Quantidade de itens | `min="1" max="99" step="1"` |
| Valores pares/ímpares | Use `step="2"` com min adequado |
| Campo obrigatório | Sempre adicione `required` além de min/max |
| Intervalo pequeno (ex: 16-18) | O campo se ajusta visualmente ao range |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input type="number">` sem atributos | `<input type="number" min="0" max="100">` |
| Confiar que min/max bloqueia digitação | Saber que validação ocorre apenas no submit |
| Usar required achando que min/max basta | Usar required explicitamente para campos obrigatórios |
| Omitir placeholder em campo numérico | Adicionar placeholder com range esperado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre validação nativa e comportamento do browser
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-input-number/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-input-number/references/code-examples.md)
