---
name: rs-full-stack-input-range
description: "Applies HTML input range (slider) patterns when building forms with numeric selection. Use when user asks to 'create a slider', 'add a range input', 'build a volume control', 'numeric selector', or 'form with range'. Configures min, max, step, and value attributes correctly. Make sure to use this skill whenever generating HTML forms that need numeric range selection. Not for text inputs, dropdowns, or JavaScript slider libraries."
---

# Input Range

> Usar input type="range" para selecao numerica via slider, configurando min, max, step e value para controle preciso.

## Rules

1. **Sempre defina name** — sem name o valor nao e enviado no form, porque o servidor precisa identificar o campo
2. **Defina min e max explicitamente** — o padrao e 0-100, mas deixar implicito causa confusao na manutencao
3. **Use step para controlar granularidade** — step define o incremento entre valores, porque sem ele o usuario pode selecionar qualquer inteiro
4. **Defina value para estado inicial** — sem value o slider comeca no ponto medio do range, porque o browser calcula (min+max)/2

## How to write

### Range basico com configuracao completa

```html
<input type="range" name="total" min="0" max="100" step="1" value="50">
```

### Range com step personalizado

```html
<!-- Slider de 0 a 200, pulando de 20 em 20 -->
<input type="range" name="quantity" min="0" max="200" step="20" value="0">
```

## Example

**Before (incompleto):**
```html
<input type="range">
<button type="submit">Enviar</button>
```

**After (com this skill applied):**
```html
<label for="total">Total: <output id="totalOutput">40</output></label>
<input type="range" id="total" name="total" min="0" max="200" step="20" value="40">
<button type="submit">Enviar</button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Volume, brilho, opacidade | `min="0" max="100" step="1"` |
| Preco com incrementos fixos | step com valor do incremento desejado |
| Valor padrao diferente do meio | Definir value explicitamente |
| Usuario precisa ver o valor atual | Adicionar `<output>` ou label dinamico |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<input type="range">` sem name | `<input type="range" name="volume">` |
| Range sem label visivel | `<label>` + `<output>` mostrando valor |
| Confiar no default 0-100 sem declarar | Declarar min e max explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre comportamento padrao do range e analogia com input number
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes de configuracao

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-input-range/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-input-range/references/code-examples.md)
