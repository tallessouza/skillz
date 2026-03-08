---
name: rs-full-stack-input-password
description: "Applies HTML password input best practices when building forms with password fields. Use when user asks to 'create a login form', 'add password field', 'build registration form', 'implement authentication UI', or any form with sensitive data. Enforces POST method for passwords, proper minlength/maxlength, pattern validation, and inputmode. Make sure to use this skill whenever generating HTML forms that include password inputs. Not for backend authentication logic, encryption, or hashing strategies."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-forms
  tags: [html, input, password, security, validation, pattern, forms]
---

# Input Password em Formulários HTML

> Campos de senha exigem método POST, validação de comprimento, e pattern regex — nunca transmita senhas via GET.

## Rules

1. **Use method POST no form** — nunca GET, porque GET expõe a senha na URL visível ao usuário e no histórico do navegador
2. **Defina minlength e maxlength** — force um comprimento mínimo seguro (ex: 8) e máximo razoável (ex: 12), porque senhas curtas são vulneráveis
3. **Use pattern para validação frontend** — expressões regulares validam caractere por caractere no navegador, porque reduz submissões inválidas antes do backend
4. **Evite conflitos entre pattern e minlength/maxlength** — o quantificador `{4,8}` no pattern deve ser compatível com minlength/maxlength, porque conflitos geram comportamento confuso para o usuário
5. **Use inputmode para mobile** — `inputmode="numeric"` abre teclado numérico no celular, porque melhora UX em dispositivos touch
6. **Use title para descrever o pattern** — o atributo title explica ao usuário o formato esperado, porque a mensagem de erro do browser usa esse texto

## How to write

### Password field básico e seguro

```html
<form action="/login" method="POST">
  <label for="senha">Senha:</label>
  <input
    type="password"
    id="senha"
    name="senha"
    minlength="8"
    maxlength="12"
    required
  />
  <button type="submit">Entrar</button>
</form>
```

### Password com pattern (hexadecimal)

```html
<input
  type="password"
  name="senha"
  pattern="[0-9a-fA-F]{8}"
  minlength="8"
  maxlength="8"
  title="Apenas hexadecimal (0-9, A-F)"
/>
```

### Password com inputmode para mobile

```html
<input
  type="password"
  name="pin"
  inputmode="numeric"
  pattern="[0-9]{6}"
  maxlength="6"
  title="PIN numérico de 6 dígitos"
/>
```

## Example

**Before (inseguro — senha via GET):**

```html
<form action="/login" method="GET">
  <input type="password" name="senha" />
  <button type="submit">Entrar</button>
</form>
<!-- URL resultante: /login?senha=minhasenha123 -->
```

**After (com esta skill aplicada):**

```html
<form action="/login" method="POST">
  <input
    type="password"
    name="senha"
    minlength="8"
    maxlength="24"
    required
    title="Senha entre 8 e 24 caracteres"
  />
  <button type="submit">Entrar</button>
</form>
<!-- Senha enviada no body da requisição, não visível na URL -->
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com senha | Sempre `method="POST"` |
| Senha numérica (PIN) | `inputmode="numeric"` + `pattern="[0-9]{N}"` |
| Validação de formato específico | Use `pattern` + `title` descritivo |
| Conflito pattern vs minlength | Alinhe o quantificador `{min,max}` do regex com minlength/maxlength |
| Segurança além do frontend | Lembre que pattern é camada superficial — backend deve validar também |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `method="GET"` com password | `method="POST"` |
| `<input type="text">` para senhas | `<input type="password">` |
| pattern `{4,8}` com minlength="8" | pattern `{8}` com minlength="8" (valores compatíveis) |
| password sem minlength | password com `minlength="8"` no mínimo |
| pattern sem title | pattern com `title="descrição do formato"` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Senha visivel na URL apos submit | Form usando `method="GET"` | Trocar para `method="POST"` |
| Pattern e minlength conflitam | Quantificador `{4,8}` nao bate com minlength="8" | Alinhar regex quantifier com minlength/maxlength |
| Teclado numerico nao abre no mobile | `inputmode` nao definido | Adicionar `inputmode="numeric"` para PINs |
| Mensagem de erro generica no pattern | `title` nao definido | Adicionar `title="Descricao do formato esperado"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre GET vs POST, conflitos pattern/minlength, e estrategias de seguranca frontend
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e anotacoes