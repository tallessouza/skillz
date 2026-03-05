---
name: rs-full-stack-fieldset
description: "Enforces correct HTML fieldset usage for grouping related form fields. Use when user asks to 'create a form', 'group form fields', 'organize form inputs', 'add fieldset', or 'disable form section'. Applies rules: always use legend as first child, use fieldset for semantic grouping, understand disable propagation and data submission behavior. Make sure to use this skill whenever building HTML forms with multiple logical sections. Not for CSS form styling, form validation logic, or JavaScript form handling."
---

# Fieldset — Agrupamento de Campos em Formulários

> Agrupe campos de mesmo propósito dentro de `<fieldset>` com `<legend>` como primeiro filho, porque isso garante semântica, acessibilidade e controle de estado em bloco.

## Rules

1. **Sempre use `<legend>` como primeiro elemento dentro de `<fieldset>`** — porque leitores de tela anunciam o legend para contextualizar o grupo de campos
2. **Agrupe campos por propósito, não por layout** — `<fieldset>` é semântico, não visual. Um grupo "Contato" e um grupo "Dados Bancários" são fieldsets separados
3. **`disabled` no fieldset desabilita TODOS os campos internos** — inclui inputs, selects e buttons dentro dele, sem precisar desabilitar um por um
4. **Campos desabilitados NÃO são enviados no submit** — se o fieldset tem `disabled`, nenhum dado interno vai no form submission. Isso é intencional mas perigoso se esquecido
5. **Use quantos fieldsets forem necessários** — um formulário pode ter múltiplos fieldsets, cada um com seu próprio legend e estado de disabled independente

## How to write

### Fieldset básico com legend

```html
<form>
  <fieldset>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
  </fieldset>
</form>
```

### Múltiplos fieldsets com disabled seletivo

```html
<form>
  <fieldset disabled>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
  </fieldset>

  <fieldset>
    <legend>Dados Bancários</legend>
    <input type="text" name="banco" value="Banco A">
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

## Example

**Before (campos soltos sem agrupamento):**

```html
<form>
  <input type="text" name="nome">
  <input type="email" name="email">
  <input type="text" name="banco">
  <button>Enviar</button>
</form>
```

**After (com fieldsets semânticos):**

```html
<form>
  <fieldset>
    <legend>Contato</legend>
    <input type="text" name="nome">
    <input type="email" name="email">
  </fieldset>

  <fieldset>
    <legend>Dados Bancários</legend>
    <input type="text" name="banco">
  </fieldset>

  <button type="submit">Enviar</button>
</form>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Formulário com 2+ grupos lógicos de campos | Use um fieldset por grupo |
| Seção do form precisa ser desativada temporariamente | `disabled` no fieldset, não campo por campo |
| Dados de seção desabilitada precisam ser enviados | Remova `disabled` antes do submit ou use `hidden` inputs fora do fieldset |
| Botão de submit dentro de fieldset disabled | Mova o botão para fora do fieldset, porque ele também será desabilitado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<fieldset>` sem `<legend>` | `<fieldset><legend>Nome do Grupo</legend>...` |
| `<legend>` após inputs dentro do fieldset | `<legend>` como primeiro filho do fieldset |
| `disabled` em cada input individual para desabilitar seção inteira | `disabled` no `<fieldset>` pai |
| Esperar que dados de fieldset disabled sejam enviados | Remover disabled ou usar inputs hidden separados |
| Um único fieldset envolvendo todo o formulário | Fieldsets por grupo lógico de campos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre acessibilidade, comportamento do disabled e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-fieldset/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-fieldset/references/code-examples.md)
