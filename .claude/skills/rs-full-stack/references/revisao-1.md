---
name: rs-full-stack-revisao-1
description: "Enforces HTML Forms best practices when building forms in HTML. Use when user asks to 'create a form', 'add input fields', 'build a login form', 'make a contact form', or any HTML form task. Applies rules: form action/method attributes, proper label usage for accessibility, correct input types, fieldset for grouping, textarea for multiline, select for options. Make sure to use this skill whenever generating HTML forms or form elements. Not for JavaScript validation logic, CSS styling, or backend form processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: "HTML Forms"
  tags: ['html', 'forms', 'accessibility', 'semantics']
---

# HTML Forms — Boas Práticas

> Todo formulário HTML deve capturar dados com semântica correta, acessibilidade via labels, e atributos fundamentais definidos.

## Rules

1. **Sempre defina `action` e `method` no `<form>`** — `action` indica para onde os dados vão, `method` define GET ou POST, porque sem isso o comportamento é imprevisível
2. **Use `method="POST"` para envio de dados sensíveis** — GET expõe dados na URL (`?nome=valor&campo=valor`), POST envia escondido no body, porque dados como senha e email não devem ficar visíveis na URL
3. **Todo input precisa de `name` e `type`** — `name` identifica o valor no envio, `type` define o comportamento do campo, porque sem `name` o dado não é enviado e sem `type` o browser assume texto
4. **Sempre associe `<label>` aos campos** — use `for="id-do-input"` ou envolva o input dentro do label, porque isso é essencial para acessibilidade (leitores de tela) e melhora a usabilidade (área de clique maior)
5. **Use `<fieldset>` + `<legend>` para agrupar campos relacionados** — porque melhora a semântica e acessibilidade do formulário
6. **Escolha o `type` mais específico disponível** — `email` para email, `password` para senha, `number` para números, porque o browser oferece validação nativa e teclado adequado em mobile

## How to write

### Estrutura base de formulário

```html
<form action="/submit" method="POST">
  <fieldset>
    <legend>Dados Pessoais</legend>

    <label for="name">Nome</label>
    <input type="text" name="name" id="name" required>

    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" required>
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

### Select com agrupamento

```html
<label for="car">Escolha um carro</label>
<select name="car" id="car">
  <optgroup label="Nacionais">
    <option value="gol">Gol</option>
    <option value="onix">Onix</option>
  </optgroup>
  <optgroup label="Importados">
    <option value="civic">Civic</option>
  </optgroup>
</select>
```

### Textarea para texto longo

```html
<label for="message">Mensagem</label>
<textarea name="message" id="message" rows="5" cols="40"></textarea>
```

## Example

**Before (sem semântica nem acessibilidade):**
```html
<form>
  Nome: <input type="text">
  Email: <input type="text">
  <input type="submit">
</form>
```

**After (com esta skill aplicada):**
```html
<form action="/register" method="POST">
  <fieldset>
    <legend>Cadastro</legend>

    <label for="name">Nome</label>
    <input type="text" name="name" id="name" required>

    <label for="email">E-mail</label>
    <input type="email" name="email" id="email" required>
  </fieldset>

  <button type="submit">Cadastrar</button>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Dados sensíveis (senha, email) | `method="POST"` |
| Campo com opções pré-definidas | `<select>` com `<option>` |
| Texto longo (comentários, bio) | `<textarea>` em vez de input |
| Campos do mesmo contexto | Agrupe com `<fieldset>` + `<legend>` |
| Precisa de validação complexa | HTML nativo primeiro, JavaScript depois |
| Múltipla seleção | `<select multiple>` |
| Escolha única entre poucos itens | `<input type="radio">` |
| Escolha múltipla entre poucos itens | `<input type="checkbox">` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `<input>` sem `name` | `<input name="email" ...>` |
| `<input>` sem `type` | `<input type="email" ...>` |
| `<form>` sem `action` | `<form action="/submit" method="POST">` |
| Texto solto como label | `<label for="id">Texto</label>` |
| `<input type="text">` para email | `<input type="email">` |
| `<input type="text">` para senha | `<input type="password">` |
| `<div>` para agrupar campos | `<fieldset><legend>...</legend>...</fieldset>` |
| `<input type="submit">` | `<button type="submit">Enviar</button>` |

## Troubleshooting

| Sintoma | Causa provavel | Solucao |
|---------|---------------|---------|
| Dados do formulario nao enviados | `<input>` sem atributo `name` | Adicione `name` em cada campo: `<input name="email">` |
| Formulario recarrega a pagina sem acao | `<form>` sem `action` definido | Adicione `action="/endpoint"` e `method="POST"` |
| Leitor de tela nao identifica campos | Labels nao associados aos inputs | Use `<label for="id-do-input">` ou envolva o input no label |
| Teclado mobile mostra teclado generico | `type="text"` para email ou numero | Use `type="email"`, `type="number"`, `type="tel"` conforme o campo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre GET vs POST, acessibilidade, e tipos de input
- [code-examples.md](references/code-examples.md) — Todos os exemplos de formulários expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-revisao-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-revisao-1/references/code-examples.md)
