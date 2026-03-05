---
name: rs-full-stack-input-color
description: "Applies HTML input color and DataList patterns when building color pickers or form color selection. Use when user asks to 'add a color picker', 'create color input', 'build color selector', or 'use datalist with input'. Covers input type=color, RGB values, and DataList for predefined options. Make sure to use this skill whenever generating HTML forms with color selection. Not for CSS color styling, color theory, or JavaScript color manipulation."
---

# Input Color e DataList

> Usar input type="color" com DataList para criar seletores de cor com opcoes predefinidas em formularios HTML.

## Rules

1. **Use input type="color" para selecao de cores** — `<input type="color">` renderiza um color picker nativo do navegador, porque cada user agent implementa sua propria interface
2. **Defina cor padrao via value em formato RGB hex** — `value="#0FACAA"`, porque valores invalidos sao ignorados pelo navegador
3. **Use DataList para opcoes predefinidas** — conecte via atributo `list` no input apontando para o `id` do DataList, porque permite ao usuario escolher rapidamente entre cores pre-selecionadas
4. **DataList nao e exclusivo de color** — funciona com outros tipos de input tambem, porque e um elemento HTML generico de sugestoes
5. **Option dentro de DataList pode ser self-closing** — `<option value="#FCAC00" />` e valido, porque nao precisa de texto visivel para cores

## How to write

### Color picker basico

```html
<input type="color" value="#0FACAA">
```

### Color picker com opcoes predefinidas

```html
<input type="color" list="color-picker" value="#0FACAA">

<datalist id="color-picker">
  <option value="#FCAC00" />
  <option value="#FF00DD" />
  <option value="#00FF88" />
</datalist>
```

## Example

**Before (sem opcoes predefinidas):**
```html
<form>
  <label>Escolha uma cor:</label>
  <input type="color">
  <button type="submit">Enviar</button>
</form>
```

**After (com DataList e valor padrao):**
```html
<form>
  <label>Escolha uma cor:</label>
  <input type="color" value="#0FACAA" list="cores-tema">
  <button type="submit">Enviar</button>
</form>

<datalist id="cores-tema">
  <option value="#FCAC00" />
  <option value="#FF00DD" />
  <option value="#3366FF" />
</datalist>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario precisa escolher cor livremente | `input type="color"` sem DataList |
| Cores do tema/marca devem ser sugeridas | Adicione DataList com as cores da marca |
| Cor padrao deve aparecer no formulario | Defina `value="#RRGGBB"` no input |
| Precisa do valor no submit | O valor enviado e o hex da cor selecionada |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<input type="text">` para cor | `<input type="color">` |
| `value="red"` (nome de cor) | `value="#FF0000"` (hex RGB valido) |
| DataList sem id | `<datalist id="meu-id">` conectado via `list="meu-id"` |
| `list="id"` sem DataList correspondente | Sempre criar o DataList com o mesmo id |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes