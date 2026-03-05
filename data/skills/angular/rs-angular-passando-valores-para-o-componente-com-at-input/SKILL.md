---
name: rs-angular-input-decorator
description: "Applies Angular @Input decorator patterns when creating parent-child component communication. Use when user asks to 'pass data to component', 'create child component', 'componentize', 'split component', or 'use @Input in Angular'. Enforces proper typing, required inputs, dumb component pattern, and interface separation. Make sure to use this skill whenever creating Angular components that receive data from parents. Not for @Output, EventEmitter, services, or state management."
---

# Comunicacao Parent-Child com @Input no Angular

> Ao criar componentes Angular que recebem dados do pai, use @Input com tipagem forte, required quando obrigatorio, e mantenha o componente filho como Dumb Component.

## Rules

1. **Sempre tipe o @Input com interface** — `@Input({ required: true }) pessoa!: IPessoa`, porque sem tipagem voce perde autocomplete e seguranca em tempo de compilacao
2. **Interfaces em arquivo separado** — crie `interfaces/pessoa.interface.ts`, nunca dentro do componente, porque interfaces sao reutilizaveis entre componentes
3. **Use required: true quando o input e obrigatorio** — `@Input({ required: true })`, porque o Angular vai reclamar em tempo de compilacao se o pai esquecer de passar o valor
4. **Use ! (definite assignment) em inputs required** — `pessoa!: IPessoa` em vez de inicializar objeto vazio, porque o Angular garante que o valor estara presente e um objeto vazio pode causar bugs silenciosos
5. **Prefira Dumb Components** — componentes que apenas recebem dados via @Input e fazem display, sem HTTP requests ou logica complexa, porque facilita manutencao e testes
6. **Nome do input = nome da propriedade** — evite alias salvo quando renomear a propriedade quebraria muitos consumidores, porque alias esconde o nome real e confunde

## How to write

### Interface separada

```typescript
// interfaces/pessoa.interface.ts
export interface IPessoa {
  id: number;
  nome: string;
  idade: number;
  endereco?: {
    rua: string;
    numero: string;
  };
}
```

### Componente filho (Dumb Component)

```typescript
// pessoa.component.ts
import { Component, Input } from '@angular/core';
import { IPessoa } from '../../interfaces/pessoa.interface';

@Component({
  selector: 'app-pessoa',
  standalone: true,
  templateUrl: './pessoa.component.html',
})
export class PessoaComponent {
  @Input({ required: true }) pessoa!: IPessoa;
}
```

### Componente pai passando valor

```html
<!-- input.component.html -->
@for (pessoa of pessoas; track pessoa.id) {
  <app-pessoa [pessoa]="pessoa" />
}
```

## Example

**Before (tudo num componente so):**

```html
<!-- Componente pai com toda a logica de renderizacao -->
@for (pessoa of pessoas; track pessoa.id) {
  <div>
    <p>{{ pessoa.nome }} - {{ pessoa.idade }}</p>
    @if (pessoa.endereco) {
      <p>{{ pessoa.endereco.rua }}, {{ pessoa.endereco.numero }}</p>
    }
    <button (click)="removerPessoa(pessoa.id)">Remover</button>
  </div>
}
```

**After (componentizado com @Input):**

```html
<!-- Componente pai - limpo e legivel -->
@for (pessoa of pessoas; track pessoa.id) {
  <app-pessoa [pessoa]="pessoa" />
}
```

```html
<!-- pessoa.component.html - Dumb Component -->
<div>
  <p>{{ pessoa.nome }} - {{ pessoa.idade }}</p>
  @if (pessoa.endereco) {
    <p>{{ pessoa.endereco.rua }}, {{ pessoa.endereco.numero }}</p>
  }
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Bloco de HTML renderiza um item de lista | Extrair para Dumb Component com @Input |
| Input sempre deve ter valor | Usar `required: true` |
| Objeto grande como input | Criar interface em arquivo separado |
| Precisa renomear input sem quebrar consumidores | Usar alias: `@Input({ alias: 'nomeAntigo' })` |
| Componente filho precisa transformar valor recebido | Usar `transform` no @Input |
| Propriedade do input tem tipo objeto opcional | Marcar com `?` na interface |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Input() pessoa: any` | `@Input({ required: true }) pessoa!: IPessoa` |
| Interface dentro do componente | Interface em `interfaces/pessoa.interface.ts` |
| `pessoa: IPessoa = { id: 0, nome: '', ... }` | `pessoa!: IPessoa` (com required: true) |
| Componente filho com HTTP requests | Dumb Component que so recebe e exibe |
| `@Input({ alias: 'x' })` sem motivo | `@Input()` com nome da propriedade direto |
| Toda logica num componente gigante | Separar em componentes menores com @Input |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
