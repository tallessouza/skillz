---
name: rs-full-stack-campos-info-responsavel
description: "Applies HTML form validation patterns with CSS pseudo-classes when building forms with 'required' fields, ':invalid/:valid' styling, sibling selectors, and error messages. Use when user asks to 'create a form', 'add validation', 'style invalid inputs', 'show error messages', or 'build registration form'. Make sure to use this skill whenever generating forms with client-side validation using pure HTML/CSS. Not for JavaScript validation, backend validation, or React/framework form libraries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [html, css, forms, validation, pseudo-classes, fieldset]
---

# Validacao de Formularios com CSS Pseudo-classes

> Use pseudo-classes CSS (:invalid, :valid, :not(:focus)) combinadas com seletores de irmao (~) para criar feedback visual de validacao sem JavaScript.

## Rules

1. **Use `required` para ativar pseudo-classes de validacao** — sem `required`, `:invalid` e `:valid` nao funcionam, porque o campo precisa de uma regra para ser avaliado
2. **Estilize `:invalid` com borda semantica de erro** — aplique `border: 0.125rem solid var(--semantic-error)` para feedback visual imediato
3. **Combine `:not(:focus):valid` para esconder erros apos validacao** — evita o efeito de "piscar" enquanto o usuario ainda esta digitando
4. **Use seletor de irmao (`~`) para controlar elementos adjacentes** — `input:valid ~ .error { display: none }` esconde a mensagem de erro quando o campo e valido
5. **Use `<small>` para textos auxiliares abaixo de inputs** — o elemento ja vem com fonte menor por padrao, aplique `display: inline-block` para permitir `margin-top`
6. **Agrupe campos relacionados em `<fieldset>` com `<legend>`** — fieldsets com classe identificadora (ex: `guardian`) facilitam estilizacao por secao
7. **Use `type="email"` com `required` juntos** — o tipo email ja valida formato basico, e o required garante preenchimento obrigatorio

## How to write

### Estrutura HTML do campo com validacao

```html
<fieldset class="guardian">
  <legend>Informações do responsável</legend>

  <div class="input-wrapper">
    <label for="mail">E-mail</label>
    <input type="email" id="mail" name="mail" required />
    <div class="error">
      <img src="./assets/icons/alert-circle.svg" alt="Icone de alerta" />
      <span>Insira um e-mail válido</span>
    </div>
  </div>
</fieldset>
```

### CSS com pseudo-classes de validacao

```css
/* Borda vermelha quando invalido */
input:invalid {
  border: 0.125rem solid var(--semantic-error);
}

/* Esconde erro quando valido E fora de foco */
input:not(:focus):valid ~ .error {
  display: none;
}

/* Estilo da mensagem de erro */
input:required ~ .error {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--text-small);
  color: var(--semantic-error);
  margin-top: 0.25rem;
}

/* Small como irmao do input */
input ~ small {
  font-size: var(--text-small);
  color: #7C7C8A;
  display: inline-block;
  margin-top: 0.25rem;
}
```

## Example

**Before (sem feedback visual):**
```html
<input type="email" name="mail" />
<span>Insira um e-mail válido</span>
```

**After (com validacao CSS):**
```html
<input type="email" id="mail" name="mail" required />
<div class="error">
  <img src="./assets/icons/alert-circle.svg" alt="Icone de alerta" />
  <span>Insira um e-mail válido</span>
</div>
```
```css
input:invalid {
  border: 0.125rem solid var(--semantic-error);
}
input:not(:focus):valid ~ .error {
  display: none;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo obrigatorio com formato especifico (email, tel) | `type` correto + `required` + mensagem `.error` |
| Texto auxiliar abaixo do campo | `<small>` com `display: inline-block` e `margin-top` |
| Erro que pisca durante digitacao | Adicione `:not(:focus)` antes de `:valid` |
| Agrupar campos de uma mesma pessoa/secao | `<fieldset>` com classe identificadora |
| Telefone sem validacao rigorosa | `type="tel"` ou `type="text"`, ambos aceitam qualquer coisa sem pattern |
| Placeholder como guia de formato | Coloque exemplo de formato esperado (ex: `(11) 99999-9999`) |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `input:valid ~ .error { display: none }` (sem :not(:focus)) | `input:not(:focus):valid ~ .error { display: none }` |
| `<span>texto auxiliar</span>` para hint | `<small>texto auxiliar</small>` |
| Mensagem de erro sem icone visual | `<div class="error"><img .../><span>mensagem</span></div>` |
| `display: block` no `<small>` | `display: inline-block` para manter propriedades inline e permitir margin |
| Validacao so com JavaScript | Pseudo-classes CSS primeiro, JS para casos avancados |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `:invalid` nao aplica estilo | Falta atributo `required` no input | Adicione `required` para ativar pseudo-classes de validacao |
| Mensagem de erro aparece mesmo com campo valido | Seletor CSS sem `:not(:focus)` na regra `:valid` | Use `input:not(:focus):valid ~ .error { display: none }` |
| Seletor `~` nao funciona | Elemento `.error` nao e irmao do input no DOM | Garanta que `.error` esta no mesmo nivel hierarquico que o input |
| Borda de erro aparece ao carregar a pagina | Campo required vazio e invalido por padrao | Adicione `:not(:placeholder-shown)` ou use JS para validar apos interacao |
| `<small>` nao aceita margin-top | Elemento inline por padrao | Adicione `display: inline-block` ao `<small>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre pseudo-classes, seletores de irmao e comportamento de validacao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes