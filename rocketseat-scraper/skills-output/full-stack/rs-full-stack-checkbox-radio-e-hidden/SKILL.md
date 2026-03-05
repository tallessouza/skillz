---
name: rs-full-stack-checkbox-radio-e-hidden
description: "Applies correct HTML checkbox, radio, and hidden input patterns when building forms. Use when user asks to 'create a form', 'add checkboxes', 'add radio buttons', 'build a survey', or any HTML form task. Enforces proper use of name grouping, value attributes, checked defaults, and hidden fields for data transport. Make sure to use this skill whenever generating HTML forms with selection inputs. Not for CSS styling, JavaScript validation, or backend form processing."
---

# Checkbox, Radio e Hidden

> Ao criar inputs de selecao em formularios HTML, use o tipo correto (checkbox vs radio) baseado na cardinalidade da escolha, agrupe pelo atributo name, e use hidden para transportar dados invisiveis.

## Rules

1. **Checkbox para multiplas selecoes, Radio para selecao unica** — checkbox permite marcar varios itens, radio permite apenas um por grupo, porque a semantica HTML garante o comportamento correto sem JavaScript
2. **Agrupe radio buttons pelo mesmo name** — todos os radios de um grupo compartilham o mesmo `name`, porque e isso que faz o browser desmarcar um ao marcar outro
3. **Sempre defina value explicitamente** — sem value, checkbox envia `on` como valor padrao, que e inutil no backend, porque o servidor precisa saber QUAL opcao foi selecionada
4. **Use checked para pre-selecionar** — atributo booleano que define o estado inicial marcado, porque melhora UX ao sugerir opcao padrao
5. **Use hidden para dados de transporte** — input hidden envia dados invisiveis ao usuario (IDs, tokens), porque o formulario precisa trafegar informacoes sem expor ao usuario final
6. **Hidden e visivel no DevTools** — nunca armazene segredos em campos hidden, porque qualquer programador ve o valor nas ferramentas de desenvolvedor

## How to write

### Checkbox (selecao multipla)

```html
<!-- Agrupados pelo mesmo name, cada um com value explicito -->
<input type="checkbox" name="carro" value="fiat" checked> Fiat
<input type="checkbox" name="carro" value="audi"> Audi
<!-- Envia: carro=fiat&carro=audi (se ambos marcados) -->
```

### Radio (selecao unica)

```html
<!-- Mesmo name = apenas um selecionavel por vez -->
<input type="radio" name="carro" value="fiat" checked> Fiat
<input type="radio" name="carro" value="audi"> Audi
<!-- Envia: carro=fiat OU carro=audi (nunca ambos) -->
```

### Hidden (dados invisiveis)

```html
<!-- Sempre enviado, invisivel no formulario -->
<input type="hidden" name="id" value="abc-123">
```

## Example

**Before (erros comuns):**
```html
<!-- Radio sem value: envia "on" -->
<input type="radio" name="plano"> Basic
<input type="radio" name="plano"> Pro

<!-- Radio com names diferentes: permite selecionar ambos -->
<input type="radio" name="opcao1" value="basic"> Basic
<input type="radio" name="opcao2" value="pro"> Pro

<!-- Checkbox sem value -->
<input type="checkbox" name="aceite">
```

**After (com esta skill):**
```html
<input type="radio" name="plano" value="basic"> Basic
<input type="radio" name="plano" value="pro" checked> Pro

<input type="checkbox" name="aceite" value="sim">
<input type="hidden" name="usuario_id" value="usr-456">
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario pode escolher varios itens | `type="checkbox"` com mesmo `name` |
| Usuario deve escolher exatamente um | `type="radio"` com mesmo `name` |
| Precisa enviar dado sem mostrar | `type="hidden"` |
| Opcao padrao desejada | Adicione `checked` |
| Sem `value` definido | Checkbox/radio enviam `"on"` — sempre defina value |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `<input type="radio" name="a">` sem value | `<input type="radio" name="a" value="opcao1">` |
| Radios com names diferentes no mesmo grupo | Radios com mesmo name no grupo |
| `<input type="checkbox">` sem name | `<input type="checkbox" name="item" value="x">` |
| Dados sensiveis em hidden | Hidden apenas para IDs e metadata nao-secreta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes