---
name: rs-angular-output-decorator
description: "Enforces correct @Output and EventEmitter patterns when writing Angular components. Use when user asks to 'emit events', 'send data to parent', 'create output', 'communicate child to parent', or 'remove item from list via child component'. Applies rules: always use EventEmitter with generic typing, use $event to capture emitted values, keep child components as dumb components. Make sure to use this skill whenever creating Angular component communication from child to parent. Not for @Input, services, or state management patterns."
---

# @Output e EventEmitter no Angular

> Componentes filhos emitem eventos tipados para o pai via @Output + EventEmitter — nunca manipulam dados que nao lhes pertencem.

## Rules

1. **Sempre crie uma instancia de EventEmitter** — `new EventEmitter<Type>()`, porque @Output sem EventEmitter nao emite nada
2. **Sempre tipar o EventEmitter com generics** — `EventEmitter<number>`, porque impede emissao de tipos errados em compile time
3. **Use $event no template do pai** — `(outputName)="metodo($event)"`, porque e a palavra reservada do Angular para capturar o valor emitido
4. **Importe do @angular/core** — tanto `Output` quanto `EventEmitter` vem de `@angular/core`, porque outras bibliotecas exportam nomes similares
5. **Componente filho e Dumb Component** — ele emite o evento, mas quem processa a logica de negocio e o pai, porque o filho so mostra dados e emite intencoes
6. **Emit pode ser vazio** — `this.meuOutput.emit()` sem valor e valido quando o pai so precisa saber que algo aconteceu

## How to write

### Declarando o @Output no componente filho

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({ selector: 'app-pessoa', templateUrl: './pessoa.component.html' })
export class PessoaComponent {
  @Input() pessoa: { id: number; nome: string } = { id: 0, nome: '' };
  @Output() removerPessoaEmit = new EventEmitter<number>();

  removerPessoa(pessoaId: number): void {
    this.removerPessoaEmit.emit(pessoaId);
  }
}
```

### Template do componente filho

```html
<p>{{ pessoa.nome }}</p>
<button (click)="removerPessoa(pessoa.id)">Remover</button>
```

### Pai se inscrevendo no Output

```html
<app-pessoa
  *ngFor="let pessoa of pessoas"
  [pessoa]="pessoa"
  (removerPessoaEmit)="removerPessoaEspecifica($event)"
></app-pessoa>
```

### Metodo do pai que processa o evento

```typescript
removerPessoaEspecifica(pessoaId: number): void {
  this.pessoas = this.pessoas.filter(pessoa => pessoa.id !== pessoaId);
}
```

## Example

**Before (logica no filho — errado):**
```typescript
// filho manipulando dados do pai diretamente
@Input() pessoas: Pessoa[] = [];

remover(id: number): void {
  this.pessoas = this.pessoas.filter(p => p.id !== id); // ERRADO: filho nao gerencia a lista
}
```

**After (com @Output — correto):**
```typescript
// filho emite intencao, pai processa
@Output() removerPessoaEmit = new EventEmitter<number>();

remover(id: number): void {
  this.removerPessoaEmit.emit(id); // CORRETO: apenas emite o ID
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Filho precisa alterar dados do pai | Emitir evento via @Output, pai processa |
| Nao precisa enviar valor, so notificar | `this.meuOutput.emit()` sem argumento |
| Precisa enviar objeto complexo | Tipar generico: `EventEmitter<{ id: number; nome: string }>` |
| Nome do metodo no pai | Nao precisa ser igual ao nome do Output |
| Autocomplete nao importa do core | Verificar manualmente se import vem de `@angular/core` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `@Output() remover = new EventEmitter()` (sem tipo) | `@Output() remover = new EventEmitter<number>()` |
| `(removerEmit)="metodo(id)"` (variavel local) | `(removerEmit)="metodo($event)"` |
| Filho filtrando array do pai diretamente | Filho emite ID, pai faz o filter |
| Import EventEmitter de `events` ou `rxjs` | Import de `@angular/core` |
| `@Output() remover: EventEmitter<number>` sem instanciar | `@Output() remover = new EventEmitter<number>()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
