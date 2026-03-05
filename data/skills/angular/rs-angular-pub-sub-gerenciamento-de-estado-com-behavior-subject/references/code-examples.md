# Code Examples: Pub-Sub com BehaviorSubject

## Estrutura de arquivos gerada na aula

```
exemplo-5/
├── behavior-context/
│   ├── behavior-context.component.ts
│   ├── behavior-context.component.html
│   └── behavior-context.component.css
└── context.service.ts
```

Gerado com:
```bash
ng generate component behavior-context
ng generate service context
```

## Service completo da aula

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface Item {
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ContextService {
  // Subject privado — apenas o service acessa .next()
  private itemsSubject = new BehaviorSubject<Item[]>([]);

  // Observable público com clone — componentes consomem este
  items$ = this.itemsSubject.pipe(
    map((itemsList: Item[]) => structuredClone(itemsList))
  );

  // Método de apoio: adicionar item
  addItem(item: Item): void {
    const currentList = this.itemsSubject.value;
    this.itemsSubject.next([...currentList, item]);
  }

  // Acesso pontual ao valor atual (clonado)
  getValue(): Item[] {
    return structuredClone(this.itemsSubject.value);
  }
}
```

## Componente consumindo o service

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ContextService } from '../context.service';

@Component({
  selector: 'app-behavior-context',
  templateUrl: './behavior-context.component.html',
})
export class BehaviorContextComponent implements OnInit {
  private readonly _contextService = inject(ContextService);

  ngOnInit(): void {
    // Inscrição reativa — recebe cada emissão clonada
    this._contextService.items$.subscribe(value => {
      console.log('Valor:', value);
    });

    // Adicionar item via método de apoio
    this._contextService.addItem({ name: 'teste', price: 123 });
  }
}
```

## Demonstração do problema: subject público

```typescript
// ERRADO — subject público permite acesso total
export class ContextService {
  itemsSubject = new BehaviorSubject<Item[]>([]);
}

// Componente pode fazer qualquer coisa:
this.contextService.itemsSubject.next([]);           // emitir valor
this.contextService.itemsSubject.complete();          // encerrar subject
this.contextService.itemsSubject.value.push(newItem); // mutar diretamente
```

## Demonstração do .asObservable()

```typescript
// asObservable limita a interface
const test = this.itemsSubject.asObservable();
// Tipagem: Observable<Item[]> (não BehaviorSubject)

// Disponível:
test.pipe(/* operadores */);
test.subscribe(value => {});

// NÃO disponível:
// test.next()     ❌
// test.value       ❌
// test.complete()  ❌
```

## Demonstração do problema de mutação sem clone

```typescript
// SEM structuredClone — todos recebem mesma referência
items$ = this.itemsSubject.asObservable();

// Componente A
this.service.items$.subscribe(items => {
  items.push({ name: 'hack', price: 0 }); // MUTOU a lista original!
});

// Componente B — recebe a lista mutada pelo Componente A
this.service.items$.subscribe(items => {
  console.log(items); // inclui { name: 'hack' } inesperadamente
});
```

## Variação: service com múltiplos métodos de apoio

```typescript
@Injectable({ providedIn: 'root' })
export class ContextService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);

  items$ = this.itemsSubject.pipe(
    map(items => structuredClone(items))
  );

  addItem(item: Item): void {
    this.itemsSubject.next([...this.itemsSubject.value, item]);
  }

  removeItem(index: number): void {
    const current = this.itemsSubject.value;
    this.itemsSubject.next(current.filter((_, i) => i !== index));
  }

  updateItem(index: number, updated: Item): void {
    const current = [...this.itemsSubject.value];
    current[index] = updated;
    this.itemsSubject.next(current);
  }

  clearItems(): void {
    this.itemsSubject.next([]);
  }

  getValue(): Item[] {
    return structuredClone(this.itemsSubject.value);
  }
}
```

## Fallback com lodash para navegadores antigos

```typescript
import cloneDeep from 'lodash/cloneDeep';

// Substituir structuredClone por cloneDeep
items$ = this.itemsSubject.pipe(
  map(items => cloneDeep(items))
);

getValue(): Item[] {
  return cloneDeep(this.itemsSubject.value);
}
```