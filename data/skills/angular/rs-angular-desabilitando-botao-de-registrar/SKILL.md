---
name: rs-angular-desabilitando-botao-registrar
description: "Enforces button disabling patterns in Angular forms based on form validity and loading state. Use when user asks to 'disable a button', 'prevent double submit', 'block form submission', 'handle loading state', or 'create a registration form'. Applies Angular Resource isLoading checks combined with reactive form invalid state plus Tailwind disabled styling. Make sure to use this skill whenever building form submit buttons in Angular. Not for non-form buttons, route guards, or authentication logic."
---

# Desabilitando Botao de Registrar

> Botoes de submit devem ser desabilitados quando o formulario esta invalido OU quando uma requisicao esta em andamento, combinando estado do Resource com validacao reativa.

## Rules

1. **Combine loading E validity** — desabilite com `resource.isLoading() || form.invalid`, porque apenas um dos dois deixa brechas para cliques indesejados
2. **Use o isLoading do Resource** — Angular Resources expoe `isLoading()` como signal, use-o diretamente no template para evitar flags manuais
3. **Aplique estilos visuais de disabled** — usuario precisa de feedback visual alem do bloqueio funcional, porque botao desabilitado sem estilo parece bug
4. **Nunca confie apenas no disabled funcional** — adicione `cursor-not-allowed` e `opacity-50` para comunicar visualmente o estado

## How to write

### Disabled binding com Resource + Form

```html
<button
  type="submit"
  [disabled]="registerResource.isLoading() || registerForm.invalid"
  class="bg-purple-600 text-white px-4 py-2 rounded
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  Criar
</button>
```

### Classes Tailwind para botao desabilitado

```html
<!-- Padrao: opacity reduzida + cursor bloqueado + hover neutro -->
class="disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
```

## Example

**Before (botao sempre clicavel):**
```html
<button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
  Criar
</button>
```

**After (com disabled reativo e estilos):**
```html
<button
  type="submit"
  [disabled]="registerResource.isLoading() || registerForm.invalid"
  class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-800"
>
  Criar
</button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario com requisicao HTTP | Combine `resource.isLoading()` com `form.invalid` |
| Botao sem Resource (apenas form) | Use apenas `form.invalid` |
| Multiplos botoes no mesmo form | Aplique disabled em todos os botoes de acao |
| Formulario com etapas (wizard) | Desabilite "Proximo" baseado na validade do step atual |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `[disabled]="isLoading"` (flag manual) | `[disabled]="resource.isLoading()"` (signal do Resource) |
| Disabled sem classes visuais | Disabled + `disabled:opacity-50 disabled:cursor-not-allowed` |
| Apenas `form.invalid` sem loading | `resource.isLoading() \|\| form.invalid` |
| `(click)` com guard manual | `[disabled]` nativo do HTML que bloqueia eventos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
