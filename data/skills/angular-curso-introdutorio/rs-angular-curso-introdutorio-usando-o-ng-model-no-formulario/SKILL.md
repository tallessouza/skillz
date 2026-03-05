---
name: rs-angular-intro-ngmodel-formulario
description: "Applies Angular ngModel two-way binding patterns when building forms. Use when user asks to 'create a form', 'bind input', 'capture form values', 'use ngModel', or 'two-way binding in Angular'. Enforces correct FormsModule import, [(ngModel)] syntax, and list rendering with @for. Make sure to use this skill whenever generating Angular template-driven forms. Not for reactive forms, RxJS, or Angular signals."
---

# NgModel e Two-Way Binding em Formularios Angular

> Vincule inputs a variaveis com ngModel para capturar valores em tempo real, usando two-way binding.

## Rules

1. **Importe FormsModule antes de usar ngModel** — sem o import, o Angular ignora silenciosamente o `[(ngModel)]` e nao exibe erro claro no template
2. **Use a sintaxe banana-in-a-box `[(ngModel)]`** — os parenteses dentro dos colchetes `[()]` representam two-way binding: `[]` e property binding, `()` e event binding, juntos sincronizam nos dois sentidos
3. **Crie variaveis tipadas no componente para cada campo** — `nome: string = ''` no TypeScript, vinculada com `[(ngModel)]="nome"` no template, porque o ngModel precisa de uma referencia estavel
4. **Use `@for` para renderizar listas** — o bloco `@for` substitui `*ngFor` no Angular moderno, iterando sobre arrays vinculados ao componente
5. **Controle separadores com index e length** — use `$index + 1 !== items.length` para nao renderizar `<hr>` no ultimo item, porque evita separador orfao
6. **Two-way binding e para formularios, one-way binding e para exibicao de listas** — ngModel sincroniza input↔variavel; listas usam interpolacao `{{ }}` que e one-way (codigo→template)

## How to write

### Setup do FormsModule

```typescript
// No componente standalone ou no modulo
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  // ...
})
```

### Vinculando inputs com ngModel

```html
<input type="text" [(ngModel)]="nome" placeholder="Nome" />
<input type="text" [(ngModel)]="atividade" placeholder="Atividade" />
```

```typescript
export class CertificadoFormComponent {
  nome: string = '';
  atividade: string = '';
  atividades: string[] = [];
}
```

### Renderizando lista com @for e separador condicional

```html
<div class="item-list">
  @for (atividade of atividades; track $index) {
    <div class="item">{{ atividade }}</div>
    @if ($index + 1 !== atividades.length) {
      <hr />
    }
  }
</div>
```

## Example

**Before (sem ngModel, captura manual):**
```typescript
// Componente
export class FormComponent {
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log(value);
  }
}
```
```html
<input (input)="onInput($event)" />
```

**After (com ngModel, two-way binding):**
```typescript
export class FormComponent {
  nome: string = '';
  atividade: string = '';
  atividades: string[] = [];
}
```
```html
<input [(ngModel)]="nome" />
<input [(ngModel)]="atividade" />

@for (atividade of atividades; track $index) {
  <div>{{ atividade }}</div>
  @if ($index + 1 !== atividades.length) {
    <hr />
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Formulario simples com poucos campos | Use ngModel (template-driven) |
| Formulario complexo com validacoes dinamicas | Considere ReactiveForms |
| Precisa exibir valor do input em tempo real | `[(ngModel)]` + interpolacao `{{ variavel }}` |
| Lista que reflete mudancas no array | One-way binding com `@for` |
| Ultimo item da lista sem separador | `@if ($index + 1 !== items.length)` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `[(ngModel)]` sem importar FormsModule | Adicione `FormsModule` nos imports do componente |
| `[ngModel]="var"` (apenas property binding) | `[(ngModel)]="var"` (two-way com banana-in-a-box) |
| `*ngFor` em Angular 17+ | `@for (item of items; track $index)` |
| `<hr>` fixo em todos os itens da lista | `@if` condicional com index para omitir no ultimo |
| Capturar valor com `$event.target.value` manualmente | `[(ngModel)]` para binding automatico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
