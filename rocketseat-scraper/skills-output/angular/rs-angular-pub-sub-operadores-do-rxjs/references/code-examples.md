# Code Examples: Operadores RxJS (map, filter, tap)

## Exemplo 1: map — converter lista para maiuscula

### Observable fonte (lista de nomes)

```typescript
// Observable que emite uma lista de nomes
listaObservavel$ = new Observable<string[]>((subscriber) => {
  setTimeout(() => {
    subscriber.next(['Felipe', 'Laura', 'Gustavo']);
    subscriber.complete();
  }, 1000);
});
```

### Sem pipe (dados brutos)

```typescript
inscricaoListaMaiuscula() {
  this.listaObservavel$.subscribe((lista) => {
    console.log('Lista maiúscula:', lista);
    // Output: ['Felipe', 'Laura', 'Gustavo'] — sem transformacao
  });
}
```

### Com pipe + map

```typescript
import { map } from 'rxjs';

inscricaoListaMaiuscula() {
  this.listaObservavel$
    .pipe(
      map((lista) => {
        console.log('Lista original:', lista);
        return lista.map((nome) => nome.toUpperCase());
      })
    )
    .subscribe((lista) => {
      console.log('Lista maiúscula:', lista);
      // Output: ['FELIPE', 'LAURA', 'GUSTAVO']
    });
}
```

### Passo a passo

1. Observable emite `['Felipe', 'Laura', 'Gustavo']`
2. `map` do RxJS recebe essa lista inteira como parametro
3. Dentro do map, `Array.map` transforma cada nome com `.toUpperCase()`
4. `map` do RxJS retorna a nova lista `['FELIPE', 'LAURA', 'GUSTAVO']`
5. Subscribe recebe a lista ja transformada

---

## Exemplo 2: filter — apenas numeros impares

### Observable fonte (emissoes individuais)

```typescript
meuObservavel$ = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});
```

### Sem filter

```typescript
inscricaoNumerosImpares() {
  this.meuObservavel$.subscribe((numero) => {
    console.log('Número ímpar:', numero);
    // Output: 1, 2, 3, 4 — todos passam
  });
}
```

### Com filter

```typescript
import { filter } from 'rxjs';

inscricaoNumerosImpares() {
  this.meuObservavel$
    .pipe(
      filter((numero) => numero % 2 !== 0)
    )
    .subscribe((numero) => {
      console.log('Número ímpar:', numero);
      // Output: 1, 3 — apenas impares
    });
}
```

### Variacao: apenas pares

```typescript
.pipe(
  filter((numero) => numero % 2 === 0)
)
// Output: 2, 4
```

### Demonstracao de true/false

```typescript
// Tudo bloqueado
.pipe(filter(() => false))
// Output: nenhum valor chega ao subscribe

// Tudo passa
.pipe(filter(() => true))
// Output: 1, 2, 3, 4
```

---

## Exemplo 3: tap + filter combinados

```typescript
import { tap, filter } from 'rxjs';

inscricaoNumerosImpares() {
  this.meuObservavel$
    .pipe(
      tap((numero) => console.log('TAP:', numero)),
      filter((numero) => numero % 2 !== 0)
    )
    .subscribe((numero) => {
      console.log('Número ímpar:', numero);
    });
}

// Console output:
// TAP: 1
// Número ímpar: 1
// TAP: 2
// TAP: 3
// Número ímpar: 3
// TAP: 4  (apos 1 segundo)
```

### Observacoes

- tap loga TODOS os valores (1, 2, 3, 4) porque esta antes do filter
- filter bloqueia 2 e 4 (pares)
- subscribe so recebe 1 e 3

---

## Exemplo 4: Caso real — BehaviorSubject com map para clone

```typescript
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsSubject$ = new BehaviorSubject<Product[]>([]);

  // Cada subscriber recebe um clone da lista
  products$ = this.productsSubject$.asObservable().pipe(
    map((lista) => structuredClone(lista))
  );
}
```

### Por que clonar?

- Sem clone: todos os subscribers compartilham a mesma referencia
- Com clone via map: cada subscriber recebe uma copia independente
- Mutacoes em um componente nao afetam outros componentes

---

## Exemplo 5: Combinando multiplos operadores

```typescript
import { tap, filter, map } from 'rxjs';

this.meuObservavel$
  .pipe(
    tap((numero) => console.log('Emitido:', numero)),
    filter((numero) => numero % 2 !== 0),
    tap((numero) => console.log('Passou no filter:', numero)),
    map((numero) => numero * 10)
  )
  .subscribe((resultado) => {
    console.log('Final:', resultado);
  });

// Console output:
// Emitido: 1
// Passou no filter: 1
// Final: 10
// Emitido: 2
// Emitido: 3
// Passou no filter: 3
// Final: 30
// Emitido: 4
```

### Fluxo para o valor 1:
1. tap loga "Emitido: 1"
2. filter: 1 % 2 !== 0 → true → passa
3. tap loga "Passou no filter: 1"
4. map: 1 * 10 → retorna 10
5. subscribe recebe 10

### Fluxo para o valor 2:
1. tap loga "Emitido: 2"
2. filter: 2 % 2 !== 0 → false → bloqueado
3. Nenhum operador subsequente executa
4. Subscribe nao recebe nada