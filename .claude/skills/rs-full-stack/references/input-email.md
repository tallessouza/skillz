---
name: rs-full-stack-input-email
description: "Applies HTML email input validation patterns when building forms with email fields. Use when user asks to 'create a form', 'add email input', 'validate email', 'build a contact form', or 'implement email field'. Covers type=email, multiple, minlength, maxlength, pattern with regex, and title for custom messages. Make sure to use this skill whenever generating HTML forms that include email fields. Not for JavaScript validation, backend email verification, or email sending logic."
---

# Input Email — Validacao HTML Nativa

> Usar os atributos nativos do input type="email" para validacao antes de recorrer a JavaScript.

## Rules

1. **Sempre use `type="email"`** — nao `type="text"`, porque o navegador valida formato de email automaticamente (precisa ter `@` e dominio)
2. **Use `multiple` para aceitar varios emails** — separados por virgula, porque evita criar multiplos campos desnecessarios
3. **Defina `minlength` e `maxlength`** — porque limita no proprio HTML sem precisar de JS para validacao de tamanho
4. **Use `pattern` para restringir dominio ou formato** — expressao regular caracter por caracter, porque permite regras de negocio como "apenas emails @empresa.com"
5. **Combine `pattern` com `title`** — porque o `title` aparece como mensagem explicativa quando o pattern falha, orientando o usuario
6. **Adicione `required` junto com `pattern`** — porque pattern sozinho nao impede campo vazio

## How to write

### Email basico com validacao nativa

```html
<input type="email" name="mail" required />
```

### Multiplos emails

```html
<input type="email" name="mail" multiple />
<!-- Aceita: abc@a.com,abc@b.com -->
```

### Com limites de tamanho

```html
<input type="email" name="mail" minlength="10" maxlength="255" />
```

### Com pattern para dominio especifico

```html
<input
  type="email"
  name="mail"
  required
  pattern=".+@skillz\.com"
  title="Apenas emails @skillz.com"
/>
```

## Example

**Before (sem validacao):**
```html
<input type="text" name="email" />
```

**After (com validacao HTML nativa):**
```html
<input
  type="email"
  name="mail"
  required
  minlength="10"
  maxlength="255"
  pattern=".+@empresa\.com"
  title="Use seu email corporativo @empresa.com"
/>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario de contato generico | `type="email"` + `required` |
| Cadastro corporativo | Adicionar `pattern` restringindo dominio |
| Newsletter com multiplos emails | Adicionar `multiple` |
| Email muito curto pode ser invalido | Usar `minlength` |
| Pattern aplicado | Sempre adicionar `title` com instrucao clara |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `type="text"` para campo de email | `type="email"` |
| `pattern` sem `title` | `pattern` + `title` com mensagem util |
| `pattern` sem `required` | `pattern` + `required` |
| Validacao de formato apenas com JS | Validacao HTML nativa + JS para casos avancados |
| `maxlength="99999"` | `maxlength="255"` (limite razoavel para emails) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre regex em pattern, encoding de URL e validacao nativa vs JS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-input-email/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-input-email/references/code-examples.md)
