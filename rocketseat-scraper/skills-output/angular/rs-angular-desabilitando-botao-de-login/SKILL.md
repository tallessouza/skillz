---
name: rs-angular-desabilitando-botao-de-login
description: "Applies Angular button disabling patterns based on form validity and loading state. Use when user asks to 'disable a button', 'prevent double submit', 'handle form submission state', 'block button while loading', or 'disable during HTTP request'. Combines reactive form validation with rxResource/signal loading state. Make sure to use this skill whenever implementing submit buttons in Angular reactive forms. Not for non-Angular frameworks, CSS-only disabled styling, or backend validation logic."
---

# Desabilitando Botao com Form Validity + Loading State

> Vincule o atributo `disabled` do botao a duas condicoes: formulario invalido OU requisicao em processamento.

## Rules

1. **Sempre desabilite botoes de submit em duas condicoes** — form invalido E loading ativo, porque evita requisicoes desnecessarias e duplo-clique
2. **Use property binding no disabled** — `[disabled]="expression"`, porque e a forma Angular de controlar atributos HTML reativamente
3. **Acesse isLoading do resource como signal** — `loginResource.isLoading()`, porque rxResource expoe signals reativos para status
4. **Acesse invalid direto do form** — `loginForm.invalid`, porque reactive forms ja expoe essa propriedade
5. **Adicione feedback visual ao estado disabled** — opacity reduzida + cursor not-allowed, porque o usuario precisa perceber que o botao esta inativo

## How to write

### Property binding no botao

```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  Entrar
</button>
```

### Padrao geral para qualquer submit button

```html
<button
  [disabled]="resource.isLoading() || form.invalid"
  class="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {{ resource.isLoading() ? 'Processando...' : 'Enviar' }}
</button>
```

## Example

**Before (botao sempre clicavel):**
```html
<button type="submit" class="w-full bg-purple-800 text-white font-bold py-3 rounded-lg">
  Entrar
</button>
```

**After (com disabled reativo):**
```html
<button
  type="submit"
  [disabled]="loginResource.isLoading() || loginForm.invalid"
  class="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  Entrar
</button>
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Formulario com validacao | Sempre vincule `form.invalid` ao disabled |
| Requisicao HTTP no submit | Combine com `resource.isLoading()` |
| Botao desabilitado sem feedback visual | Adicione classes Tailwind `disabled:` |
| Hover style vaza no disabled | Use `disabled:hover:bg-{cor-original}` para neutralizar |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Botao submit sem disabled | `[disabled]="form.invalid"` no minimo |
| Verificar validade apenas no handler | Desabilitar o botao preventivamente |
| Disabled sem feedback visual | `disabled:opacity-50 disabled:cursor-not-allowed` |
| Esquecer de neutralizar hover no disabled | `disabled:hover:bg-{mesma-cor-base}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
