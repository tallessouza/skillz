---
name: rs-angular-pub-sub-observable
description: "Applies Observable patterns when writing Angular code with RxJS. Use when user asks to 'create observable', 'subscribe to data', 'handle HTTP response', 'use async pipe', or 'manage subscriptions'. Enforces subscribe/unsubscribe lifecycle, AsyncPipe preference for template-only values, and proper typing. Make sure to use this skill whenever generating Angular code that involves Observables, HTTP calls, or reactive data. Not for state management with BehaviorSubject, nor for non-Angular RxJS usage."
---

# Observables no Angular

> Sempre se inscreva para receber valores de um Observable e sempre se desinscreva quando nao precisar mais ouvir.

## Rules

1. **Observable so executa com subscribe** — sem subscribe, o bloco interno nao roda, porque Observables sao lazy por design (isso causa bugs silenciosos em HTTP calls)
2. **Sempre se desinscreva em subscricoes manuais** — use `ngOnDestroy` para chamar `unsubscribe()`, porque a inscricao continua ativa mesmo apos o componente ser destruido, causando memory leaks e bugs
3. **Prefira AsyncPipe quando o valor vai direto pro template** — evita subscribe manual, unsubscribe manual, e propriedade intermediaria na classe, porque o AsyncPipe se inscreve e desinscreve automaticamente
4. **Subscribe manual so quando precisar executar logica na classe** — transformar valor, chamar metodo, executar side effect, porque nesses casos o AsyncPipe nao resolve
5. **Nomeie propriedades Observable com sufixo $** — `users$`, `list$`, porque e convencao RxJS que indica instancia de Observable
6. **Tipar o Observable com generic** — `new Observable<number>()`, porque impede emissao de tipos errados

## How to write

### Criar Observable tipado

```typescript
import { Observable } from 'rxjs';

myObservable$: Observable<number> | undefined;

criarObservable() {
  this.myObservable$ = new Observable<number>((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    // emissao assincrona tambem funciona
    setTimeout(() => subscriber.next(3), 3000);
  });
}
```

### Subscribe manual com unsubscribe

```typescript
import { Subscription } from 'rxjs';

mySub: Subscription | undefined;

ngOnInit() {
  this.mySub = this.myObservable$?.subscribe((valor) => {
    // logica que precisa rodar na classe
    this.processarValor(valor);
  });
}

ngOnDestroy() {
  this.mySub?.unsubscribe();
}
```

### AsyncPipe no template (preferido)

```typescript
// Component
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @let lista = observableLista$ | async;
    @for (item of lista; track item) {
      <p>{{ item }}</p>
    }
  `
})
export class MeuComponent {
  observableLista$: Observable<string[]> | undefined;
}
```

## Example

**Before (subscribe desnecessario para valor de template):**

```typescript
export class ListComponent implements OnInit, OnDestroy {
  names: string[] = [];
  sub: Subscription | undefined;

  ngOnInit() {
    this.sub = this.names$.subscribe((names) => {
      this.names = names; // so aloca pra mostrar no template
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
// template: @for (name of names; track name) { <p>{{ name }}</p> }
```

**After (AsyncPipe elimina boilerplate):**

```typescript
export class ListComponent {
  names$: Observable<string[]> | undefined;
}
// template:
// @let names = names$ | async;
// @for (name of names; track name) { <p>{{ name }}</p> }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor vai direto pro template sem transformacao | AsyncPipe |
| Precisa transformar valor ou chamar metodo | Subscribe manual + unsubscribe no OnDestroy |
| HTTP Client retorna Observable | Subscribe para executar a request (sem subscribe, request nao dispara) |
| Duvida se precisa unsubscribe | Sempre faca unsubscribe — experts do Angular recomendam |
| Propriedade guarda instancia de Observable | Sufixo `$` no nome |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| Subscribe manual so pra mostrar no template | `valor$ \| async` no template |
| Subscribe sem unsubscribe | Alocar Subscription + unsubscribe no ngOnDestroy |
| `this.http.get(url)` sem subscribe | `this.http.get(url).subscribe(...)` (senao request nao executa) |
| `observable: any` | `observable$: Observable<TipoEspecifico>` |
| Acessar propriedade sem null check no unsubscribe | `this.sub?.unsubscribe()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
