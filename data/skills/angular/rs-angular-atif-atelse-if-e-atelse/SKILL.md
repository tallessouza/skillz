---
name: rs-angular-atif-atelse-if-e-atelse
description: "Enforces Angular @if/@else-if/@else template syntax when writing Angular components. Use when user asks to 'create an Angular component', 'add conditional rendering', 'show/hide elements', 'use ngIf', or 'make template dynamic'. Applies the modern @if block syntax instead of legacy *ngIf directive, with proper @else-if chaining and variable capture. Make sure to use this skill whenever generating Angular template code with conditions, even if the user mentions ngIf. Not for React/Vue conditionals, RxJS operators, or route guards."
---

# @if, @else-if e @else no Angular

> Use sempre a sintaxe de blocos @if nos templates Angular — nunca *ngIf em projetos novos.

## Rules

1. **Use @if em vez de *ngIf** — `@if (condition) { }` nao `*ngIf="condition"`, porque a sintaxe de blocos e mais legivel, performatica e nao requer imports
2. **Nao importe nada para usar @if** — diferente do *ngIf que exige `CommonModule` ou `NgIf` no imports, o @if funciona nativamente sem imports
3. **Encadeie com @else if e @else** — `@else if (condition) { }` e `@else { }` substituem o padrao verboso de ng-template com template variables
4. **Capture o resultado da expressao com `as`** — `@if (expression; as result) { }` permite reutilizar o valor retornado dentro do bloco
5. **Qualquer expressao JavaScript valida funciona** — verificar propriedades de objetos, arrays, comparacoes — o mesmo que voce faria num if JavaScript

## How to write

### Condicional simples

```html
@if (userRole === 'admin') {
  <p>Bem-vindo, administrador!</p>
}
```

### Condicional com @else if e @else

```html
@if (userRole === 'admin') {
  <p>Painel do Administrador</p>
} @else if (userRole === 'editor') {
  <p>Painel do Editor</p>
} @else {
  <p>Painel do Visualizador</p>
}
```

### Captura de valor com `as`

```html
@if (getUserPermissions(); as permissions) {
  <p>Permissoes: {{ permissions }}</p>
}
```

### Componente completo

```typescript
type UserRole = 'admin' | 'editor' | 'viewer';

@Component({
  selector: 'app-role-panel',
  template: `
    <h2>Painel do Usuario</h2>
    @if (userRole === 'admin') {
      <p>Administrador: acesso total</p>
    } @else if (userRole === 'editor') {
      <p>Editor: pode editar conteudo</p>
    } @else {
      <p>Visualizador: somente leitura</p>
    }
    <button (click)="setUserRole('admin')">Admin</button>
    <button (click)="setUserRole('editor')">Editor</button>
    <button (click)="setUserRole('viewer')">Viewer</button>
  `
})
export class RolePanelComponent {
  userRole: UserRole = 'viewer';

  setUserRole(role: UserRole) {
    this.userRole = role;
  }
}
```

## Example

**Before (legado com *ngIf):**

```html
<div *ngIf="userRole === 'admin'; else editorBlock">
  <p>Administrador</p>
</div>
<ng-template #editorBlock>
  <div *ngIf="userRole === 'editor'; else viewerBlock">
    <p>Editor</p>
  </div>
</ng-template>
<ng-template #viewerBlock>
  <p>Visualizador</p>
</ng-template>
```

```typescript
// Requer import no componente:
imports: [CommonModule] // ou [NgIf]
```

**After (moderno com @if):**

```html
@if (userRole === 'admin') {
  <p>Administrador</p>
} @else if (userRole === 'editor') {
  <p>Editor</p>
} @else {
  <p>Visualizador</p>
}
```

```typescript
// Nenhum import necessario
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo (Angular 17+) | Sempre @if, nunca *ngIf |
| Projeto legado com *ngIf existente | Mantenha consistencia, mas prefira @if em novos componentes |
| Condicao simples sem else | `@if (condition) { }` apenas |
| Precisa do valor da expressao dentro do bloco | Use `@if (expr; as variable) { }` |
| Multiplas condicoes mutuamente exclusivas | Encadeie @else if, termine com @else |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `*ngIf="condition"` (projeto novo) | `@if (condition) { }` |
| `ng-template` + `#templateVar` para else | `@else { }` direto |
| `imports: [CommonModule]` so para ngIf | Remova — @if nao precisa de import |
| `*ngIf="x; else tpl"` com ng-template encadeado | `@if (x) { } @else if (y) { } @else { }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
