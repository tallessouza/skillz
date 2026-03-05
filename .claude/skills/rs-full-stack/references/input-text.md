---
name: rs-full-stack-input-text
description: "Applies correct HTML input text attributes and form patterns when writing HTML forms. Use when user asks to 'create a form', 'add an input field', 'build a contact form', 'make a registration page', or any HTML form task. Enforces proper use of type, name, value, placeholder, required, readonly, disabled, autofocus, autocomplete, and form attributes. Make sure to use this skill whenever generating HTML forms with text inputs. Not for CSS styling, JavaScript validation, or backend form processing."
---

# Input Text — Atributos HTML

> Todo input de texto precisa de `type` e `name` como atributos fundamentais; os demais atributos controlam comportamento e interacao do usuario.

## Rules

1. **Sempre defina `type` e `name`** — `type="text"` define o campo, `name` identifica o dado no envio do formulario, porque sem esses dois o formulario nao funciona corretamente
2. **Use `placeholder` para dica, `value` para dado real** — placeholder e apenas visual e nao envia dados; value preenche o campo e e enviado no submit, porque confundir os dois causa envio de dados vazios
3. **Use `required` para campos obrigatorios** — o navegador bloqueia envio se o campo estiver vazio, porque isso evita submissoes incompletas sem JavaScript
4. **Use `readonly` quando o valor nao pode ser alterado pelo usuario** — diferente de `disabled`, readonly ainda envia o dado no formulario
5. **Use `disabled` para desabilitar completamente** — campo desabilitado nao e editavel nem enviado no submit
6. **Defina tamanhos via CSS, nao `size`** — o atributo `size` existe mas CSS oferece controle superior, porque misturar apresentacao no HTML dificulta manutencao
7. **Use `autofocus` com moderacao** — apenas UM campo por pagina deve ter autofocus, porque multiplos autofocus causam comportamento imprevisivel

## How to write

### Input basico com atributos fundamentais

```html
<form id="meu-form">
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
```

### Placeholder vs Value

```html
<!-- Placeholder: dica visual, NAO envia dado -->
<input type="text" name="nome" placeholder="Coloque seu nome" />

<!-- Value: dado real, enviado no submit -->
<input type="text" name="nome" value="Mike" />
```

### Input fora do formulario (atributo form)

```html
<form id="meu-form">
  <button type="submit">Enviar</button>
</form>
<!-- Input linkado ao form pelo atributo form -->
<input type="text" name="nome" form="meu-form" />
```

## Example

**Before (atributos mal aplicados):**
```html
<input name="email" placeholder="user@mail.com" required />
<input value="Dica: digite aqui" name="obs" />
```

**After (com esta skill aplicada):**
```html
<input type="text" name="email" placeholder="user@mail.com" required />
<input type="text" name="obs" placeholder="Dica: digite aqui" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo deve ser preenchido pelo usuario | `placeholder` com dica + `required` |
| Campo ja tem valor que usuario pode alterar | `value="valor"` sem readonly |
| Campo mostra dado que nao pode mudar | `value="valor"` + `readonly` |
| Campo completamente inativo | `disabled` |
| Input fora da tag `<form>` | Atributo `form="id-do-form"` |
| Foco automatico ao carregar pagina | `autofocus` (apenas 1 por pagina) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<input name="x">` sem type | `<input type="text" name="x">` |
| `placeholder="Mike"` como valor real | `value="Mike"` para dado, `placeholder` para dica |
| `size="50"` para dimensionar | CSS `width` no input |
| `<input type="text">` sem name em form | Sempre inclua `name` se o dado sera enviado |
| `disabled` quando quer apenas impedir edicao | `readonly` preserva envio do dado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada atributo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-input-text/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-input-text/references/code-examples.md)
