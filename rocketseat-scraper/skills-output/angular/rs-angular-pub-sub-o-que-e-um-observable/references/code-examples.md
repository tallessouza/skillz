# Code Examples: Observables no Angular

## Exemplo 1: Criando Observable e se inscrevendo manualmente

### Componente completo do instrutor

```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-observables',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './observables.component.html',
})
export class ObservablesComponent implements OnInit, OnDestroy {
  meuObservable$: Observable<number> | undefined;
  observableLista$: Observable<string[]> | undefined;
  meuSubs: Subscription | undefined;

  ngOnInit() {
    this.criarObservable();
    this.inscricao1();
    this.criarObservableLista();
  }

  criarObservable() {
    this.meuObservable$ = new Observable<number>((subscriber) => {
      console.log('Executando observable');
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);

      setTimeout(() => {
        subscriber.next(4);
      }, 4000);
    });
  }

  inscricao1() {
    this.meuSubs = this.meuObservable$?.subscribe((valor) => {
      console.log(valor);
    });
  }

  criarObservableLista() {
    this.observableLista$ = new Observable<string[]>((subscriber) => {
      setTimeout(() => {
        subscriber.next(['Felipe', 'Laura', 'Gustavo', 'Pedro']);
      }, 5000);

      setTimeout(() => {
        subscriber.next(['Felipe', 'Laura']);
      }, 10000);
    });
  }

  ngOnDestroy() {
    this.meuSubs?.unsubscribe();
  }
}
```

### Template com AsyncPipe e @let

```html
<!-- Subscribe manual logou no console -->
<!-- AsyncPipe no template para a lista -->
@let listaDeNomes = observableLista$ | async;
@for (nome of listaDeNomes; track nome) {
  <p>{{ nome }}</p>
}
```

## Exemplo 2: O que acontece SEM subscribe

```typescript
// Este bloco NUNCA executa porque ninguem fez subscribe
this.meuObservable$ = new Observable<number>((subscriber) => {
  console.log('Isso nunca aparece no console');
  subscriber.next(1);
});

// Faltou: this.meuObservable$.subscribe(...)
```

## Exemplo 3: Emissao assincrona simulando HTTP

```typescript
// Simula o comportamento de uma chamada HTTP
this.dados$ = new Observable<string[]>((subscriber) => {
  setTimeout(() => {
    subscriber.next(['Produto A', 'Produto B', 'Produto C']);
  }, 2000);
});

// Sem subscribe, a "request" nao acontece
// Com subscribe:
this.dados$.subscribe((produtos) => {
  console.log(produtos); // ['Produto A', 'Produto B', 'Produto C']
});
```

## Exemplo 4: Reatividade do AsyncPipe

O instrutor demonstrou que o AsyncPipe reage a multiplas emissoes:

```typescript
this.observableLista$ = new Observable<string[]>((subscriber) => {
  // Primeira emissao: 5 segundos
  setTimeout(() => {
    subscriber.next(['Felipe', 'Laura', 'Gustavo', 'Pedro']);
  }, 5000);

  // Segunda emissao: 10 segundos — template atualiza automaticamente
  setTimeout(() => {
    subscriber.next(['Felipe', 'Laura']);
  }, 10000);
});
```

No template, a lista mostrou 4 nomes e depois automaticamente atualizou para 2 nomes — sem nenhum codigo adicional na classe.

## Exemplo 5: Padrao errado vs correto para dados de template

### Errado (subscribe manual desnecessario)

```typescript
// Classe
names: string[] = [];
sub: Subscription | undefined;

ngOnInit() {
  this.sub = this.namesObservable$.subscribe((val) => {
    this.names = val; // aloca so pra passar pro template
  });
}

ngOnDestroy() {
  this.sub?.unsubscribe();
}
```

```html
<!-- Template -->
@for (name of names; track name) {
  <p>{{ name }}</p>
}
```

### Correto (AsyncPipe direto)

```typescript
// Classe — nenhum subscribe, nenhum unsubscribe, nenhuma propriedade extra
namesObservable$: Observable<string[]> | undefined;
```

```html
<!-- Template -->
@let names = namesObservable$ | async;
@for (name of names; track name) {
  <p>{{ name }}</p>
}
```