# Code Examples: RxJS Subject no Angular

## Exemplo 1: Criacao basica do Subject (da aula)

```typescript
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-subject',
  template: `
    <p>subject works!</p>
    <button (click)="segundaInscricao()">Se inscrever</button>
  `
})
export class SubjectComponent implements OnInit {
  meuSubject$ = new Subject<string>();

  ngOnInit(): void {
    this.criarSubject();
  }

  criarSubject(): void {
    // Emissao SEM assinantes — valor perdido, sem erro
    this.meuSubject$.next('Valor inicial');

    // Primeira inscricao — NAO recebe o valor acima
    this.meuSubject$.subscribe(value => {
      console.log('Primeira inscricao:', value);
    });

    // Emissao COM assinante — primeira inscricao recebe
    this.meuSubject$.next('Novo valor emitido');

    // Emissao assincrona — quem estiver inscrito recebe apos 3s
    setTimeout(() => {
      this.meuSubject$.next('Valor assincrono apos 3s');
    }, 3000);

    // Emissao assincrona — quem estiver inscrito recebe apos 6s
    setTimeout(() => {
      this.meuSubject$.next('Valor assincrono apos 6s');
    }, 6000);
  }

  segundaInscricao(): void {
    // Se clicar antes dos 6s, recebera o valor de 6s
    // NAO recebera valores ja emitidos
    this.meuSubject$.subscribe(value => {
      console.log('Segunda inscricao:', value);
    });
  }
}
```

### Resultado no console (clicando o botao antes dos 6s):

```
// Imediato:
Primeira inscricao: Novo valor emitido

// Apos 3s:
Primeira inscricao: Valor assincrono apos 3s

// Apos 6s (ambos recebem):
Primeira inscricao: Valor assincrono apos 6s
Segunda inscricao: Valor assincrono apos 6s
```

## Exemplo 2: Padrao Service (recomendado pelo instrutor)

### Service

```typescript
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private actionSubject = new Subject<string>();

  // Expor somente leitura
  action$: Observable<string> = this.actionSubject.asObservable();

  emitAction(action: string): void {
    this.actionSubject.next(action);
  }
}
```

### Componente A (emissor)

```typescript
import { Component, inject } from '@angular/core';
import { EventBusService } from '../services/event-bus.service';

@Component({
  selector: 'app-component-a',
  template: `
    <button (click)="notificar()">Notificar Componente B</button>
  `
})
export class ComponentAComponent {
  private eventBus = inject(EventBusService);

  notificar(): void {
    this.eventBus.emitAction('Acao do Componente A');
  }
}
```

### Componente B (receptor)

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventBusService } from '../services/event-bus.service';

@Component({
  selector: 'app-component-b',
  template: `
    <p>Ultimo valor: {{ ultimoValor }}</p>
  `
})
export class ComponentBComponent implements OnInit, OnDestroy {
  private eventBus = inject(EventBusService);
  private destroy$ = new Subject<void>();
  ultimoValor = '';

  ngOnInit(): void {
    this.eventBus.action$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.ultimoValor = value;
        console.log('Componente B recebeu:', value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Exemplo 3: Usando async pipe no template (alternativa mencionada pelo instrutor)

```typescript
@Component({
  selector: 'app-component-b',
  template: `
    <p>Valor: {{ eventBus.action$ | async }}</p>
  `
})
export class ComponentBComponent {
  eventBus = inject(EventBusService);
  // Sem necessidade de subscribe manual ou OnDestroy
  // O async pipe gerencia a inscricao automaticamente
}
```

## Exemplo 4: Subject tipado com interface

```typescript
interface UserEvent {
  userId: string;
  action: 'login' | 'logout' | 'update';
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class UserEventService {
  private eventSubject = new Subject<UserEvent>();
  event$ = this.eventSubject.asObservable();

  emit(userId: string, action: UserEvent['action']): void {
    this.eventSubject.next({
      userId,
      action,
      timestamp: new Date()
    });
  }
}
```