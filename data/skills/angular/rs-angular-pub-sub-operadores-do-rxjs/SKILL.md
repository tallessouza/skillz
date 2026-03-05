---
name: rs-angular-pub-sub-operadores-rxjs
description: "Applies RxJS pipe operators (map, filter, tap) when writing Angular Observable chains. Use when user asks to 'transform observable data', 'filter emissions', 'debug observable', 'use pipe operators', or 'manipulate data before subscribe'. Enforces correct operator selection: map for transformation, filter for conditional emission, tap for side effects. Make sure to use this skill whenever writing Observable.pipe() chains in Angular. Not for creating Observables, Subject/BehaviorSubject setup, or unsubscribe management."
---

# Operadores RxJS: map, filter, tap

> Manipule valores emitidos por um Observable dentro do `.pipe()` antes de chegarem no `.subscribe()`.

## Rules

1. **Use `.pipe()` entre o Observable e o `.subscribe()`** — todos os operadores RxJS vivem dentro do pipe, porque separam transformacao de consumo
2. **`map` transforma e retorna um novo valor** — recebe o valor emitido, retorna um valor diferente (novo array, objeto modificado, etc.), porque o subscribe deve receber dados ja prontos para uso
3. **`filter` retorna booleano para decidir se o valor passa** — `true` permite que o valor chegue ao subscribe, `false` bloqueia a emissao, porque evita logica condicional dentro do subscribe
4. **`tap` executa efeitos colaterais sem alterar o fluxo** — use para console.log, chamadas de funcoes auxiliares, debugging, porque o valor emitido passa intacto para o proximo operador
5. **Nunca confunda `map` do RxJS com `Array.map`** — o `map` do RxJS opera sobre emissoes do Observable, o `Array.map` opera sobre itens de um array; frequentemente usados juntos dentro do callback do map RxJS
6. **Ordem dos operadores importa** — `tap` antes de `filter` loga todos os valores; `tap` depois de `filter` loga apenas os filtrados, porque o pipe executa operadores sequencialmente

## How to write

### map — transformar emissoes

```typescript
import { map } from 'rxjs';

this.listaObservavel$
  .pipe(
    map((lista) => lista.map((nome) => nome.toUpperCase()))
  )
  .subscribe((listaMaiuscula) => {
    console.log(listaMaiuscula);
  });
```

### filter — selecionar emissoes por condicao

```typescript
import { filter } from 'rxjs';

this.meuObservavel$
  .pipe(
    filter((numero) => numero % 2 !== 0)
  )
  .subscribe((numeroImpar) => {
    console.log(numeroImpar);
  });
```

### tap — efeitos colaterais sem alterar o fluxo

```typescript
import { tap, filter } from 'rxjs';

this.meuObservavel$
  .pipe(
    tap((numero) => console.log('Antes do filter:', numero)),
    filter((numero) => numero % 2 !== 0)
  )
  .subscribe((numeroImpar) => {
    console.log('Ímpar:', numeroImpar);
  });
```

### Caso real: BehaviorSubject com clone via map

```typescript
private productsSubject$ = new BehaviorSubject<Product[]>([]);

products$ = this.productsSubject$.asObservable().pipe(
  map((lista) => structuredClone(lista))
);
```

## Example

**Before (logica misturada no subscribe):**
```typescript
this.observable$.subscribe((numeros) => {
  const impares = numeros.filter(n => n % 2 !== 0);
  const maiusculos = impares.map(n => n.toString().toUpperCase());
  console.log(maiusculos);
});
```

**After (operadores no pipe):**
```typescript
this.observable$
  .pipe(
    tap((numeros) => console.log('Emitido:', numeros)),
    map((numeros) => numeros.filter((n) => n % 2 !== 0)),
    map((impares) => impares.map((n) => n.toString().toUpperCase()))
  )
  .subscribe((resultado) => {
    console.log(resultado);
  });
```

## Heuristics

| Situacao | Operador |
|----------|----------|
| Precisa transformar o valor emitido | `map` |
| Precisa bloquear emissoes que nao atendem condicao | `filter` |
| Precisa logar ou debugar sem alterar o fluxo | `tap` |
| Precisa clonar dados antes de entregar ao subscriber | `map` com structuredClone |
| Precisa executar funcao auxiliar sem mudar dados | `tap` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| Logica de transformacao dentro do subscribe | `pipe(map(...))` antes do subscribe |
| `if` dentro do subscribe para filtrar | `pipe(filter(...))` antes do subscribe |
| `console.log` dentro do map (e retornar valor) | `tap` separado antes ou depois do map |
| `filter` que retorna valor transformado | `filter` retorna boolean, use `map` para transformar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
