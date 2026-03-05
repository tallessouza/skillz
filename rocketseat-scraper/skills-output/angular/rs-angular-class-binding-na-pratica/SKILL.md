---
name: rs-angular-class-binding-na-pratica
description: "Applies Angular class binding patterns when writing Angular components with dynamic CSS classes. Use when user asks to 'toggle a class', 'add conditional class', 'show/hide element', 'create active/inactive button', or 'validate input styling' in Angular. Covers [class.name] syntax, boolean-driven class toggling, and visibility patterns. Make sure to use this skill whenever generating Angular templates with dynamic classes. Not for style binding, ngStyle, or CSS-only solutions without Angular bindings."
---

# Class Binding no Angular

> Utilize class binding para adicionar ou remover classes CSS dinamicamente baseado em propriedades booleanas do componente.

## Rules

1. **Use `[class.nomeDaClasse]` com expressao booleana** — `[class.active]="isActive"` nao manipulacao direta do DOM, porque o Angular gerencia o binding reativo automaticamente
2. **Classes fixas e dinamicas coexistem** — coloque classes fixas no atributo `class` normal e classes dinamicas no `[class.x]`, porque sao independentes e nao se sobrescrevem
3. **Booleanos controlam classes** — a propriedade que controla o binding deve ser `boolean`, porque simplifica a logica e evita coercoes inesperadas
4. **Prefira `@if` sobre `display: none` para remover elementos** — `@if` remove do DOM (melhor performance), `display: none` mantém no DOM consumindo recursos, porque componentes ocultos com display none ainda processam
5. **Use `opacity: 0` apenas para transicoes fade** — opacity mantem o elemento no DOM ocupando espaco, porque e util para animacoes mas inadequado para ocultacao real

## How to write

### Toggle de classe com booleano

```typescript
@Component({
  template: `
    <button
      [class.active]="isActive"
      (click)="toggleActive()">
      {{ isActive ? 'Ativo' : 'Inativo' }}
    </button>
  `
})
export class ActiveButtonComponent {
  isActive = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
}
```

### Classe fixa + classe dinamica no mesmo elemento

```html
<!-- class="message-box" e sempre aplicada, hidden e condicional -->
<div class="message-box" [class.hidden]="isHidden">
  Conteudo aqui
</div>
```

### Validacao de input com classe de erro

```typescript
@Component({
  template: `
    <input [class.is-invalid]="hasError" (input)="checkInput($event)" />
    @if (hasError) {
      <p class="error-text">O campo nao pode estar vazio</p>
    }
  `
})
export class InvalidInputComponent {
  hasError = false;

  checkInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.hasError = value.trim() === '';
  }
}
```

## Example

**Before (manipulacao manual de classes):**
```typescript
template: `<div id="box">Texto</div>`
// No componente:
document.getElementById('box')?.classList.toggle('active');
```

**After (com class binding Angular):**
```typescript
template: `<div [class.active]="isActive">Texto</div>`
// No componente:
isActive = false;
toggle() { this.isActive = !this.isActive; }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Alternar estado visual (ativo/inativo) | `[class.active]="isActive"` com toggle booleano |
| Validacao visual de input | `[class.is-invalid]="hasError"` + `@if` para mensagem |
| Mostrar/ocultar com fade | `[class.hidden]` + CSS `opacity: 0` com `transition` |
| Remover elemento completamente | `@if (condicao)` em vez de class binding com display none |
| Classe sempre presente + classe condicional | `class="fixa"` + `[class.dinamica]="bool"` no mesmo elemento |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `document.getElementById().classList.toggle()` | `[class.active]="isActive"` |
| `[ngClass]="{'active': isActive}"` para uma unica classe | `[class.active]="isActive"` |
| `display: none` para ocultar componentes pesados | `@if (condicao)` para remover do DOM |
| Logica complexa dentro do template binding | Propriedade booleana no componente |
| `opacity: 0` para ocultacao permanente | `@if` ou `display: none` conforme o caso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
