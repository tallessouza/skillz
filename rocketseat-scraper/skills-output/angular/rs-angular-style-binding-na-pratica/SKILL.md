---
name: rs-angular-style-binding-na-pratica
description: "Applies Angular style binding patterns when building dynamic components. Use when user asks to 'bind styles', 'dynamic styling', 'change CSS dynamically', 'style binding Angular', 'progress bar component', or 'animate element with Angular'. Enforces correct syntax for unit suffixes (.px, .rem, .%), hardcoded string values, and transition pairing. Make sure to use this skill whenever generating Angular components with dynamic inline styles. Not for class binding, ngClass, or global CSS theming."
---

# Style Binding no Angular — Prática

> Ao aplicar style binding no Angular, vincule propriedades CSS diretamente a propriedades da classe do componente, usando sufixos de unidade no binding e transitions no CSS para fluidez.

## Rules

1. **Use sufixo de unidade no binding** — `[style.font-size.rem]="valor"` nao `[style.font-size]="valor + 'rem'"`, porque o Angular converte automaticamente e evita erros de concatenacao
2. **Valores chumbados em string** — `[style.right]="'10px'"` com aspas internas, porque sem aspas o Angular interpreta como nome de propriedade da classe
3. **Combine com CSS transition** — sempre que o style binding muda valores visuais, adicione `transition: propriedade duração easing` no CSS, porque sem isso a mudanca eh abrupta e sem feedback visual
4. **Limites min/max na logica** — defina limites com `Math.min`/`Math.max` ou condicionais, porque style binding sem limites causa overflow visual
5. **Uma propriedade por binding** — `[style.left.%]="posicao"` separado de `[style.top.vh]="altura"`, porque cada propriedade CSS recebe seu proprio binding
6. **Propriedade numerica na classe, unidade no template** — a classe armazena `number`, o template aplica a unidade (`.px`, `.rem`, `.%`), porque isso separa logica de apresentacao

## How to write

### Style binding com unidade

```typescript
// Template — unidade no sufixo do binding
<p [style.font-size.rem]="tamanhoTexto">Texto dinâmico</p>

// Classe — valor numerico puro
tamanhoTexto = 1.2;
```

### Style binding com valor chumbado

```html
<!-- Valor fixo precisa de aspas internas (string literal) -->
<div [style.right]="'10px'" [style.top.vh]="alturaPopup"></div>
```

### Metodo com limites

```typescript
aumentar() {
  this.progresso = Math.min(this.progresso + 30, 300);
}

diminuir() {
  this.tamanhoTexto = Math.max(this.tamanhoTexto - 0.2, 0.8);
}
```

### CSS transition pareado

```css
.progress-bar-fill {
  background-color: green;
  height: 100%;
  /* transition na mesma propriedade do style binding */
  transition: width 0.3s ease-out;
}
```

## Example

**Before (erro comum):**

```html
<!-- Unidade concatenada manualmente -->
<div [style.width]="progresso + 'px'"></div>

<!-- Valor fixo sem aspas internas — Angular busca propriedade "10px" -->
<div [style.right]="10px"></div>
```

```typescript
// Sem limites — cresce infinitamente
aumentar() {
  this.progresso += 30;
}
```

**After (com esta skill aplicada):**

```html
<!-- Sufixo de unidade no binding -->
<div [style.width.px]="progresso"></div>

<!-- Valor fixo como string literal -->
<div [style.right]="'10px'"></div>
```

```typescript
// Com limite maximo
aumentar() {
  this.progresso = Math.min(this.progresso + 30, 300);
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade CSS com unidade (px, rem, %, vh) | Use sufixo no binding: `[style.prop.unit]` |
| Valor fixo no style binding | Passe como string: `"'valor'"` |
| Valor muda visualmente | Adicione `transition` no CSS da mesma propriedade |
| Valor numerico cresce/diminui | Implemente limites min/max |
| Toggle entre dois estados | Use ternario na propriedade: `cond ? valA : valB` |
| Multiplas propriedades CSS dinamicas | Bindings separados, um por propriedade |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `[style.width]="val + 'px'"` | `[style.width.px]="val"` |
| `[style.right]="10px"` | `[style.right]="'10px'"` |
| `this.progresso += 30` (sem limite) | `this.progresso = Math.min(this.progresso + 30, MAX)` |
| Style binding sem transition no CSS | `transition: width 0.3s ease-out` pareado |
| `[style]="'font-size:' + val + 'rem'"` | `[style.font-size.rem]="val"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
