---
name: rs-full-stack-textarea-1
description: "Enforces correct HTML textarea usage when building forms. Use when user asks to 'create a form', 'add a textarea', 'build a comment box', 'add multi-line input', or any HTML form with large text fields. Applies rules: always use name attribute, avoid rows/cols in favor of CSS, use maxlength/minlength for validation, handle whitespace inside tags carefully. Make sure to use this skill whenever generating HTML forms with multi-line text inputs. Not for single-line inputs, select dropdowns, or CSS styling."
---

# Textarea em Formularios HTML

> Ao usar textarea, controle dimensoes via CSS, valide comprimento via atributos nativos, e nunca deixe whitespace acidental dentro da tag.

## Rules

1. **Sempre inclua o atributo `name`** — sem ele o valor nao e enviado no submit, porque o servidor identifica campos pelo name
2. **Nunca use `rows` e `cols` para dimensionar** — use CSS (`width`, `height`, `resize`) porque atributos HTML de dimensao sao imprecissos e nao responsivos
3. **Cuidado com whitespace dentro da tag** — qualquer espaco ou quebra de linha entre `<textarea>` e `</textarea>` aparece como valor inicial, porque o conteudo da tag e o valor default
4. **Use `maxlength` para limitar caracteres** — o navegador bloqueia digitacao alem do limite, porque previne dados excessivos sem JavaScript
5. **Use `minlength` para exigir minimo** — o navegador valida no submit, porque garante conteudo suficiente nativamente
6. **Nao altere `wrap` sem necessidade** — o padrao (`soft`) faz quebra de linha visual; `off` desativa quebra e cria scroll horizontal, porque confunde usuarios na maioria dos casos

## How to write

### Textarea basico correto

```html
<!-- Sem whitespace entre as tags, name sempre presente -->
<textarea name="message" placeholder="Digite seu texto" required></textarea>
```

### Com limites de caracteres

```html
<textarea
  name="bio"
  maxlength="500"
  minlength="10"
  placeholder="Conte sobre voce"
  required
></textarea>
```

### Dimensionamento via CSS (nao via atributos)

```css
textarea[name="message"] {
  width: 100%;
  height: 150px;
  resize: vertical;
}
```

## Example

**Before (erros comuns):**

```html
<textarea rows="5" cols="40">
  
</textarea>
```

**After (com esta skill aplicada):**

```html
<textarea
  name="comment"
  maxlength="1000"
  minlength="5"
  placeholder="Deixe seu comentario"
  required
></textarea>
```

```css
textarea[name="comment"] {
  width: 100%;
  height: 120px;
  resize: vertical;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo de comentario/mensagem | `textarea` com `name`, `placeholder`, `required` |
| Limitar tamanho de texto | `maxlength` no HTML, nao JavaScript |
| Exigir texto minimo | `minlength` no HTML |
| Ajustar tamanho visual | CSS `width`/`height`/`resize`, nunca `rows`/`cols` |
| Valor default necessario | Coloque texto diretamente entre as tags, sem espacos extras |
| Formulario sem JavaScript | Combine `required` + `minlength` + `maxlength` para validacao nativa |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<textarea rows="5" cols="40">` | `<textarea name="msg">` + CSS |
| `<textarea>\n  \n</textarea>` (whitespace) | `<textarea name="msg"></textarea>` (colado) |
| `<textarea>` sem `name` | `<textarea name="descricao">` |
| `wrap="off"` sem motivo | Omita `wrap` (padrao `soft` e suficiente) |
| Validacao de tamanho via JS | `maxlength="500" minlength="10"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre whitespace, wrap modes e validacao nativa
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-textarea-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-textarea-1/references/code-examples.md)
