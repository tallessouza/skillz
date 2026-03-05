---
name: rs-angular-viewchild-focus
description: "Applies Angular @ViewChild pattern to access and manipulate DOM elements programmatically. Use when user asks to 'focus an input', 'access a DOM element', 'use ViewChild', 'manipulate element after action', or 'improve form UX'. Enforces correct ElementRef typing, template variable naming, and nativeElement access. Make sure to use this skill whenever Angular component needs direct DOM element access. Not for reactive forms, event binding, or structural directives."
---

# @ViewChild para Acesso a Elementos DOM

> Quando precisar acessar a instancia de um elemento HTML dentro do componente Angular, use @ViewChild com template variable e ElementRef tipado.

## Rules

1. **Crie uma template variable no elemento** — `#commentInput` no template, porque o ViewChild precisa de uma referencia nomeada para localizar o elemento
2. **Use ViewChild, nao ViewChildren** — `@ViewChild('ref')` para elemento unico, `@ViewChildren('ref')` para multiplos, porque a API correta evita bugs de selecao
3. **Tipe o ElementRef com o tipo HTML especifico** — `ElementRef<HTMLInputElement>` nao `ElementRef<any>`, porque tipagem especifica da acesso a propriedades e metodos corretos do elemento
4. **Use non-null assertion na declaracao** — `commentInputRef!: ElementRef<HTMLInputElement>`, porque o elemento estara disponivel quando usado apos o ciclo de vida do componente
5. **Acesse o DOM via nativeElement** — `this.ref.nativeElement.focus()`, porque acessar diretamente o DOM sem nativeElement quebra a abstracao do Angular
6. **Execute a manipulacao APOS a logica de negocio** — foque o input depois de salvar e resetar, porque a ordem garante que o estado esta limpo antes da interacao

## How to write

### Template variable no HTML

```html
<input
  type="text"
  [(ngModel)]="commentText"
  #commentInput
  placeholder="Adicionar comentário..."
/>
```

### ViewChild na classe do componente

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({ /* ... */ })
export class CommentComponent {
  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  onAddComment(): void {
    // 1. Logica de negocio
    this.comments.push(this.commentText);
    this.commentText = '';

    // 2. Manipulacao DOM por ultimo
    this.commentInputRef.nativeElement.focus();
  }
}
```

## Example

**Before (sem foco apos acao):**
```typescript
onAddComment(): void {
  this.comments.push(this.commentText);
  this.commentText = '';
  // Usuario perde o foco, precisa clicar no input manualmente
}
```

**After (com ViewChild e foco automatico):**
```typescript
@ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

onAddComment(): void {
  this.comments.push(this.commentText);
  this.commentText = '';
  this.commentInputRef.nativeElement.focus();
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Foco apos submit de formulario | ViewChild + `.focus()` no callback |
| Scroll ate elemento | ViewChild + `.scrollIntoView()` |
| Selecionar texto de input | ViewChild + `.select()` |
| Multiplos elementos para manipular | Use `@ViewChildren` com `QueryList` |
| Elemento dentro de *ngIf | Use `{ static: false }` (default) |
| Elemento sempre visivel | Use `{ static: true }` para acesso no ngOnInit |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `document.getElementById('input')` | `@ViewChild('input') ref!: ElementRef` |
| `ElementRef<any>` | `ElementRef<HTMLInputElement>` |
| `@ViewChild('ref') ref: ElementRef` (sem !) | `@ViewChild('ref') ref!: ElementRef` |
| Foco antes de resetar o formulario | Reset primeiro, foco depois |
| `@ViewChildren` para elemento unico | `@ViewChild` para elemento unico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
