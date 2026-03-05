---
name: rs-angular-slice-pipe-arrays
description: "Applies Angular SlicePipe patterns for array manipulation in templates. Use when user asks to 'paginate a list', 'limit displayed items', 'slice an array in template', 'show last N items', or 'implement pagination in Angular'. Covers start/end index logic, negative indices, and dynamic pagination with computed properties. Make sure to use this skill whenever implementing list pagination or array subsetting in Angular templates. Not for JavaScript Array.prototype.slice outside Angular, nor for string slicing with SlicePipe."
---

# SlicePipe para Manipulacao de Arrays

> Use o SlicePipe do Angular no template para extrair subconjuntos de arrays sem logica imperativa no componente.

## Rules

1. **O parametro `end` extrai ate `end - 1`** — `slice:0:3` retorna indices 0, 1 e 2 (3 itens), porque o end e exclusivo
2. **Use com `@for` para iterar sobre o subconjunto** — o retorno do pipe alimenta diretamente o loop, sem variavel intermediaria
3. **Valores negativos contam do final** — `slice:-2` extrai os 2 ultimos elementos do array
4. **Omitir `end` extrai ate o final** — `slice:3` pega do indice 3 ate o ultimo elemento
5. **Paginacao dinamica usa propriedades computadas** — calcule `startIndex` e `endIndex` via getters no componente, passe como binding ao pipe
6. **Formula de paginacao: start = (page - 1) * pageSize, end = page * pageSize** — porque o end exclusivo do slice coincide exatamente com page * pageSize

## How to write

### Limitar primeiros N itens

```html
@for (item of items | slice:0:3; track item) {
  <li>{{ item }}</li>
}
```

### Extrair a partir de um indice

```html
<!-- Do indice 3 ate o final -->
@for (fruit of fruits | slice:3; track fruit) {
  <span>{{ fruit }}</span>
}
```

### Ultimos N itens (valor negativo)

```html
@for (log of errorLogs | slice:-2; track log) {
  <p>{{ log }}</p>
}
```

### Paginacao dinamica com variaveis de controle

```typescript
// No componente
clients = ['Ana', 'Bruno', 'Carlos', 'Daniela', 'Eduardo', 'Fernanda', 'Gustavo', 'Helena', 'Ivan'];
itemsPerPage = 3;
currentPage = 1;

get startIndex(): number {
  return (this.currentPage - 1) * this.itemsPerPage;
}

get endIndex(): number {
  return this.currentPage * this.itemsPerPage;
}

changePage(page: number): void {
  this.currentPage = page;
}
```

```html
<!-- Template -->
<button (click)="changePage(1)" [disabled]="currentPage === 1">Pagina 1</button>
<button (click)="changePage(2)" [disabled]="currentPage === 2">Pagina 2</button>
<button (click)="changePage(3)" [disabled]="currentPage === 3">Pagina 3</button>

<p>Start: {{ startIndex }} | End: {{ endIndex }}</p>

@for (client of clients | slice:startIndex:endIndex; track client) {
  <li>{{ client }}</li>
}
```

## Example

**Before (logica imperativa no componente):**

```typescript
get paginatedClients(): string[] {
  return this.clients.slice(this.startIndex, this.endIndex);
}
```
```html
@for (client of paginatedClients; track client) {
  <li>{{ client }}</li>
}
```

**After (com SlicePipe no template):**

```html
@for (client of clients | slice:startIndex:endIndex; track client) {
  <li>{{ client }}</li>
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mostrar primeiros N itens de uma lista | `slice:0:N` |
| Mostrar a partir do item N | `slice:N` (sem end) |
| Mostrar ultimos N itens | `slice:-N` |
| Paginacao com pagina variavel | Getters computados + `slice:startIndex:endIndex` |
| Precisa do indice real do item | Nao use slice, use logica no componente |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `slice:0:3` esperando 4 itens | `slice:0:4` — end e exclusivo, end-1 e o ultimo indice |
| Getter que retorna `array.slice()` so pra iterar | `array \| slice:start:end` direto no template |
| `slice:start:end` com valores hardcoded para paginacao | Propriedades computadas `startIndex`/`endIndex` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
