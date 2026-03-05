---
name: rs-angular-intro-inputs-botoes
description: "Applies Angular @Input() decorator patterns when creating reusable components with dynamic properties. Use when user asks to 'create a component', 'make a button reusable', 'pass props to component', 'customize component text', or 'disable button conditionally'. Enforces input typing, conditional rendering with @if, and form-driven disable logic. Make sure to use this skill whenever building reusable Angular components that accept external data. Not for Angular signals, output events, or two-way binding with ngModel."
---

# Inputs em Componentes Angular

> Componentes reutilizaveis recebem dados via @Input() — nunca hardcode texto ou estado diretamente no template.

## Rules

1. **Declare inputs com tipo e valor padrao** — `textoBotao = ''` nao `textoBotao: any`, porque inputs sem default quebram silenciosamente quando o componente e usado sem passar o valor
2. **Import Input com letra maiuscula** — `import { Input } from '@angular/core'`, porque o auto-import pode trazer versoes minusculas incorretas
3. **Use @if para renderizacao condicional** — `@if (phClass) { <i> }` nao deixe tags vazias no DOM, porque elementos sem conteudo ocupam espaco visual indesejado
4. **Binding com colchetes passa expressao JS** — `[textoBotao]="'Gerar Certificado'"` precisa de aspas simples internas para strings, porque sem aspas o Angular interpreta como nome de variavel
5. **Sem colchetes passa string literal** — `textoBotao="Gerar Certificado"` e equivalente e mais limpo quando o valor e estatico
6. **Disable via Input boolean com logica no TypeScript** — calcule `formValido` no .ts, nao empilhe logica complexa no template, porque facilita teste e leitura

## How to write

### Input basico (texto)

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  template: `<button>{{ textoBotao }}</button>`
})
export class PrimaryButtonComponent {
  @Input() textoBotao: string = '';
}
```

### Input com renderizacao condicional

```typescript
@Component({
  selector: 'app-secondary-button',
  template: `
    <button>
      @if (phClass) {
        <i [class]="phClass"></i>
      }
      {{ textoBotao }}
    </button>
  `
})
export class SecondaryButtonComponent {
  @Input() textoBotao: string = '';
  @Input() phClass: string = '';
  @Input() disable: boolean = false;
}
```

### Disable com ngStyle

```typescript
// No template do botao
<button [ngStyle]="disable ? { 'opacity': '50%' } : {}">
  {{ textoBotao }}
</button>

// Requer importar CommonModule para ngStyle
```

### Logica de validacao no componente pai

```typescript
// certificado-form.component.ts
atividades: string[] = [];
nome: string = '';

get formValido(): boolean {
  return !(this.atividades.length > 0 && this.nome.length > 0);
  // Invertido porque disable=true desabilita
}
```

## Example

**Before (texto fixo, nao reutilizavel):**

```html
<!-- primary-button.component.html -->
<button>Botão Primário</button>

<!-- usado em formulario -->
<app-primary-button></app-primary-button>
<!-- sempre mostra "Botão Primário" em qualquer tela -->
```

**After (com inputs dinamicos):**

```html
<!-- primary-button.component.html -->
<button>{{ textoBotao }}</button>

<!-- formulario -->
<app-primary-button textoBotao="Gerar Certificado"></app-primary-button>

<!-- lista -->
<app-secondary-button textoBotao="Ver" [disable]="!formValido"></app-secondary-button>

<!-- com icone -->
<app-secondary-button
  textoBotao="Adicionar"
  phClass="ph ph-plus"
  [disable]="atividade.length === 0">
</app-secondary-button>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Texto varia por tela | Input string com default vazio |
| Elemento opcional (icone) | Input string + @if no template |
| Estado visual condicional (disable) | Input boolean + ngStyle |
| Valor e string fixa | Passe sem colchetes: `attr="valor"` |
| Valor e expressao/variavel | Passe com colchetes: `[attr]="variavel"` |
| Logica de disable complexa | Calcule no .ts com getter, passe resultado ao input |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `<button>Texto Fixo</button>` em componente reutilizavel | `<button>{{ textoBotao }}</button>` com @Input |
| `<i class="ph ph-plus"></i>` fixo | `@if (phClass) { <i [class]="phClass"></i> }` |
| `[disable]="atividades.length > 0 && nome.length > 0 && ..."` no template | `[disable]="formValido"` com getter no .ts |
| `@Input() disable: boolean = false` recebendo `form.invalid` (boolean\|null) | Adicione `!` assertion ou aceite `boolean \| null` |
| `import { input } from '@angular/core'` minusculo | `import { Input } from '@angular/core'` maiusculo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
