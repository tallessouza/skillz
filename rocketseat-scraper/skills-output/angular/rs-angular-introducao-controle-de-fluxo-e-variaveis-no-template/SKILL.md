---
name: rs-angular-controle-fluxo-template
description: "Applies Angular template control flow syntax (@if, @else, @switch, @for, @let) when writing Angular component templates. Use when user asks to 'create an Angular component', 'add conditional rendering in Angular', 'loop through a list in Angular template', 'show or hide elements', or 'use @if @for @switch @let in Angular'. Make sure to use this skill whenever generating Angular template code that needs conditionals, loops, or template variables. Not for React, Vue, or non-Angular frameworks."
---

# Controle de Fluxo e Variáveis no Template Angular

> Usar a sintaxe nativa de controle de fluxo do Angular (@if, @for, @switch, @let) para tornar templates dinâmicos baseados em propriedades da classe do componente.

## Rules

1. **Use @if/@else if/@else para renderizacao condicional** — `@if (condition) { <element/> }` nao `*ngIf`, porque a nova sintaxe e nativa, mais legivel e com melhor tree-shaking
2. **Use @switch para multiplas condicoes sobre o mesmo valor** — equivalente ao switch do JavaScript, porque evita cadeias longas de @if/@else if
3. **Use @for para iterar sobre listas** — `@for (item of items; track item.id) { }` nao `*ngFor`, porque exige track obrigatorio e melhora performance
4. **Use @let para criar variaveis locais no template** — `@let userName = user.name;` porque simplifica leitura e evita chamadas repetidas a expressoes complexas
5. **Condicoes referenciam propriedades da classe** — a logica vive na classe do componente, o template apenas consulta, porque mantem separacao de responsabilidades
6. **Sempre forneca @empty no @for quando a lista pode estar vazia** — porque melhora UX mostrando estado vazio

## How to write

### Condicional simples
```html
@if (isLoggedIn) {
  <p>Bem-vindo, {{ userName }}!</p>
} @else {
  <p>Faca login para continuar.</p>
}
```

### Switch
```html
@switch (userRole) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('editor') {
    <app-editor-panel />
  }
  @default {
    <app-viewer />
  }
}
```

### Loop com @for
```html
@for (product of products; track product.id) {
  <app-product-card [product]="product" />
} @empty {
  <p>Nenhum produto encontrado.</p>
}
```

### Variavel local com @let
```html
@let fullName = user.firstName + ' ' + user.lastName;
<h2>{{ fullName }}</h2>
```

## Example

**Before (diretivas legadas):**
```html
<p *ngIf="isLoggedIn; else loginTpl">Bem-vindo!</p>
<ng-template #loginTpl><p>Faca login.</p></ng-template>

<li *ngFor="let item of items">{{ item.name }}</li>
```

**After (com esta skill aplicada):**
```html
@if (isLoggedIn) {
  <p>Bem-vindo!</p>
} @else {
  <p>Faca login.</p>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>Nenhum item encontrado.</li>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mostrar/ocultar um elemento baseado em booleano | @if |
| Escolher entre 3+ opcoes do mesmo valor | @switch |
| Renderizar lista de itens | @for com track obrigatorio |
| Expressao complexa usada multiplas vezes no template | @let para criar variavel local |
| Lista pode estar vazia | @for com @empty |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `*ngIf="condition"` | `@if (condition) { }` |
| `*ngFor="let x of list"` | `@for (x of list; track x.id) { }` |
| `*ngSwitch` / `*ngSwitchCase` | `@switch / @case` |
| `ng-template` com ref para else | `@else { }` inline |
| Expressao duplicada no template | `@let variable = expression;` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
