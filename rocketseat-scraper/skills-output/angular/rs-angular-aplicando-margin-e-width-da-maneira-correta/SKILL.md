---
name: rs-angular-margin-width-reutilizavel
description: "Enforces reusable component styling by keeping width and margin out of child components. Use when user asks to 'create a component', 'style a card', 'make reusable component', 'build a shared UI element', or any Angular component creation task. Applies rule: never hardcode width or margin in reusable components — let the parent define layout constraints. Make sure to use this skill whenever creating Angular components that may be used in multiple contexts. Not for page-level layout, global styles, or non-reusable one-off components."
---

# Componentes Reutilizáveis: Width e Margin no Pai

> Nunca defina width ou margin no componente filho reutilizável — o componente pai controla o layout externo.

## Rules

1. **Nunca coloque width/max-width no componente reutilizável** — porque cada contexto de uso precisa de tamanhos diferentes; chumbar um valor limita o componente a um único cenário
2. **Nunca coloque margin no componente reutilizável** — porque margens dependem dos elementos vizinhos, que mudam em cada página/contexto
3. **Defina width e margin na div wrapper do componente pai** — porque o pai conhece o contexto de layout e sabe qual tamanho e espaçamento são necessários
4. **Componente filho cuida apenas do visual interno** — padding, cores, tipografia, bordas são responsabilidade do filho; posicionamento externo é do pai
5. **Pense em reutilização desde a criação** — pergunte "esse componente pode aparecer em outro lugar com tamanho diferente?" Se sim, não chumbe dimensões

## How to write

### Componente filho (card reutilizável)

```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card-container">
      <div class="card-header"><h2>Header</h2></div>
      <div class="card-body"><p>Content</p></div>
      <div class="card-footer"><span>Footer</span></div>
    </div>
  `,
  styles: [`
    /* Largura e margens NAO estao aqui — o pai define o layout externo */
    .card-container {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
    }
  `]
})
export class CardComponent {}
```

### Componente pai (controla layout)

```typescript
@Component({
  selector: 'app-page',
  template: `
    <div class="card-small">
      <app-card />
    </div>
    <div class="card-centered">
      <app-card />
    </div>
    <div class="card-full">
      <app-card />
    </div>
  `,
  styles: [`
    .card-small {
      max-width: 400px;
      width: 100%;
      margin-bottom: 20px;
    }
    .card-centered {
      max-width: 600px;
      width: 100%;
      margin: 0 auto 30px auto;
    }
    .card-full {
      width: 100%;
    }
  `]
})
export class PageComponent {}
```

## Example

**Before (width e margin chumbados no filho):**

```typescript
// card.component.ts — ERRADO
styles: [`
  .card-container {
    max-width: 400px;
    width: 100%;
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid #ccc;
  }
`]
```

**After (pai controla layout, filho cuida do visual interno):**

```typescript
// card.component.ts — CORRETO
styles: [`
  .card-container {
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
`]

// page.component.ts — pai define layout
styles: [`
  .card-wrapper {
    max-width: 400px;
    width: 100%;
    margin-bottom: 20px;
  }
`]
```

## Heuristics

| Situação | Faça |
|----------|------|
| Componente usado em 1+ páginas | Width e margin no pai |
| Componente usado apenas 1 vez, nunca será reutilizado | Pode chumbar (mas pense duas vezes) |
| Padding interno do componente | Defina no próprio componente |
| Espaçamento entre componentes irmãos | Defina no pai com margin ou gap |
| Centralização horizontal | `margin: 0 auto` na div wrapper do pai |

## Anti-patterns

| Nunca escreva (no filho) | Escreva no pai |
|--------------------------|----------------|
| `max-width: 400px` no card | `.card-wrapper { max-width: 400px }` |
| `margin-bottom: 20px` no card | `.card-wrapper { margin-bottom: 20px }` |
| `width: 50%` no botão reutilizável | `.button-area { width: 50% }` |
| `margin: 0 auto` no card | `.card-centered { margin: 0 auto }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
