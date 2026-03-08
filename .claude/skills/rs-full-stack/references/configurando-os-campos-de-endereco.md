---
name: rs-full-stack-campos-de-endereco
description: "Applies HTML form address field patterns with fieldset, disabled inputs, flex layout, and CSS utility classes. Use when user asks to 'create a form', 'add address fields', 'build registration form', 'configure form layout', or 'style disabled inputs'. Covers fieldset grouping, flex utility classes, disabled state styling with opacity and has-selector, and CSS custom properties for theming. Make sure to use this skill whenever building multi-section forms with mixed enabled/disabled fields. Not for JavaScript form validation, API submission, or backend processing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-css-forms
  tags: [fieldset, disabled-inputs, flex-layout, css-has-selector, form-styling, address-fields]
---

# Configurando Campos de Endereço em Formulários HTML

> Agrupe campos de endereço em fieldsets semânticos, use classes utilitárias flex para layout, e estilize campos disabled com seletores CSS que propagam o estado visual ao wrapper inteiro.

## Rules

1. **Use `<fieldset>` para agrupar campos relacionados** — cada seção do formulário (dados pessoais, endereço) fica em seu próprio fieldset com `<legend>`, porque isso dá semântica e acessibilidade ao agrupamento
2. **Crie classes utilitárias flex mínimas** — `.flex` para display flex, `.flex1` e `.flex2` para proporções, porque evita repetição e permite layouts como 2/3 + 1/3 com gap
3. **Propague estado disabled ao wrapper** — use `.input-wrapper:has([disabled])` com `opacity: 0.5` para estilizar o wrapper inteiro quando um input filho está disabled, porque o feedback visual deve cobrir label + input juntos
4. **Campos disabled recebem cor de superfície própria** — use variável CSS `--surface-disabled` como background, porque distingue visualmente campos não-editáveis dos editáveis
5. **Use multi-cursor para renomear label+input juntos** — Cmd+D (Mac) ou Ctrl+D (Win/Linux) seleciona próxima ocorrência, porque `for`, `id` e `name` devem coincidir sempre

## How to write

### Fieldset de endereço com layout flex

```html
<fieldset class="address">
  <legend>Endereço residencial</legend>

  <div class="input-wrapper">
    <label for="cep">CEP</label>
    <input type="text" id="cep" name="cep" />
  </div>

  <div class="flex">
    <div class="input-wrapper flex2">
      <label for="street">Rua</label>
      <input type="text" id="street" name="street" value="Rosas e Flores" disabled />
    </div>
    <div class="input-wrapper flex1">
      <label for="number">Número</label>
      <input type="number" id="number" name="number" />
    </div>
  </div>

  <div class="flex">
    <div class="input-wrapper flex2">
      <label for="city">Cidade</label>
      <input type="text" id="city" name="city" value="São Paulo" disabled />
    </div>
    <div class="input-wrapper flex1">
      <label for="state">Estado</label>
      <input type="text" id="state" name="state" value="São Paulo" disabled />
    </div>
  </div>
</fieldset>
```

### Classes utilitárias e estilos disabled

```css
/* Utilitárias globais */
.flex { display: flex; }
.flex1 { flex: 1; }
.flex2 { flex: 2; }

/* Gap entre itens flex dentro do fieldset address */
.address .flex { gap: 1.25rem; }

/* Wrapper com campo disabled perde opacidade */
.input-wrapper:has([disabled]) {
  opacity: 0.5;
}

/* Input disabled recebe cor de superfície */
input:disabled {
  background-color: var(--surface-disabled);
  border: 1px solid var(--stroke-default);
  color: var(--text-primary);
}
```

## Example

**Before (campos soltos sem estrutura):**
```html
<label>Rua</label>
<input type="text" disabled />
<label>Número</label>
<input type="number" />
<label>Cidade</label>
<input type="text" disabled />
```

**After (com fieldset, flex e disabled styling):**
```html
<fieldset class="address">
  <legend>Endereço residencial</legend>
  <div class="flex">
    <div class="input-wrapper flex2">
      <label for="street">Rua</label>
      <input type="text" id="street" name="street" value="Rosas e Flores" disabled />
    </div>
    <div class="input-wrapper flex1">
      <label for="number">Número</label>
      <input type="number" id="number" name="number" />
    </div>
  </div>
</fieldset>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campos preenchidos por API (CEP → rua, cidade) | `disabled` + `value` preenchido, wrapper com opacity |
| Proporção 2:1 entre campos na mesma linha | `flex2` no maior, `flex1` no menor |
| Espaçamento entre campos numa linha flex | `gap` no container flex, não margin nos filhos |
| Variável CSS não existe ainda | Adicione no `:root` do globals antes de usar |
| Múltiplos atributos iguais para renomear | Multi-cursor (Ctrl+D) para editar em lote |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `<div>` solto sem fieldset para agrupar endereço | `<fieldset class="address">` com `<legend>` |
| `style="opacity:0.5"` inline no input disabled | `.input-wrapper:has([disabled]) { opacity: 0.5 }` |
| `margin-right` em cada campo para espaçar | `gap: 1.25rem` no container flex |
| Estilizar só o input disabled, ignorando o label | Estilizar o wrapper inteiro via `:has([disabled])` |
| Criar `width: 66%` e `width: 33%` para proporções | `flex: 2` e `flex: 1` para proporções flexíveis |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `:has([disabled])` nao funciona | Navegador nao suporta `:has()` | Verificar compatibilidade (Chrome 105+, Safari 15.4+, Firefox 121+) |
| Campos disabled sem estilo visual diferente | Variavel `--surface-disabled` nao definida | Adicionar no `:root` do CSS global |
| Flex layout nao alinha campos lado a lado | Classe `.flex` ausente no container | Adicionar `class="flex"` no div pai dos campos |
| Label e input com `for/id` desalinhados | Atributos `for`, `id` e `name` nao coincidem | Usar multi-cursor (Ctrl+D) para renomear em lote |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre layout flex, seletor :has(), e design de campos disabled
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações