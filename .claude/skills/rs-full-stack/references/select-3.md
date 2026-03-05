---
name: rs-full-stack-select-3
description: "Applies correct HTML SELECT field patterns when writing forms with dropdowns, multi-select, and grouped options. Use when user asks to 'create a form', 'add a dropdown', 'add a select field', 'group options', or 'multi-select'. Covers SELECT, OPTION, OPTGROUP, MULTIPLE, and SIZE attributes. Make sure to use this skill whenever generating HTML forms with selection fields. Not for input text fields, checkboxes, radio buttons, or JavaScript select libraries."
---

# Campo SELECT em Formularios HTML

> Ao criar campos de selecao, use SELECT com OPTION para opcoes simples, OPTGROUP para agrupar opcoes relacionadas, e MULTIPLE/SIZE para controlar comportamento de selecao.

## Rules

1. **Sempre inclua uma opcao placeholder** — primeira OPTION com value vazio e texto como "Selecione", porque o primeiro item e exibido automaticamente e serve como instrucao ao usuario
2. **Use OPTGROUP para categorizar opcoes** — agrupe opcoes relacionadas com label descritivo, porque facilita a navegacao em listas longas
3. **OPTION aceita duas sintaxes** — tag com conteudo `<option value="x">Texto</option>` ou auto-fechada com label `<option label="Texto" value="x">`, porque ambas sao validas em HTML
4. **MULTIPLE requer instrucao visual** — ao usar multiple, aumente o SIZE para mostrar varias opcoes, porque sem SIZE o usuario nao percebe que pode selecionar multiplos
5. **NAME e obrigatorio para envio** — sem name no SELECT o valor nao e enviado no formulario, porque o name define a chave no payload

## How to write

### SELECT basico com placeholder

```html
<select name="car">
  <option value="">Selecione</option>
  <option value="fiat">Fiat</option>
  <option value="bmw">BMW</option>
</select>
```

### SELECT com OPTGROUP

```html
<select name="car">
  <option value="">Selecione</option>
  <optgroup label="Esportivo">
    <option value="ferrari">Ferrari</option>
    <option value="porsche">Porsche</option>
  </optgroup>
  <optgroup label="Familia">
    <option value="uno">Uno</option>
    <option value="chevette">Chevette</option>
  </optgroup>
</select>
```

### SELECT multiplo com SIZE

```html
<select name="cars" multiple size="6">
  <option value="fiat">Fiat</option>
  <option value="bmw">BMW</option>
  <option value="ferrari">Ferrari</option>
</select>
```

## Example

**Before (erros comuns):**
```html
<select>
  <option>Fiat</option>
  <option>BMW</option>
</select>
```

**After (com esta skill aplicada):**
```html
<select name="car">
  <option value="">Selecione</option>
  <option value="fiat">Fiat</option>
  <option value="bmw">BMW</option>
</select>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista com mais de 10 opcoes | Agrupe com OPTGROUP |
| Usuario deve escolher apenas 1 | SELECT simples (sem multiple) |
| Usuario pode escolher varios | Adicione `multiple` e `size` adequado |
| Opcao padrao sem valor | `<option value="">Selecione</option>` como primeiro item |
| SIZE com multiple | Defina size = numero de opcoes visiveis desejadas |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<select>` sem name | `<select name="campo">` |
| `<option>Texto` sem value | `<option value="texto">Texto</option>` |
| `multiple` sem size | `multiple size="6"` |
| OPTGROUP sem label | `<optgroup label="Categoria">` |
| Primeira opcao com valor real | Primeira opcao com `value=""` como placeholder |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-select-3/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-select-3/references/code-examples.md)
