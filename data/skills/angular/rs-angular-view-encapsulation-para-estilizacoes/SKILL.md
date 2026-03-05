---
name: rs-angular-view-encapsulation
description: "Applies Angular View Encapsulation patterns when writing component styles. Use when user asks to 'style a component', 'fix CSS conflicts', 'create Angular component', 'encapsulate styles', or 'configure component encapsulation'. Enforces Emulated as default, explains None risks, guides Shadow DOM usage. Make sure to use this skill whenever generating Angular component styles or debugging CSS scope issues. Not for global styles in styles.css, non-Angular CSS, or general CSS architecture."
---

# View Encapsulation no Angular

> Estilos criados dentro de um componente Angular devem afetar apenas os elementos HTML daquele componente, nunca vazando para outros.

## Rules

1. **Use Emulated (padrao) em 99% dos casos** — nao mude o encapsulation sem motivo explicito, porque Emulated garante isolamento de estilos sem depender de suporte nativo do navegador
2. **Nunca use None em componentes de feature** — `ViewEncapsulation.None` transforma todos os estilos do componente em globais, causando conflitos impossiveis de rastrear em projetos grandes
3. **Evite seletores CSS genericos em estilos globais** — `p { color: blue }` no `styles.css` afeta TODOS os paragrafos da aplicacao, prefira classes especificas
4. **Entenda que estilos globais (styles.css) sempre penetram componentes** — mesmo com Emulated, o `styles.css` afeta elementos dentro de qualquer componente
5. **Reconheca os atributos _nghost e _ngcontent** — o Angular adiciona atributos unicos aos elementos para emular encapsulamento, nao os remova manualmente

## Tres estrategias

| Estrategia | Comportamento | Quando usar |
|------------|--------------|-------------|
| `Emulated` (padrao) | Angular adiciona atributos unicos para isolar estilos | Sempre — padrao recomendado |
| `ShadowDom` | Usa Shadow DOM nativo do navegador | Apenas se todos os navegadores-alvo suportam |
| `None` | Estilos do componente viram globais | Quase nunca — apenas para estilos utilitarios intencionalmente globais |

## How to write

### Componente com Emulated (padrao — nao precisa declarar)

```typescript
@Component({
  selector: 'app-product-card',
  template: `<p>Product card works!</p>`,
  styles: [`p { font-weight: bold; }`]
  // encapsulation: ViewEncapsulation.Emulated  ← implicito
})
export class ProductCardComponent {}
```

### Componente com None (cuidado — estilos viram globais)

```typescript
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `<p>Product card works!</p>`,
  styles: [`p { font-weight: bold; }`],
  encapsulation: ViewEncapsulation.None  // TODOS os <p> da app ficam bold
})
export class ProductCardComponent {}
```

## Example

**Before (None — estilos vazam):**
```typescript
@Component({
  selector: 'app-product-card',
  styles: [`p { font-weight: bold; }`],
  encapsulation: ViewEncapsulation.None
})
```
Resultado: TODOS os `<p>` da aplicacao ficam bold, incluindo outros componentes.

**After (Emulated — estilos isolados):**
```typescript
@Component({
  selector: 'app-product-card',
  styles: [`p { font-weight: bold; }`]
  // Emulated por padrao
})
```
Resultado: apenas o `<p>` dentro de ProductCard fica bold.

## Heuristics

| Situacao | Acao |
|----------|------|
| Criando componente novo | Deixe Emulated (nao declare nada) |
| CSS de um componente afetando outro | Verifique se alguem colocou `ViewEncapsulation.None` |
| Estilo global nao aplicando em componente | Normal com Shadow DOM — use `::ng-deep` ou mova para `styles.css` |
| Precisa de estilo utilitario global | Coloque no `styles.css`, nao use None no componente |
| Inspecionando elementos e viu `_ngcontent-xxx` | Atributo de emulacao do Angular — comportamento esperado |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `ViewEncapsulation.None` para "resolver" conflito CSS | Corrija o seletor CSS dentro do componente com Emulated |
| Seletor generico `p {}` no `styles.css` | Use classes especificas `.product-description {}` |
| Remover atributos `_nghost`/`_ngcontent` manualmente | Deixe o Angular gerenciar — sao internos |
| Mudar encapsulation sem entender o impacto | Mantenha Emulated e isole estilos por componente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
