---
name: rs-angular-ng-on-changes
description: "Applies Angular ngOnChanges lifecycle hook patterns when writing components with inputs. Use when user asks to 'detect input changes', 'react to input updates', 'use ngOnChanges', 'handle component input changes', or 'track previous values in Angular'. Enforces immutable object references for change detection, proper SimpleChanges access, and guards against manual lifecycle invocation. Make sure to use this skill whenever implementing Angular components that need to react to input property changes. Not for ngOnInit, ngOnDestroy, or other lifecycle hooks unrelated to input change detection."
---

# ngOnChanges — Ciclo de Vida de Inputs

> Sempre que precisar executar logica quando um input do componente mudar, use ngOnChanges — nunca invoque lifecycles manualmente.

## Rules

1. **Implemente a interface OnChanges** — `implements OnChanges` no componente, porque torna explicito que o componente reage a mudancas de input
2. **Nunca invoque lifecycles manualmente** — nao chame `this.ngOnChanges()` no codigo, porque o Angular gerencia os ciclos de vida internamente e chamar na mao causa comportamento imprevisivel
3. **Acesse inputs pelo nome dinamico** — use `changes['inputName']` porque o tipo `SimpleChanges` tem indice string dinamico e nao oferece autocomplete
4. **Verifique existencia antes de acessar** — sempre faca `if (changes['prop'] && changes['prop'].currentValue)` porque nem todos os inputs mudam a cada disparo
5. **Passe nova referencia para objetos e arrays** — mude via spread `{ ...obj, prop: newValue }`, porque mutar propriedades internas NAO dispara ngOnChanges para objetos/arrays
6. **Tipos primitivos disparam automaticamente** — string, number e boolean disparam ngOnChanges apenas por mudar o valor, sem necessidade de nova referencia

## How to write

### Implementacao basica

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({ /* ... */ })
export class PessoaComponent implements OnChanges {
  @Input() pessoa!: { nome: string; idade: number };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoa']?.currentValue) {
      const pessoaAtual = changes['pessoa'].currentValue;
      // Execute logica com o valor atualizado
    }
  }
}
```

### Atualizando objeto no componente pai (nova referencia)

```typescript
// CORRETO — nova referencia, dispara ngOnChanges
this.pessoas[0] = { ...this.pessoas[0], nome: 'atualizado' };

// ERRADO — mutacao direta, NAO dispara ngOnChanges
this.pessoas[0].nome = 'atualizado';
```

## Example

**Before (mutacao direta — ngOnChanges nao dispara):**

```typescript
mudarNome(): void {
  this.pessoas[0].nome = 'atualizado';
}
```

**After (nova referencia — ngOnChanges dispara corretamente):**

```typescript
mudarNome(): void {
  this.pessoas[0] = { ...this.pessoas[0], nome: 'atualizado' };
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Input e primitivo (string, number, boolean) | Apenas mude o valor, ngOnChanges dispara automaticamente |
| Input e objeto ou array | Sempre crie nova referencia com spread |
| Precisa do valor anterior | Use `changes['prop'].previousValue` |
| Precisa saber se e a primeira vez | Use `changes['prop'].firstChange` (boolean) |
| Componente tem multiplos inputs | ngOnChanges dispara para qualquer mudanca — verifique qual input mudou |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `this.ngOnChanges(...)` | Deixe o Angular invocar automaticamente |
| `this.pessoa.nome = 'x'` no pai | `this.pessoa = { ...this.pessoa, nome: 'x' }` |
| `console.log(changes.pessoa)` sem verificar | `if (changes['pessoa']?.currentValue) { ... }` |
| Logica pesada direto no ngOnChanges | Extraia para um metodo separado chamado dentro do if |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
