---
name: rs-full-stack-html-forms
description: "Applies HTML form fundamentals when creating forms with action and method attributes. Use when user asks to 'create a form', 'build a login page', 'capture user input', 'submit data', or 'send form data'. Enforces correct use of GET vs POST methods, action attribute, and input/output patterns. Make sure to use this skill whenever generating HTML forms or form-related markup. Not for JavaScript form validation, React/Vue forms, or CSS form styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-forms
  tags: [html, forms, get, post, input, submit]
---

# HTML Forms — Elemento de Formulário

> Todo formulário HTML começa com `<form>` definindo para onde os dados vão (action) e como vão (method).

## Rules

1. **Sempre defina `action` explicitamente** — use `action="/"` ou `action="/endpoint"`, porque omitir funciona mas deixa a intenção ambígua para quem lê o código
2. **Sempre defina `method` explicitamente** — use `method="GET"` ou `method="POST"`, porque o padrão é GET mas declarar explicitamente documenta a intenção
3. **Use GET para dados que podem ficar visíveis na URL** — buscas, filtros, navegação, porque os dados aparecem como query string (`?nome=valor`)
4. **Use POST para dados sensíveis ou de escrita** — login, cadastro, pagamento, porque os dados trafegam no body da requisição, não na URL
5. **Todo `<input>` dentro de um form precisa de `name`** — sem `name`, o campo não é enviado no submit, porque o atributo name é a chave no par chave=valor transmitido

## How to write

### Formulário básico com GET

```html
<form action="/" method="GET">
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
<!-- Resultado na URL: /?nome=Mike -->
```

### Formulário com POST (dados sensíveis)

```html
<form action="/login" method="POST">
  <input type="text" name="email" />
  <input type="password" name="senha" />
  <button type="submit">Entrar</button>
</form>
<!-- Dados vão no body, não aparecem na URL -->
```

### Múltiplos campos com GET

```html
<form action="/users" method="GET">
  <input type="text" name="id" />
  <input type="text" name="filtro" />
  <button type="submit">Buscar</button>
</form>
<!-- URL: /users?id=123&filtro=ativo -->
```

## Example

**Before (atributos omitidos):**
```html
<form>
  <input type="text" />
  <button>Submit</button>
</form>
```

**After (com esta skill aplicada):**
```html
<form action="/" method="GET">
  <input type="text" name="busca" />
  <button type="submit">Buscar</button>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Barra de busca, filtros | `method="GET"` — dados na URL permitem compartilhar link |
| Login, cadastro, pagamento | `method="POST"` — dados escondidos do body |
| Formulário sem backend | `action="/"` com GET para testar visualmente na URL |
| Múltiplos inputs no form | Cada um com `name` único — sem name, não é enviado |
| Não sabe qual method usar | GET é o padrão, mas declare explicitamente |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `<form>` sem action nem method | `<form action="/" method="GET">` |
| `<input type="text" />` sem name | `<input type="text" name="campo" />` |
| Senha com `method="GET"` | Senha com `method="POST"` |
| `<button>Submit</button>` sem type | `<button type="submit">Enviar</button>` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Dados do formulario nao chegam no servidor | Input sem atributo `name` | Adicione `name="campo"` em cada input que deve ser enviado |
| Senha aparece na URL ao submeter | Formulario usando `method="GET"` | Troque para `method="POST"` em formularios com dados sensiveis |
| Formulario recarrega a pagina sem acao | `action` aponta para a mesma pagina | Defina `action="/endpoint"` correto ou use JavaScript para prevenir o comportamento padrao |
| Botao nao submete o formulario | Botao sem `type="submit"` ou fora do `<form>` | Adicione `type="submit"` e certifique-se de que o botao esta dentro do `<form>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre GET vs POST, protocolo HTTP e fluxo front-end/back-end
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações