---
name: rs-angular-pub-sub-classe-subject
description: "Applies RxJS Subject patterns when writing Angular services and component communication. Use when user asks to 'create a service', 'communicate between components', 'share data between components', 'use Subject', 'implement pub-sub', or 'notify components'. Enforces Subject vs BehaviorSubject selection, multicast patterns, and service-based Subject architecture. Make sure to use this skill whenever implementing inter-component communication in Angular. Not for HTTP requests, simple parent-child Input/Output binding, or route-based data sharing."
---

# RxJS Subject — Comunicacao entre Componentes Angular

> Use Subject quando precisar notificar multiplos componentes sobre eventos futuros sem necessidade do ultimo valor emitido.

## Rules

1. **Subject dentro de Service, nunca dentro de Component** — porque o Service tem instancia unica (singleton) na aplicacao, permitindo que qualquer componente se inscreva no mesmo Subject
2. **Subject nao tem memoria** — novos assinantes so recebem valores emitidos APOS a inscricao, porque ele nao guarda o ultimo valor (use BehaviorSubject se precisar do ultimo valor)
3. **Subject e multicast** — um unico `.next()` notifica todos os inscritos, diferente do Observable normal que reexecuta a logica para cada subscriber
4. **Tipar o Subject com generics** — `new Subject<string>()` porque garante type-safety nos valores emitidos e recebidos no subscribe
5. **Sufixo `$` em propriedades Observable** — `meuSubject$` para indicar que e um Observable, porque e convencao da comunidade Angular/RxJS
6. **Expor como Observable, emitir internamente** — o Service expoe `.asObservable()` e controla `.next()` internamente, porque evita que consumidores externos emitam valores

## How to write

### Service com Subject

```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<string>();

  // Expor apenas como Observable (leitura)
  notification$ = this.notificationSubject.asObservable();

  // Metodo para emitir valores (escrita controlada)
  notify(message: string): void {
    this.notificationSubject.next(message);
  }
}
```

### Componente emissor

```typescript
@Component({ /* ... */ })
export class EmitterComponent {
  private notificationService = inject(NotificationService);

  onAction(): void {
    this.notificationService.notify('Algo aconteceu!');
  }
}
```

### Componente receptor

```typescript
@Component({ /* ... */ })
export class ReceiverComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        console.log('Recebido:', value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Example

**Before (acoplamento via Input/Output entre componentes nao relacionados):**

```typescript
// Componente pai precisa intermediar tudo
<app-emitter (event)="value = $event"></app-emitter>
<app-receiver [value]="value"></app-receiver>
```

**After (Subject no Service desacopla comunicacao):**

```typescript
// Emitter injeta o service e emite
this.notificationService.notify('Novo evento');

// Receiver injeta o mesmo service e recebe
this.notificationService.notification$.subscribe(val => { /* ... */ });
// Componentes nao se conhecem — o Service e o mediador
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componentes sem relacao pai-filho precisam comunicar | Subject dentro de Service |
| Precisa do ultimo valor ao se inscrever | Use BehaviorSubject, nao Subject |
| Evento unico tipo "notificacao" | Subject e suficiente |
| Valor e exibido no template | Use `async` pipe com o Observable exposto |
| Componente e destruido | `takeUntil(destroy$)` ou unsubscribe no `ngOnDestroy` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `new Subject()` dentro do componente para comunicar com outro | Subject dentro de um Service singleton |
| Expor o Subject diretamente no Service | Expor `.asObservable()` e controlar `.next()` via metodo |
| Esquecer de fazer unsubscribe | `takeUntil(destroy$)` no `ngOnDestroy` |
| Usar Subject quando precisa do valor inicial | Usar `BehaviorSubject` com valor default |
| Passar Input/Output entre 5 niveis de componentes | Subject no Service como mediador |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
