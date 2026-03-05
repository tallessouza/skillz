---
name: rs-angular-view-encapsulation-shadow-dom
description: "Applies Angular Shadow DOM View Encapsulation rules when writing Angular components. Use when user asks to 'create a web component', 'encapsulate styles', 'use Shadow DOM', 'prevent style leaking', or 'build a micro frontend'. Enforces correct ViewEncapsulation.ShadowDom usage, Shadow Host patterns, and style scoping rules. Make sure to use this skill whenever creating Angular components that need total style isolation. Not for regular Angular components using Emulated or None encapsulation."
---

# View Encapsulation Shadow DOM no Angular

> Use ViewEncapsulation.ShadowDom apenas para Web Components que precisam de isolamento total de estilos — 99% dos componentes Angular nao precisam disso.

## Rules

1. **Use ShadowDom apenas para Web Components** — componentes normais usam Emulated (padrao), porque ShadowDom adiciona complexidade sem beneficio em apps convencionais
2. **Estilos do Shadow Host sao globais dentro do Shadow DOM** — tudo declarado no `styles` do componente Shadow Host afeta todos os filhos dentro do shadow boundary
3. **Estilos do Light DOM nao penetram o Shadow DOM** — `styles.css` global e estilos de componentes pai fora do shadow boundary nao afetam elementos dentro do Shadow Root
4. **Estilos internos nao vazam para fora** — estilos definidos dentro do Shadow DOM nao afetam elementos no Light DOM
5. **Componentes filhos dentro do Shadow Host seguem regras normais** — Emulated e None funcionam normalmente, mas sao isolados do Light DOM externo
6. **Shadow DOM e API do navegador, nao do Angular** — Angular apenas habilita a API nativa do browser via `ViewEncapsulation.ShadowDom`

## How to write

### Shadow Host Component

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shadow-host',
  template: `
    <p>Texto encapsulado</p>
    <app-child></app-child>
  `,
  styles: [`
    /* Global DENTRO do Shadow DOM — afeta todos os filhos */
    p { color: red; }
  `],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ShadowHostComponent {}
```

### Componente filho dentro do Shadow Host

```typescript
@Component({
  selector: 'app-child',
  template: `<p>Filho com Emulated normal</p>`,
  styles: [`
    /* Escopo local via Emulated — so afeta este template */
    p { font-family: cursive; }
  `]
  // encapsulation: ViewEncapsulation.Emulated (padrao, nao precisa declarar)
})
export class ChildComponent {}
```

## Example

**Before (estilo global vazando para Web Component):**
```typescript
// styles.css (global)
button { background-color: red; }

// Componente sem Shadow DOM — botao fica vermelho indesejavelmente
@Component({
  selector: 'app-widget',
  template: `<button>Meu botao</button>`,
})
export class WidgetComponent {}
```

**After (Web Component protegido com Shadow DOM):**
```typescript
// styles.css (global)
button { background-color: red; } // NAO afeta o widget

@Component({
  selector: 'app-widget',
  template: `<button>Meu botao</button>`,
  styles: [`button { background-color: green; }`],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class WidgetComponent {}
// Botao fica verde — isolado do Light DOM
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App Angular convencional | Use Emulated (padrao) — nunca ShadowDom |
| Criando Web Component / micro frontend | Use ShadowDom no componente raiz |
| Componente filho dentro de Shadow Host | Emulated ou None — ambos funcionam normalmente |
| Precisa que estilos globais afetem o componente | NAO use ShadowDom |
| Quer inspecionar no browser | Procure Shadow Root no DevTools dentro do elemento |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `ViewEncapsulation.ShadowDom` em todo componente | Use apenas no Shadow Host raiz do Web Component |
| Esperar que `styles.css` global afete Shadow DOM | Defina estilos dentro do proprio Shadow Host |
| Usar ShadowDom para "resolver" conflito de CSS em app normal | Use Emulated com nomes de classe mais especificos |
| Aplicar ShadowDom em componentes filhos dentro do Shadow Host | Deixe filhos como Emulated — herdam isolamento do Host |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
