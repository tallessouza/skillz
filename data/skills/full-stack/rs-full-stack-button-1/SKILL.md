---
name: rs-full-stack-button-1
description: "Enforces correct HTML button usage when writing forms. Use when user asks to 'create a form', 'add a button', 'build a submit button', 'make a reset button', or any HTML form task. Applies rules: explicit type attribute, correct type selection (submit/reset/button), name+value pairing for form data, autofocus and disabled usage. Make sure to use this skill whenever generating HTML forms with buttons. Not for JavaScript event handlers, CSS button styling, or React/component button abstractions."
---

# HTML Button — Tag `<button>`

> Sempre defina o atributo `type` explicitamente em botoes, porque o padrao `submit` pode causar envios acidentais de formulario.

## Rules

1. **Sempre declare `type` explicitamente** — `<button type="submit">` nao `<button>`, porque o padrao e `submit` e um botao sem tipo pode enviar o formulario sem intencao
2. **Use o tipo correto para a acao** — `submit` envia dados, `reset` limpa campos, `button` executa acao via JS sem enviar formulario
3. **Combine `name` + `value` quando o botao precisa enviar dados** — porque o par name/value e incluido nos dados do formulario ao submeter, permitindo identificar qual botao foi clicado
4. **Use `disabled` para bloquear envio durante preenchimento** — desativa o botao ate que condicoes sejam atendidas (requer JavaScript)
5. **Use `autofocus` com cautela** — foca automaticamente no botao ao carregar a pagina, mas nem todos os navegadores respeitam, e pode causar submit acidental com Enter

## How to write

### Botao de envio (submit)

```html
<form action="/api/users" method="GET">
  <input type="text" name="nome" />
  <button type="submit">Enviar</button>
</form>
```

### Botao de limpar (reset)

```html
<form>
  <input type="text" name="nome" />
  <button type="reset">Limpar</button>
</form>
```

### Botao de acao sem envio

```html
<button type="button">Abrir Modal</button>
```

### Botao com name + value (identificavel no envio)

```html
<button type="submit" name="acao" value="salvar">Salvar</button>
<button type="submit" name="acao" value="rascunho">Salvar Rascunho</button>
```

## Example

**Before (botao sem tipo explicito):**

```html
<form action="/submit">
  <input name="email" />
  <button>Enviar</button>
  <button>Cancelar</button>
</form>
```

**After (com tipos explicitos e corretos):**

```html
<form action="/submit">
  <input name="email" />
  <button type="submit">Enviar</button>
  <button type="button">Cancelar</button>
</form>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Botao envia formulario | `type="submit"` |
| Botao limpa campos do form | `type="reset"` |
| Botao executa JS sem enviar | `type="button"` |
| Precisa saber qual botao foi clicado no backend | Adicione `name` + `value` |
| Botao deve estar inativo ate validacao | `disabled` + JS para remover |
| Quer foco automatico ao carregar | `autofocus` (teste cross-browser) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<button>Enviar</button>` (sem type) | `<button type="submit">Enviar</button>` |
| `<button type="submit">Cancelar</button>` | `<button type="button">Cancelar</button>` |
| `<input type="submit">` quando precisa de conteudo rico | `<button type="submit">Enviar</button>` |
| `<button type="button" name="x" value="y">` | Remova name/value — botao type=button nao envia dados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tipos de botao, autofocus e disabled
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes