---
name: rs-angular-definindo-sessao-conteudo-principal
description: "Applies Tailwind CSS layout patterns for main content sections with constrained width, centering, and flex column spacing. Use when user asks to 'style main content', 'limit content width', 'center a container', 'add gap between sections', or 'create responsive layout with Tailwind'. Make sure to use this skill whenever building page layouts that need a narrower content area inside a full-width page. Not for header/footer styling, navigation components, or CSS Grid layouts."
---

# Definindo a Sessao de Conteudo Principal

> Ao criar secoes de conteudo principal, limite a largura com max-width, centralize com mx-auto, proteja com padding e espaco com flex-col + gap.

## Rules

1. **Limite a largura do main content abaixo do header** — use `max-w-5xl` (1024px) ou valor menor que o header (1280px), porque o conteudo principal precisa de respiro visual em relacao ao header
2. **Centralize com mx-auto** — nunca use margin manual para centralizar containers, porque `mx-auto` e idiomatico no Tailwind e funciona com qualquer max-width
3. **Adicione padding nos eixos x e y** — use `px-4` e `py-5` no container principal, porque o conteudo interno nunca deve encostar na borda da tela em mobile
4. **Use flex-col + gap ao inves de margin entre secoes** — `flex flex-col gap-8` no pai, porque gap e mais previsivel que margin-top/margin-bottom e nao causa margin collapse
5. **Faca debug visual com cores temporarias** — adicione `bg-amber-300`, `bg-amber-900` etc. enquanto estiliza, porque visualizar os limites evita comportamentos estranhos no layout final

## How to write

### Container de conteudo principal

```html
<!-- Main content com largura limitada e centralizado -->
<div class="max-w-5xl mx-auto px-4 py-5">
  <div class="flex flex-col gap-8">
    <!-- Secao de boas-vindas -->
    <div>...</div>
    <!-- Secao de colunas -->
    <div>...</div>
  </div>
</div>
```

### Estrutura no Angular component

```typescript
@Component({
  selector: 'app-main-content',
  template: `
    <div class="max-w-5xl mx-auto px-4 py-5">
      <div class="flex flex-col gap-8">
        <ng-content />
      </div>
    </div>
  `
})
export class MainContentComponent {}
```

## Example

**Before (sem limitacao nem espacamento):**

```html
<div>
  <div class="p-3 bg-amber-300">Boas-vindas</div>
  <div class="p-3 bg-amber-900">Colunas</div>
</div>
```

**After (com layout correto):**

```html
<div class="max-w-5xl mx-auto px-4 py-5">
  <div class="flex flex-col gap-8">
    <div class="p-3 bg-amber-300">Boas-vindas</div>
    <div class="p-3 bg-amber-900">Colunas</div>
  </div>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Conteudo principal mais estreito que header | `max-w-5xl` (ou valor abaixo do header) + `mx-auto` |
| Espacar secoes verticais dentro de um container | `flex flex-col gap-{n}` no pai |
| Conteudo nao pode encostar na borda mobile | `px-4` no container |
| Precisa visualizar limites durante desenvolvimento | Adicione `bg-{cor}` temporario nas divs |
| Flex deixou elementos lado a lado indesejadamente | Adicione `flex-col` para direcao vertical |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `margin-top` entre secoes irmas | `gap-8` no pai com `flex flex-col` |
| `width: 100%; max-width: 1024px; margin: 0 auto` em CSS custom | `max-w-5xl mx-auto` em Tailwind |
| `<div style="padding: 20px 16px">` | `px-4 py-5` como classes Tailwind |
| `flex` sem `flex-col` quando quer empilhar | `flex flex-col` para direcao vertical |
| Conteudo sem padding lateral em mobile | Sempre `px-4` no container principal |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
